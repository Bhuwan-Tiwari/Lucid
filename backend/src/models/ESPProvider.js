/**
 * ESP Provider Model
 * 
 * Mongoose schema for storing ESP (Email Service Provider) definitions and patterns
 */

const mongoose = require('mongoose');

// Schema for ESP detection patterns
const detectionPatternSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'domain', 'ip_range', 'authentication'],
    required: true
  },
  pattern: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
  },
  description: {
    type: String,
    default: ''
  }
}, { _id: false });

// Main ESP Provider schema
const espProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  displayName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['webmail', 'enterprise', 'transactional', 'marketing', 'other'],
    default: 'other'
  },
  
  // Detection patterns
  detectionPatterns: [detectionPatternSchema],
  
  // Known domains and IPs
  domains: [{
    type: String
  }],
  ipRanges: [{
    type: String
  }],
  
  // Provider information
  website: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  
  // Configuration
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

// Indexes
espProviderSchema.index({ category: 1 });
espProviderSchema.index({ isActive: 1 });
espProviderSchema.index({ priority: -1 });

// Static method to get active providers
espProviderSchema.statics.getActiveProviders = function() {
  return this.find({ isActive: true }).sort({ priority: -1 });
};

// Static method to find provider by domain
espProviderSchema.statics.findByDomain = function(domain) {
  return this.find({ 
    domains: { $in: [domain] },
    isActive: true 
  });
};

// Instance method to add detection pattern
espProviderSchema.methods.addDetectionPattern = function(type, pattern, weight = 50, description = '') {
  this.detectionPatterns.push({
    type,
    pattern,
    weight,
    description
  });
  return this.save();
};

module.exports = mongoose.model('ESPProvider', espProviderSchema);
