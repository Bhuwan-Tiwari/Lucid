/**
 * Email Routes
 * 
 * Handles all email-related API endpoints
 */

const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

/**
 * @route   GET /api/emails/config
 * @desc    Get email configuration (test email address and subject)
 * @access  Public
 */
router.get('/config', emailController.getEmailConfig);

/**
 * @route   GET /api/emails
 * @desc    Get all processed emails
 * @access  Public
 */
router.get('/', emailController.getAllEmails);

/**
 * @route   GET /api/emails/:id
 * @desc    Get specific email by ID
 * @access  Public
 */
router.get('/:id', emailController.getEmailById);

/**
 * @route   GET /api/emails/:id/receiving-chain
 * @desc    Get receiving chain for specific email
 * @access  Public
 */
router.get('/:id/receiving-chain', emailController.getReceivingChain);

/**
 * @route   GET /api/emails/:id/esp
 * @desc    Get ESP information for specific email
 * @access  Public
 */
router.get('/:id/esp', emailController.getESPInfo);

/**
 * @route   POST /api/emails/process
 * @desc    Manually trigger email processing (for testing)
 * @access  Public
 */
router.post('/process', emailController.processEmails);

/**
 * @route   DELETE /api/emails/:id
 * @desc    Delete specific email
 * @access  Public
 */
router.delete('/:id', emailController.deleteEmail);

/**
 * @route   GET /api/emails/stats/summary
 * @desc    Get email processing statistics
 * @access  Public
 */
router.get('/stats/summary', emailController.getEmailStats);

module.exports = router;
