// Trigger redeploy: minor comment for Railway
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const Router = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render("index");
});

app.use('/user', Router); // Use the user routes

app.post('/delete-account', (req, res) => {
  // Your delete logic here
  // Then redirect or show a message
});

const cron = require('node-cron');
const Asset = require('./models/asset.model');
const sendAssetEmail = require('./utils/sendEmail');

// Main startup function
async function startServer() {
  const connected = await connectDB();

  if (!connected) {
    console.error('⚠️  Server will start, but the cron job is DISABLED because MongoDB is not connected.');
    console.error('   Please start MongoDB and restart the server.');
  } else {
    // Only start the cron job if DB is connected
    cron.schedule('* * * * *', async () => {
      // Safety check: make sure DB is still connected
      if (mongoose.connection.readyState !== 1) {
        console.error('⚠️  Skipping cron job — MongoDB is not connected.');
        return;
      }

      const now = new Date();
      try {
        const Transaction = require('./models/transaction.model');
        while (true) {
          // Atomically claim one asset for processing
          const asset = await Asset.findOneAndUpdate(
            { recoveryTime: { $lte: now }, emailSent: false, processing: false },
            { $set: { processing: true } },
            { new: true }
          );
          if (!asset) break; // No more assets to process
          const subject = `Asset Credentials for ${asset.title}`;
          const text = `Password: ${asset.credentials || 'N/A'}\nAdditional msg: ${asset.note || 'N/A'}`;
          console.log('Sending credentials:', JSON.stringify(asset.credentials));
          console.log('Sending note:', JSON.stringify(asset.note));
          await sendAssetEmail(asset.beneficiary, subject, text);
          // Create a transaction record only if it doesn't already exist
          const existingTx = await Transaction.findOne({ asset: asset._id });
          if (!existingTx) {
            await Transaction.create({
              user: asset.user,
              asset: asset._id,
              assetTitle: asset.title,
              beneficiary: asset.beneficiary,
              transferTime: new Date(),
              status: 'done'
            });
          }
          // Remove the asset from the assets collection
          await Asset.deleteOne({ _id: asset._id });
        }
      } catch (err) {
        console.error('Error in scheduled email delivery:', err);
      }
    });
    console.log('✅ Cron job for scheduled email delivery is active.');
  }

  app.listen(1000, () => {
    console.log('Server is running on port 1000');
  });
}

startServer();