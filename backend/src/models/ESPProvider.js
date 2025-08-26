const mongoose = require("mongoose");

const detectionPatternSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["header", "domain", "ip_range", "authentication"],
      required: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      min: 1,
      max: 100,
      default: 50,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const espProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["webmail", "enterprise", "transactional", "marketing", "other"],
      default: "other",
    },

    detectionPatterns: [detectionPatternSchema],

    domains: [
      {
        type: String,
      },
    ],
    ipRanges: [
      {
        type: String,
      },
    ],

    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

espProviderSchema.index({ category: 1 });
espProviderSchema.index({ isActive: 1 });
espProviderSchema.index({ priority: -1 });

espProviderSchema.statics.getActiveProviders = function () {
  return this.find({ isActive: true }).sort({ priority: -1 });
};

espProviderSchema.statics.findByDomain = function (domain) {
  return this.find({
    domains: { $in: [domain] },
    isActive: true,
  });
};

espProviderSchema.methods.addDetectionPattern = function (
  type,
  pattern,
  weight = 50,
  description = ""
) {
  this.detectionPatterns.push({
    type,
    pattern,
    weight,
    description,
  });
  return this.save();
};

module.exports = mongoose.model("ESPProvider", espProviderSchema);
