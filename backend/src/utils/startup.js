/**
 * Startup Utilities
 * 
 * Handles application initialization tasks
 */

const emailReceiver = require('../services/emailReceiver');
const ESPProvider = require('../models/ESPProvider');
const { createSampleEmails } = require('./sampleData');

/**
 * Initialize email monitoring
 */
async function initializeEmailMonitoring() {
  try {
    console.log('🚀 Initializing email monitoring...');
    
    // Start email monitoring if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await emailReceiver.startMonitoring();
      console.log('✅ Email monitoring started successfully');
    } else {
      console.log('⚠️  Email credentials not configured. Email monitoring disabled.');
      console.log('   Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    }
  } catch (error) {
    console.error('❌ Failed to initialize email monitoring:', error.message);
    console.log('   Email monitoring will be disabled');
  }
}

/**
 * Initialize ESP providers database
 */
async function initializeESPProviders() {
  try {
    console.log('🔍 Initializing ESP providers...');
    
    const existingCount = await ESPProvider.countDocuments();
    if (existingCount > 0) {
      console.log(`📊 Found ${existingCount} existing ESP providers`);
      return;
    }

    // Create default ESP providers
    const defaultProviders = [
      {
        name: 'gmail',
        displayName: 'Gmail',
        category: 'webmail',
        domains: ['gmail.com'],
        detectionPatterns: [
          { type: 'header', pattern: 'mail\\.gmail\\.com', weight: 90 },
          { type: 'domain', pattern: 'gmail\\.com$', weight: 85 }
        ],
        website: 'https://gmail.com',
        description: 'Google Gmail service'
      },
      {
        name: 'outlook',
        displayName: 'Outlook/Hotmail',
        category: 'webmail',
        domains: ['outlook.com', 'hotmail.com', 'live.com'],
        detectionPatterns: [
          { type: 'header', pattern: '(outlook|hotmail|live)\\.com', weight: 90 },
          { type: 'domain', pattern: '(outlook|hotmail|live)\\.com$', weight: 85 }
        ],
        website: 'https://outlook.com',
        description: 'Microsoft Outlook/Hotmail service'
      },
      {
        name: 'yahoo',
        displayName: 'Yahoo Mail',
        category: 'webmail',
        domains: ['yahoo.com'],
        detectionPatterns: [
          { type: 'header', pattern: 'yahoo\\.com', weight: 90 },
          { type: 'domain', pattern: 'yahoo\\.com$', weight: 85 }
        ],
        website: 'https://mail.yahoo.com',
        description: 'Yahoo Mail service'
      },
      {
        name: 'amazonses',
        displayName: 'Amazon SES',
        category: 'transactional',
        domains: ['amazonses.com'],
        detectionPatterns: [
          { type: 'header', pattern: 'amazonses\\.com', weight: 95 },
          { type: 'domain', pattern: 'amazonses\\.com$', weight: 85 }
        ],
        website: 'https://aws.amazon.com/ses/',
        description: 'Amazon Simple Email Service'
      },
      {
        name: 'sendgrid',
        displayName: 'SendGrid',
        category: 'transactional',
        domains: ['sendgrid.net'],
        detectionPatterns: [
          { type: 'header', pattern: 'sendgrid\\.net', weight: 95 },
          { type: 'domain', pattern: 'sendgrid\\.net$', weight: 85 }
        ],
        website: 'https://sendgrid.com',
        description: 'SendGrid email delivery service'
      }
    ];

    for (const providerData of defaultProviders) {
      const provider = new ESPProvider(providerData);
      await provider.save();
    }

    console.log(`✅ Created ${defaultProviders.length} default ESP providers`);
  } catch (error) {
    console.error('❌ Failed to initialize ESP providers:', error.message);
  }
}

/**
 * Run all startup tasks
 */
async function runStartupTasks() {
  console.log('🚀 Running startup tasks...');

  try {
    await initializeESPProviders();
    await createSampleEmails();
    await initializeEmailMonitoring();

    console.log('✅ All startup tasks completed successfully');
  } catch (error) {
    console.error('❌ Startup tasks failed:', error.message);
  }
}

/**
 * Graceful shutdown
 */
function setupGracefulShutdown() {
  const shutdown = (signal) => {
    console.log(`\n📧 Received ${signal}. Shutting down gracefully...`);
    
    // Stop email monitoring
    emailReceiver.stopMonitoring();
    emailReceiver.disconnect();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = {
  runStartupTasks,
  setupGracefulShutdown,
  initializeEmailMonitoring,
  initializeESPProviders
};
