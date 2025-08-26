const Email = require("../models/Email");
const headerParser = require("./headerParser");
const espDetector = require("./espDetector");

class EmailProcessor {
  async processEmail(emailId) {
    try {
      console.log(`Processing email: ${emailId}`);

      const email = await Email.findById(emailId);
      if (!email) {
        throw new Error(`Email not found: ${emailId}`);
      }

      if (email.processingStatus === "completed") {
        console.log(`Email already processed: ${emailId}`);
        return email;
      }

      email.processingStatus = "processing";
      await email.save();

      console.log(`Parsing headers for email: ${emailId}`);
      const headerResult = headerParser.parseHeaders(email.rawHeaders);

      if (!headerResult.success) {
        throw new Error(`Header parsing failed: ${headerResult.error}`);
      }

      email.receivingChain = headerResult.receivingChain;

      console.log(`Detecting ESP for email: ${emailId}`);
      const espResult = espDetector.detectESP(
        headerResult.headers,
        headerResult.metadata,
        email.from
      );

      email.espInfo = {
        provider: espResult.provider,
        confidence: espResult.confidence,
        detectionMethod: espResult.detectionMethod,
        indicators: espResult.indicators,
      };

      // Mark as completed
      await email.markAsProcessed();

      console.log(`Successfully processed email: ${emailId}`);
      console.log(
        `ESP detected: ${espResult.provider} (${espResult.confidence}% confidence)`
      );
      console.log(`Receiving chain: ${email.receivingChain.length} hops`);

      return email;
    } catch (error) {
      console.error(`Error processing email ${emailId}:`, error);

      try {
        const email = await Email.findById(emailId);
        if (email) {
          await email.markAsFailed(error);
        }
      } catch (saveError) {
        console.error("Error saving failed status:", saveError);
      }

      throw error;
    }
  }

  async processEmails(emailIds) {
    const results = [];

    for (const emailId of emailIds) {
      try {
        const result = await this.processEmail(emailId);
        results.push({ emailId, success: true, email: result });
      } catch (error) {
        results.push({ emailId, success: false, error: error.message });
      }
    }

    return results;
  }

  async processPendingEmails() {
    try {
      console.log(" Processing all pending emails...");

      const pendingEmails = await Email.find({
        processingStatus: { $in: ["pending", "failed"] },
      }).select("_id");

      if (pendingEmails.length === 0) {
        console.log(" No pending emails to process");
        return [];
      }

      console.log(`📧 Found ${pendingEmails.length} pending emails`);

      const emailIds = pendingEmails.map((email) => email._id);
      const results = await this.processEmails(emailIds);

      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      console.log(
        `Processing complete: ${successful} successful, ${failed} failed`
      );

      return results;
    } catch (error) {
      console.error("Error processing pending emails:", error);
      throw error;
    }
  }

  async reprocessEmail(emailId) {
    try {
      const email = await Email.findById(emailId);
      if (!email) {
        throw new Error(`Email not found: ${emailId}`);
      }

      email.processingStatus = "pending";
      email.processingErrors = [];
      email.processedAt = null;
      email.receivingChain = [];
      email.espInfo = undefined;
      await email.save();

      // Process again
      return await this.processEmail(emailId);
    } catch (error) {
      console.error(` Error reprocessing email ${emailId}:`, error);
      throw error;
    }
  }

  async getProcessingStats() {
    try {
      const stats = await Email.aggregate([
        {
          $group: {
            _id: "$processingStatus",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
      };

      for (const stat of stats) {
        result[stat._id] = stat.count;
        result.total += stat.count;
      }

      const testEmailCount = await Email.countDocuments({ isTestEmail: true });
      const avgProcessingTime = await this.getAverageProcessingTime();

      result.testEmails = testEmailCount;
      result.averageProcessingTime = avgProcessingTime;

      return result;
    } catch (error) {
      console.error("❌ Error getting processing stats:", error);
      throw error;
    }
  }

  async getAverageProcessingTime() {
    try {
      const result = await Email.aggregate([
        {
          $match: {
            processingStatus: "completed",
            processedAt: { $exists: true },
            receivedAt: { $exists: true },
          },
        },
        {
          $project: {
            processingTime: {
              $subtract: ["$processedAt", "$receivedAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: "$processingTime" },
          },
        },
      ]);

      return result.length > 0 ? Math.round(result[0].avgTime) : 0;
    } catch (error) {
      console.error("Error calculating average processing time:", error);
      return 0;
    }
  }

  validateProcessingResult(email) {
    const validation = {
      isValid: true,
      warnings: [],
      errors: [],
    };

    if (!email.receivingChain || email.receivingChain.length === 0) {
      validation.warnings.push("No receiving chain found");
    }

    if (!email.espInfo) {
      validation.errors.push("ESP detection failed");
      validation.isValid = false;
    } else if (email.espInfo.confidence < 50) {
      validation.warnings.push("Low ESP detection confidence");
    }

    if (email.processingStatus !== "completed") {
      validation.errors.push("Email processing not completed");
      validation.isValid = false;
    }

    return validation;
  }
}

module.exports = new EmailProcessor();
