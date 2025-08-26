const Email = require("../models/Email");
const emailReceiver = require("../services/emailReceiver");
const emailProcessor = require("../services/emailProcessor");

const getEmailConfig = async (req, res) => {
  try {
    const config = emailReceiver.getEmailConfig();

    res.json({
      success: true,
      data: {
        testEmailAddress: config.testEmailAddress,
        testSubjectPrefix: config.testSubjectPrefix,
        instructions: `Send an email to ${config.testEmailAddress} with subject containing "${config.testSubjectPrefix}"`,
        isMonitoring: config.isMonitoring,
        isConnected: config.isConnected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllEmails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.testOnly === "true") {
      filter.isTestEmail = true;
    }

    if (req.query.status) {
      filter.processingStatus = req.query.status;
    }

    const emails = await Email.find(filter)
      .sort({ receivedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-rawHeaders -rawBody"); // Exclude large fields

    const total = await Email.countDocuments(filter);

    res.json({
      success: true,
      data: {
        emails,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        error: "Email not found",
      });
    }

    res.json({
      success: true,
      data: email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getReceivingChain = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id).select(
      "receivingChain subject from"
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        error: "Email not found",
      });
    }

    res.json({
      success: true,
      data: {
        emailId: email._id,
        subject: email.subject,
        from: email.from,
        receivingChain: email.receivingChain,
        totalHops: email.receivingChain.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getESPInfo = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id).select(
      "espInfo subject from"
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        error: "Email not found",
      });
    }

    res.json({
      success: true,
      data: {
        emailId: email._id,
        subject: email.subject,
        from: email.from,
        espInfo: email.espInfo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const processEmails = async (req, res) => {
  try {
    const results = await emailProcessor.processPendingEmails();

    res.json({
      success: true,
      data: {
        message: "Email processing triggered",
        results,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        error: "Email not found",
      });
    }

    await Email.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {
        message: "Email deleted successfully",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getEmailStats = async (req, res) => {
  try {
    const stats = await emailProcessor.getProcessingStats();

    // Get recent activity
    const recentEmails = await Email.find()
      .sort({ receivedAt: -1 })
      .limit(5)
      .select("subject from receivedAt processingStatus espInfo.provider");

    res.json({
      success: true,
      data: {
        stats,
        recentActivity: recentEmails,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getEmailConfig,
  getAllEmails,
  getEmailById,
  getReceivingChain,
  getESPInfo,
  processEmails,
  deleteEmail,
  getEmailStats,
};
