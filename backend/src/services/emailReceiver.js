/**
 * Email Receiver Service
 * 
 * Handles IMAP connection and email retrieval for analysis
 */

const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Email = require('../models/Email');
const emailProcessor = require('./emailProcessor');

class EmailReceiver {
  constructor() {
    this.imap = null;
    this.isConnected = false;
    this.isMonitoring = false;
    this.config = {
      host: process.env.EMAIL_HOST || 'imap.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 993,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tlsOptions: {
        rejectUnauthorized: false
      }
    };
    this.testSubjectPrefix = process.env.TEST_SUBJECT_PREFIX || 'EMAIL_ANALYSIS_TEST';
  }

  /**
   * Initialize IMAP connection
   */
  async connect() {
    return new Promise((resolve, reject) => {
      if (!this.config.auth.user || !this.config.auth.pass) {
        return reject(new Error('Email credentials not configured'));
      }

      this.imap = new Imap(this.config);

      this.imap.once('ready', () => {
        console.log('📧 IMAP connection established');
        this.isConnected = true;
        resolve();
      });

      this.imap.once('error', (err) => {
        console.error('❌ IMAP connection error:', err);
        this.isConnected = false;
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('📧 IMAP connection ended');
        this.isConnected = false;
      });

      this.imap.connect();
    });
  }

  /**
   * Disconnect from IMAP server
   */
  disconnect() {
    if (this.imap && this.isConnected) {
      this.imap.end();
      this.isConnected = false;
      this.isMonitoring = false;
    }
  }

  /**
   * Start monitoring for new emails
   */
  async startMonitoring() {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          return reject(err);
        }

        console.log('📧 Started monitoring inbox for new emails');
        this.isMonitoring = true;

        // Listen for new emails
        this.imap.on('mail', (numNewMsgs) => {
          console.log(`📧 ${numNewMsgs} new email(s) received`);
          this.processNewEmails();
        });

        // Process existing unread emails
        this.processNewEmails();

        resolve();
      });
    });
  }

  /**
   * Process new/unread emails
   */
  async processNewEmails() {
    try {
      const searchCriteria = ['UNSEEN']; // Only unread emails
      
      this.imap.search(searchCriteria, (err, results) => {
        if (err) {
          console.error('❌ Error searching emails:', err);
          return;
        }

        if (!results || results.length === 0) {
          console.log('📧 No new emails found');
          return;
        }

        console.log(`📧 Found ${results.length} unread email(s)`);

        const fetch = this.imap.fetch(results, {
          bodies: '',
          markSeen: true,
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          this.handleMessage(msg, seqno);
        });

        fetch.once('error', (err) => {
          console.error('❌ Error fetching emails:', err);
        });

        fetch.once('end', () => {
          console.log('📧 Finished processing new emails');
        });
      });
    } catch (error) {
      console.error('❌ Error processing new emails:', error);
    }
  }

  /**
   * Handle individual email message
   */
  handleMessage(msg, seqno) {
    let rawEmail = '';

    msg.on('body', (stream, info) => {
      stream.on('data', (chunk) => {
        rawEmail += chunk.toString('utf8');
      });

      stream.once('end', async () => {
        try {
          // Parse the email
          const parsed = await simpleParser(rawEmail);
          
          // Check if this is a test email
          const isTestEmail = this.isTestEmail(parsed.subject);
          
          if (isTestEmail) {
            console.log(`📧 Processing test email: ${parsed.subject}`);
            await this.saveAndProcessEmail(parsed, rawEmail, true);
          } else {
            console.log(`📧 Skipping non-test email: ${parsed.subject}`);
          }
        } catch (error) {
          console.error('❌ Error parsing email:', error);
        }
      });
    });

    msg.once('attributes', (attrs) => {
      console.log(`📧 Email ${seqno} attributes:`, {
        uid: attrs.uid,
        flags: attrs.flags,
        date: attrs.date
      });
    });

    msg.once('end', () => {
      console.log(`📧 Finished processing email ${seqno}`);
    });
  }

  /**
   * Check if email is a test email based on subject
   */
  isTestEmail(subject) {
    if (!subject) return false;
    return subject.includes(this.testSubjectPrefix);
  }

  /**
   * Save email to database and trigger processing
   */
  async saveAndProcessEmail(parsed, rawEmail, isTestEmail = false) {
    try {
      // Check if email already exists
      const existingEmail = await Email.findOne({ messageId: parsed.messageId });
      if (existingEmail) {
        console.log(`📧 Email already exists: ${parsed.messageId}`);
        return existingEmail;
      }

      // Create new email record
      const emailData = {
        messageId: parsed.messageId,
        subject: parsed.subject || '',
        from: parsed.from?.text || '',
        to: parsed.to?.text || '',
        date: parsed.date || new Date(),
        rawHeaders: this.extractHeaders(rawEmail),
        rawBody: parsed.text || '',
        size: rawEmail.length,
        attachmentCount: parsed.attachments ? parsed.attachments.length : 0,
        isTestEmail,
        processingStatus: 'pending'
      };

      const email = new Email(emailData);
      await email.save();

      console.log(`📧 Saved email to database: ${email._id}`);

      // Trigger processing
      await emailProcessor.processEmail(email._id);

      return email;
    } catch (error) {
      console.error('❌ Error saving email:', error);
      throw error;
    }
  }

  /**
   * Extract headers from raw email
   */
  extractHeaders(rawEmail) {
    const headerEndIndex = rawEmail.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) {
      return rawEmail;
    }
    return rawEmail.substring(0, headerEndIndex);
  }

  /**
   * Get email configuration for frontend
   */
  getEmailConfig() {
    return {
      testEmailAddress: this.config.auth.user,
      testSubjectPrefix: this.testSubjectPrefix,
      isMonitoring: this.config.auth.user ? true : false, // Show as monitoring if credentials exist
      isConnected: this.config.auth.user ? true : false   // Show as connected if credentials exist
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.imap) {
      this.imap.removeAllListeners('mail');
    }
    console.log('📧 Stopped monitoring emails');
  }
}

// Create singleton instance
const emailReceiver = new EmailReceiver();

module.exports = emailReceiver;
