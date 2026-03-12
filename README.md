# SecureChain: Decentralized Asset Recovery Platform

SecureChain is a robust, full-stack Node.js application designed to provide decentralized asset recovery for the blockchain era. It empowers users to securely manage digital assets, automate asset transfer, and ensure peace of mind for beneficiaries—all with a modern, user-friendly interface.

---

## 🚀 Features
- **User Authentication:** Secure registration, login, and session management.
- **Asset Management:** Add, update, and delete digital assets with beneficiary assignment.
- **Automated Asset Transfer:** Scheduled email delivery of asset credentials using cron jobs.
- **Transaction Logging:** Immutable records of asset transfers for transparency.
- **Responsive UI:** EJS-powered dynamic views and modern CSS for a seamless experience.
- **Security:** Passwords hashed with bcrypt, JWT-based authentication, and secure cookie handling.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** EJS templating, CSS
- **Database:** MongoDB (Mongoose ODM)
- **Scheduling:** node-cron
- **Email:** Nodemailer
- **Other:** dotenv, express-validator, JWT, cookie-parser

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/discoverthegithub/Securechain-asset-recovery.git
   cd Securechain-asset-recovery
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the required variables (see below).

#### Example `.env` file
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. **Start the application:**
   ```bash
   npm start
   ```
5. **Access the app:**
   Open [http://localhost:1000](http://localhost:1000) in your browser.

---

## 🚢 Deployment
This application is ready for deployment on platforms that support persistent Node.js servers, such as:
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

**Deployment Steps:**
1. Push your code to a Git repository (GitHub, GitLab, etc.).
2. Connect your repository to your chosen platform.
3. Set environment variables in the platform dashboard.
4. Deploy and enjoy your live app!

---

## 🤝 Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## 📄 License
This project is licensed under the ISC License.

---

For questions or support, please open an issue or contact the maintainer.

