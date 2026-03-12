const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/user.modules');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const Asset = require('../models/asset.model');
const Transaction = require('../models/transaction.model');
const sendEmail = require('../utils/sendEmail');

// Authentication middleware
function requireAuth(req, res, next) {
    const token = req.cookies.token;
    const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) || req.headers['content-type'] === 'application/json';
    if (!token) {
        return isAjax ? res.status(401).json({ message: 'Authentication required' }) : res.redirect('/user/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return isAjax ? res.status(401).json({ message: 'Invalid or expired token' }) : res.redirect('/user/login');
    }
}

router.get('/login', (req, res) => {
    res.render("login", { message: null, messageType: null })
});

router.get('/register', (req, res) => {
    res.render("register")
});

// Protect dashboard route
router.get('/dashboard', requireAuth, (req, res) => {
    res.render("dashboard", { user: req.user });
});

router.post('/register',
  body('username').trim().isLength({ min: 3 }),
  body('email').trim().isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid username, email, or password"
      });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    // Create JWT and set cookie, then redirect to dashboard
    const token = jwt.sign({ userId: newuser._id, username: newuser.username }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/user/dashboard');
  }
);

router.post('/login',body('username').trim().isLength({ min: 3 }),body('password').isLength({ min: 6 }), 
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            message: 'Username must be at least 3 characters and password at least 6 characters.',
            messageType: 'error'
        });
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.render('login', {
            message: 'Invalid username or password.',
            messageType: 'error'
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', {
            message: 'Invalid username or password.',
            messageType: 'error'
        });
    }

    const token = jwt.sign({ 
      userId: user._id ,
      username: user.username,
    }, process.env.JWT_SECRET);

    res.cookie('token',token, { httpOnly: true });
    res.redirect('/user/dashboard');
});

router.get('/about', (req, res) => {
    res.render("about")
});

// Asset Management Routes (all require authentication)
router.post('/assets', requireAuth, async (req, res) => {
    try {
        const { title, type, beneficiary, recoveryTime, note, credentials } = req.body;
        const asset = await Asset.create({
            user: req.user.userId,
            title,
            type,
            beneficiary,
            recoveryTime,
            note,
            credentials,
            status: 'pending',
            emailSent: false
        });
        res.status(201).json(asset);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create asset', details: err.message });
    }
});

router.get('/assets', requireAuth, async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user.userId });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch assets', details: err.message });
    }
});

// Update asset (add transaction recording if status changes to completed)
router.put('/assets/:id', requireAuth, async (req, res) => {
    try {
        const { title, type, beneficiary, recoveryTime, note, credentials, status } = req.body;
        const asset = await Asset.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { title, type, beneficiary, recoveryTime, note, credentials, status },
            { new: true }
        );
        if (!asset) return res.status(404).json({ error: 'Asset not found' });

        // If status changed to completed, record transaction
        if (status === 'completed') {
            await Transaction.create({
                user: req.user.userId,
                asset: asset._id,
                assetTitle: asset.title,
                beneficiary: asset.beneficiary,
                transferTime: new Date(),
            });
        }
        res.json(asset);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update asset', details: err.message });
    }
});

// Transaction history route
router.get('/transactions', requireAuth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.userId })
            .sort({ transferTime: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions', details: err.message });
    }
});

router.delete('/assets/:id', requireAuth, async (req, res) => {
    try {
        const asset = await Asset.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        res.json({ message: 'Asset deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete asset', details: err.message });
    }
});

// Dashboard stats route
router.get('/dashboard/stats', requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const assets = await Asset.find({ user: userId });
        const active = assets.filter(a => a.status === 'active').length;
        const pending = assets.filter(a => a.status === 'pending').length;
        // Count completed/done assets from transactions
        const Transaction = require('../models/transaction.model');
        const completed = await Transaction.countDocuments({ user: userId, status: 'done' });
        const beneficiaries = [...new Set(assets.map(a => a.beneficiary))].length;
        res.json({ active, pending, completed, beneficiaries });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
    }
});

// Key Backup - download all asset credentials as backup
router.get('/key-backup', requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await UserModel.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const assets = await Asset.find({ user: userId });
        const backup = {
            backupVersion: '1.0',
            createdAt: new Date().toISOString(),
            user: { username: user.username, email: user.email },
            assets: assets.map(a => ({
                title: a.title,
                type: a.type,
                credentials: a.credentials,
                beneficiary: a.beneficiary,
                recoveryTime: a.recoveryTime,
                status: a.status,
                note: a.note || '',
            })),
        };
        res.json(backup);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate key backup', details: err.message });
    }
});

// Delete account route
router.delete('/delete-account', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    await UserModel.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account', details: err.message });
  }
});

// Forgot Password - GET (show form)
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { message: null, messageType: null });
});

// Forgot Password - POST (send reset email)
router.post('/forgot-password', body('email').trim().isEmail(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('forgot-password', {
            message: 'Please enter a valid email address.',
            messageType: 'error'
        });
    }

    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            // Don't reveal whether email exists - always show success
            return res.render('forgot-password', {
                message: 'If an account with that email exists, a reset link has been sent.',
                messageType: 'success'
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save hashed token and expiry (1 hour) to user
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Build reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;

        // Send email
        const subject = 'SecureChain - Password Reset Request';
        const text = `You requested a password reset for your SecureChain account.\n\nClick the link below to reset your password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\n— SecureChain Team`;

        await sendEmail(email, subject, text);

        return res.render('forgot-password', {
            message: 'If an account with that email exists, a reset link has been sent.',
            messageType: 'success'
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.render('forgot-password', {
            message: 'Something went wrong. Please try again later.',
            messageType: 'error'
        });
    }
});

// Reset Password - GET (show form)
router.get('/reset-password/:token', async (req, res) => {
    try {
        const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await UserModel.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render('forgot-password', {
                message: 'Reset link is invalid or has expired. Please request a new one.',
                messageType: 'error'
            });
        }

        res.render('reset-password', { token: req.params.token, message: null, messageType: null });
    } catch (err) {
        console.error('Reset password GET error:', err);
        return res.render('forgot-password', {
            message: 'Something went wrong. Please try again.',
            messageType: 'error'
        });
    }
});

// Reset Password - POST (update password)
router.post('/reset-password/:token',
    body('password').isLength({ min: 6 }),
    body('confirmPassword').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('reset-password', {
                token: req.params.token,
                message: 'Password must be at least 6 characters.',
                messageType: 'error'
            });
        }

        try {
            const { password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.render('reset-password', {
                    token: req.params.token,
                    message: 'Passwords do not match.',
                    messageType: 'error'
                });
            }

            const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
            const user = await UserModel.findOne({
                resetPasswordToken: tokenHash,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.render('forgot-password', {
                    message: 'Reset link is invalid or has expired. Please request a new one.',
                    messageType: 'error'
                });
            }

            // Hash new password and clear reset fields
            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.render('reset-password', {
                token: req.params.token,
                message: 'Password reset successful! You can now sign in with your new password.',
                messageType: 'success'
            });
        } catch (err) {
            console.error('Reset password POST error:', err);
            return res.render('reset-password', {
                token: req.params.token,
                message: 'Something went wrong. Please try again.',
                messageType: 'error'
            });
        }
    }
);

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;