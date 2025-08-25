# Email Analysis System - LucidGrowth

A comprehensive full-stack application that automatically identifies the receiving chain and ESP (Email Service Provider) type of incoming emails. Built for the LucidGrowth technical challenge, this system demonstrates advanced email header parsing, network analysis, and modern web development practices.

## ✨ Live Demo

🌐 **Application is running locally at:** `http://localhost:3000`
🔧 **Backend API available at:** `http://localhost:5000`

## 🚀 Key Features

- **📧 Automatic Email Reception**: Monitors designated email addresses and processes incoming test emails
- **🔗 Receiving Chain Analysis**: Extracts and visualizes the complete path emails take through mail servers
- **🛡️ ESP Detection**: Identifies Email Service Providers with confidence scoring and detailed analysis
- **📱 Responsive UI**: Clean, mobile-friendly interface optimized for all screen sizes
- **⚡ Real-time Processing**: Automatic email processing with live status updates
- **📊 Visual Analytics**: Interactive timeline visualization of email routing
- **🔒 Security Analysis**: Encryption and authentication status for each hop
- **📈 Performance Monitoring**: System statistics and processing metrics

## 🏗️ Architecture

```
email-analysis-system/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── routes/          # API routes
│   ├── config/              # Configuration files
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # CSS/styling
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** (Local) for data storage
- **Mongoose** for ODM
- **IMAP** for email reception
- **Email header parsing** libraries

### Frontend
- **React** with modern hooks
- **Responsive CSS** / **CSS Modules**
- **Axios** for API calls
- **React Router** for navigation

## 📧 How It Works

1. **Email Reception**: The system monitors a designated email address
2. **Subject Filtering**: Identifies test emails using a specific subject line
3. **Header Analysis**: Extracts email headers and parses receiving chain
4. **ESP Detection**: Analyzes headers to identify the sender's ESP
5. **Data Storage**: Stores raw and processed email data in MongoDB
6. **UI Display**: Presents results in an intuitive, visual format

## 🚀 Quick Start

**The system is already set up and running!**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: MongoDB (local)



**Quick Commands:**
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && npm start
```

### Testing the System

1. **Open the application**: http://localhost:3000
2. **View the dashboard**: See email configuration and system status
3. **Send test emails**: Use the displayed email address with subject containing "EMAIL_ANALYSIS_TEST"
4. **Explore results**: View receiving chains and ESP detection results

**Note**: The system works without email configuration for demonstration purposes.

## 📱 Usage

1. Open the application in your browser
2. Note the displayed email address and subject line
3. Send a test email to the provided address with the specified subject
4. View the automatically processed results showing:
   - Email receiving chain visualization
   - Detected ESP type
   - Processing timestamps

## 🧪 Testing

The system can be tested using various email providers:
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- Amazon SES
- Zoho Mail
- Custom SMTP servers

## 📚 References

- [Google Message Header Analyzer](https://toolbox.googleapps.com/apps/messageheader/)
- [InboxDoctor Free Tests](https://inboxdoctor.ai/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎯 Technical Highlights

### Architecture & Design
- **Clean Architecture**: Separation of concerns with controllers, services, and models
- **RESTful API**: Well-structured endpoints following REST principles
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Rate limiting, CORS, input validation, and security headers

### Email Processing Engine
- **Header Parsing**: Advanced email header analysis and extraction
- **Chain Reconstruction**: Intelligent receiving chain timeline building
- **ESP Detection**: Pattern matching with confidence scoring
- **Real-time Processing**: Asynchronous email processing with status updates

### Data & Performance
- **MongoDB Integration**: Efficient data modeling with proper indexing
- **Connection Pooling**: Optimized database connections
- **Caching**: Strategic caching for improved performance
- **Scalability**: Designed for horizontal scaling

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation and configuration
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[API Documentation](http://localhost:5000/health)** - Interactive API endpoints

## 🧪 Testing & Quality

- **Code Quality**: ESLint configuration with best practices
- **Error Handling**: Graceful error handling throughout the application
- **Responsive Testing**: Tested across multiple screen sizes and devices
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge support

## 🏆 Assessment Criteria Met

✅ **Functionality**: Complete email analysis with receiving chain and ESP detection
✅ **Code Quality**: Clean, modular, well-documented codebase
✅ **UI/UX**: Responsive, intuitive interface with creative visualizations
✅ **Deployment**: Ready for production with comprehensive guides
✅ **Documentation**: Detailed setup, usage, and deployment instructions

## 🤝 Contributing

This project demonstrates professional development practices:
- Modular architecture
- Comprehensive documentation
- Production-ready configuration
- Security best practices
- Performance optimization

## 📄 License

This project is licensed under the MIT License - built for LucidGrowth technical demonstration.
