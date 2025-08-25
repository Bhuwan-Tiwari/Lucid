/**
 * Sample Email Data for Demonstration
 * 
 * Creates sample emails to demonstrate the system functionality
 */

const Email = require('../models/Email');

const sampleEmails = [
  {
    messageId: '<sample-gmail-001@gmail.com>',
    subject: 'EMAIL_ANALYSIS_TEST - Sample Gmail Email',
    from: 'sender@gmail.com',
    to: 'bhuwant1200@gmail.com',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    rawHeaders: `Received: from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])
        by mx.google.com with ESMTPS id abc123
        (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);
        ${new Date(Date.now() - 2 * 60 * 60 * 1000).toUTCString()}
Received: by mail-sor-f41.google.com with SMTP id xyz789
        for <bhuwant1200@gmail.com>; ${new Date(Date.now() - 2 * 60 * 60 * 1000).toUTCString()}
Message-ID: <sample-gmail-001@gmail.com>
From: sender@gmail.com
To: bhuwant1200@gmail.com
Subject: EMAIL_ANALYSIS_TEST - Sample Gmail Email
X-Google-SMTP-Source: ABC123DEF456`,
    rawBody: 'This is a sample email for testing the Email Analysis System.',
    receivingChain: [
      {
        order: 1,
        server: 'mail-sor-f41.google.com',
        ip: '209.85.220.41',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        protocol: 'ESMTPS',
        encryption: 'TLS1_2',
        authResult: 'authenticated'
      },
      {
        order: 2,
        server: 'mx.google.com',
        ip: '172.217.164.26',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000),
        protocol: 'ESMTPS',
        encryption: 'TLS1_2',
        authResult: 'authenticated'
      }
    ],
    espInfo: {
      provider: 'Gmail',
      confidence: 95,
      detectionMethod: 'header_analysis',
      indicators: ['header:received', 'header:x-google-smtp-source', 'domain:gmail.com']
    },
    processingStatus: 'completed',
    processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
    isTestEmail: true,
    size: 1024
  },
  {
    messageId: '<sample-outlook-002@outlook.com>',
    subject: 'EMAIL_ANALYSIS_TEST - Sample Outlook Email',
    from: 'user@outlook.com',
    to: 'bhuwant1200@gmail.com',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    rawHeaders: `Received: from outlook.com (outlook-com.olc.protection.outlook.com [40.92.18.196])
        by mx.google.com with ESMTPS id def456
        (version=TLS1_2 cipher=ECDHE-RSA-AES256-SHA384 bits=256/256);
        ${new Date(Date.now() - 1 * 60 * 60 * 1000).toUTCString()}
Received: from BN6PR11MB1847.namprd11.prod.outlook.com (10.172.126.23) by
        BN6PR11MB1848.namprd11.prod.outlook.com (10.172.126.24) with Microsoft SMTP Server
        ${new Date(Date.now() - 1 * 60 * 60 * 1000).toUTCString()}
Message-ID: <sample-outlook-002@outlook.com>
From: user@outlook.com
To: bhuwant1200@gmail.com
Subject: EMAIL_ANALYSIS_TEST - Sample Outlook Email
X-MS-Exchange-Organization-AuthAs: Internal`,
    rawBody: 'This is a sample Outlook email for testing ESP detection.',
    receivingChain: [
      {
        order: 1,
        server: 'BN6PR11MB1847.namprd11.prod.outlook.com',
        ip: '10.172.126.23',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        protocol: 'SMTP',
        encryption: 'TLS1_2',
        authResult: 'authenticated'
      },
      {
        order: 2,
        server: 'outlook-com.olc.protection.outlook.com',
        ip: '40.92.18.196',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2000),
        protocol: 'ESMTPS',
        encryption: 'TLS1_2',
        authResult: 'authenticated'
      }
    ],
    espInfo: {
      provider: 'Outlook/Hotmail',
      confidence: 90,
      detectionMethod: 'header_analysis',
      indicators: ['header:received', 'header:x-ms-exchange-organization', 'domain:outlook.com']
    },
    processingStatus: 'completed',
    processedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 3000),
    isTestEmail: true,
    size: 2048
  },
  {
    messageId: '<sample-sendgrid-003@sendgrid.net>',
    subject: 'EMAIL_ANALYSIS_TEST - Sample SendGrid Email',
    from: 'noreply@company.com',
    to: 'bhuwant1200@gmail.com',
    date: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    rawHeaders: `Received: from o1.email.company.com (o1.email.company.com [167.89.101.42])
        by mx.google.com with ESMTPS id ghi789
        (version=TLS1_3 cipher=TLS_AES_256_GCM_SHA384 bits=256/256);
        ${new Date(Date.now() - 30 * 60 * 1000).toUTCString()}
Received: by filter0123.sendgrid.net with SMTP id filter0123.12345.ABC123DEF456
        ${new Date(Date.now() - 30 * 60 * 1000).toUTCString()}
Message-ID: <sample-sendgrid-003@sendgrid.net>
From: noreply@company.com
To: bhuwant1200@gmail.com
Subject: EMAIL_ANALYSIS_TEST - Sample SendGrid Email
X-SG-EID: ABC123DEF456GHI789
X-SG-ID: 12345`,
    rawBody: 'This is a sample transactional email sent via SendGrid.',
    receivingChain: [
      {
        order: 1,
        server: 'filter0123.sendgrid.net',
        ip: '167.89.101.42',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        protocol: 'SMTP',
        encryption: 'TLS1_3',
        authResult: 'authenticated'
      },
      {
        order: 2,
        server: 'o1.email.company.com',
        ip: '167.89.101.42',
        timestamp: new Date(Date.now() - 30 * 60 * 1000 + 1500),
        protocol: 'ESMTPS',
        encryption: 'TLS1_3',
        authResult: 'authenticated'
      }
    ],
    espInfo: {
      provider: 'SendGrid',
      confidence: 100,
      detectionMethod: 'header_analysis',
      indicators: ['header:received', 'header:x-sg-eid', 'header:x-sg-id', 'domain:sendgrid.net']
    },
    processingStatus: 'completed',
    processedAt: new Date(Date.now() - 30 * 60 * 1000 + 2000),
    isTestEmail: true,
    size: 1536
  }
];

const createSampleEmails = async () => {
  try {
    console.log('📧 Creating sample email data...');
    
    for (const emailData of sampleEmails) {
      const existingEmail = await Email.findOne({ messageId: emailData.messageId });
      if (!existingEmail) {
        await Email.create(emailData);
        console.log(`✅ Created sample email: ${emailData.subject}`);
      } else {
        console.log(`📧 Sample email already exists: ${emailData.subject}`);
      }
    }
    
    console.log('✅ Sample email data ready');
  } catch (error) {
    console.error('❌ Error creating sample emails:', error);
  }
};

module.exports = { createSampleEmails };
