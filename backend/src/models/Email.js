/**
 * Email Model
 * 
 * Mongoose schema for storing email data, headers, and analysis results
 */

const mongoose = require('mongoose');

// Schema for individual receiving chain hops
const receivingChainSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  server: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: null
  },
  protocol: {
    type: String,
    default: null
  },
  encryption: {
    type: String,
    default: null
  },
  authResult: {
    type: String,
    default: null
  }
}, { _id: false });

// Schema for ESP (Email Service Provider) information
const espInfoSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  detectionMethod: {
    type: String,
    enum: ['header_analysis', 'domain_lookup', 'ip_analysis', 'authentication_records'],
    required: true
  },
  indicators: [{
    type: String
  }]
}, { _id: false });

// Main email schema
const emailSchema = new mongoose.Schema({
  // Basic email information
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  subject: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  
  // Raw email data
  rawHeaders: {
    type: String,
    required: true
  },
  rawBody: {
    type: String,
    default: ''
  },
  
  // Processed data
  receivingChain: [receivingChainSchema],
  espInfo: espInfoSchema,
  
  // Analysis metadata
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingErrors: [{
    error: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Additional metadata
  size: {
    type: Number,
    default: 0
  },
  attachmentCount: {
    type: Number,
    default: 0
  },
  isTestEmail: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  receivedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
emailSchema.index({ subject: 1 });
emailSchema.index({ from: 1 });
emailSchema.index({ receivedAt: -1 });
emailSchema.index({ processingStatus: 1 });
emailSchema.index({ isTestEmail: 1 });

// Virtual for processing duration
emailSchema.virtual('processingDuration').get(function() {
  if (this.processedAt && this.receivedAt) {
    return this.processedAt - this.receivedAt;
  }
  return null;
});

// Instance method to mark as processed
emailSchema.methods.markAsProcessed = function() {
  this.processingStatus = 'completed';
  this.processedAt = new Date();
  return this.save();
};

// Instance method to mark as failed
emailSchema.methods.markAsFailed = function(error) {
  this.processingStatus = 'failed';
  this.processingErrors.push({
    error: error.message || error,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to find test emails
emailSchema.statics.findTestEmails = function() {
  return this.find({ isTestEmail: true }).sort({ receivedAt: -1 });
};

// Static method to get processing statistics
emailSchema.statics.getProcessingStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$processingStatus',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Email', emailSchema);
