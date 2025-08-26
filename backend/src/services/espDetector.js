class ESPDetector {
  constructor() {
    this.espPatterns = {
      gmail: {
        name: "Gmail",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /mail\.gmail\.com/i,
            weight: 90,
          },
          {
            type: "header",
            key: "message-id",
            pattern: /@gmail\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-google-smtp-source",
            pattern: /.+/i,
            weight: 100,
          },
          { type: "domain", pattern: /gmail\.com$/i, weight: 85 },
          {
            type: "ip",
            pattern: /^(74\.125\.|173\.194\.|209\.85\.|64\.233\.)/i,
            weight: 80,
          },
        ],
      },
      outlook: {
        name: "Outlook/Hotmail",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /outlook\.com|hotmail\.com|live\.com/i,
            weight: 90,
          },
          {
            type: "header",
            key: "message-id",
            pattern: /@(outlook|hotmail|live)\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-ms-exchange-organization",
            pattern: /.+/i,
            weight: 85,
          },
          {
            type: "domain",
            pattern: /(outlook|hotmail|live)\.com$/i,
            weight: 85,
          },
          {
            type: "header",
            key: "x-originating-ip",
            pattern: /.+/i,
            weight: 70,
          },
        ],
      },
      yahoo: {
        name: "Yahoo Mail",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /yahoo\.com/i,
            weight: 90,
          },
          {
            type: "header",
            key: "message-id",
            pattern: /@yahoo\.com/i,
            weight: 95,
          },
          { type: "header", key: "x-yahoo-smtp", pattern: /.+/i, weight: 100 },
          { type: "domain", pattern: /yahoo\.com$/i, weight: 85 },
          {
            type: "header",
            key: "x-rocket-received",
            pattern: /.+/i,
            weight: 80,
          },
        ],
      },
      amazonses: {
        name: "Amazon SES",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /amazonses\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-ses-outgoing",
            pattern: /.+/i,
            weight: 100,
          },
          {
            type: "header",
            key: "message-id",
            pattern: /@amazonses\.com/i,
            weight: 90,
          },
          { type: "domain", pattern: /amazonses\.com$/i, weight: 85 },
          { type: "ip", pattern: /^(54\.|52\.|18\.)/i, weight: 60 },
        ],
      },
      sendgrid: {
        name: "SendGrid",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /sendgrid\.net/i,
            weight: 95,
          },
          { type: "header", key: "x-sg-eid", pattern: /.+/i, weight: 100 },
          { type: "header", key: "x-sg-id", pattern: /.+/i, weight: 100 },
          { type: "domain", pattern: /sendgrid\.net$/i, weight: 85 },
        ],
      },
      mailgun: {
        name: "Mailgun",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /mailgun\.org/i,
            weight: 95,
          },
          { type: "header", key: "x-mailgun-sid", pattern: /.+/i, weight: 100 },
          {
            type: "header",
            key: "message-id",
            pattern: /@mailgun\.org/i,
            weight: 90,
          },
          { type: "domain", pattern: /mailgun\.org$/i, weight: 85 },
        ],
      },
      zoho: {
        name: "Zoho Mail",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /zoho\.com/i,
            weight: 90,
          },
          {
            type: "header",
            key: "message-id",
            pattern: /@zoho\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-zoho-virus-status",
            pattern: /.+/i,
            weight: 85,
          },
          { type: "domain", pattern: /zoho\.com$/i, weight: 85 },
        ],
      },
      mandrill: {
        name: "Mandrill",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /mandrillapp\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-mandrill-user",
            pattern: /.+/i,
            weight: 100,
          },
          { type: "domain", pattern: /mandrillapp\.com$/i, weight: 85 },
        ],
      },
      postmark: {
        name: "Postmark",
        patterns: [
          {
            type: "header",
            key: "received",
            pattern: /postmarkapp\.com/i,
            weight: 95,
          },
          {
            type: "header",
            key: "x-pm-message-id",
            pattern: /.+/i,
            weight: 100,
          },
          { type: "domain", pattern: /postmarkapp\.com$/i, weight: 85 },
        ],
      },
    };
  }

  //Detect ESP from email headers and metadata

  detectESP(headers, metadata, fromAddress) {
    try {
      const results = [];

      for (const [espKey, espConfig] of Object.entries(this.espPatterns)) {
        const score = this.calculateESPScore(
          espConfig,
          headers,
          metadata,
          fromAddress
        );
        if (score.totalScore > 0) {
          results.push({
            provider: espConfig.name,
            confidence: Math.min(score.totalScore, 100),
            detectionMethod: score.primaryMethod,
            indicators: score.indicators,
            details: score.details,
          });
        }
      }

      results.sort((a, b) => b.confidence - a.confidence);

      if (results.length > 0 && results[0].confidence >= 50) {
        return results[0];
      } else {
        return this.detectUnknownESP(headers, metadata, fromAddress);
      }
    } catch (error) {
      console.error("Error detecting ESP:", error);
      return {
        provider: "Unknown",
        confidence: 0,
        detectionMethod: "error",
        indicators: [],
        error: error.message,
      };
    }
  }

  calculateESPScore(espConfig, headers, metadata, fromAddress) {
    let totalScore = 0;
    let primaryMethod = "header_analysis";
    const indicators = [];
    const details = [];

    for (const pattern of espConfig.patterns) {
      let match = false;
      let matchValue = "";

      switch (pattern.type) {
        case "header":
          const headerValues = headers[pattern.key] || [];
          for (const value of headerValues) {
            if (pattern.pattern.test(value)) {
              match = true;
              matchValue = value;
              break;
            }
          }
          break;

        case "domain":
          if (fromAddress && pattern.pattern.test(fromAddress)) {
            match = true;
            matchValue = fromAddress;
            primaryMethod = "domain_lookup";
          }
          break;

        case "ip":
          // Check originating IP or IPs in received headers
          const originatingIp = metadata.originatingIp;
          if (originatingIp && pattern.pattern.test(originatingIp)) {
            match = true;
            matchValue = originatingIp;
            primaryMethod = "ip_analysis";
          }
          break;
      }

      if (match) {
        totalScore += pattern.weight;
        indicators.push(`${pattern.type}:${pattern.key || "match"}`);
        details.push({
          type: pattern.type,
          key: pattern.key,
          value: matchValue,
          weight: pattern.weight,
        });
      }
    }

    return {
      totalScore,
      primaryMethod,
      indicators,
      details,
    };
  }

  detectUnknownESP(headers, metadata, fromAddress) {
    const indicators = [];
    let detectionMethod = "header_analysis";

    if (fromAddress) {
      const domainMatch = fromAddress.match(/@([^>]+)/);
      if (domainMatch) {
        const domain = domainMatch[1].toLowerCase();
        indicators.push(`domain:${domain}`);
        detectionMethod = "domain_lookup";
      }
    }

    const customHeaders = Object.keys(headers).filter(
      (key) => key.startsWith("x-") && !key.startsWith("x-received")
    );

    for (const header of customHeaders) {
      indicators.push(`custom_header:${header}`);
    }

    const receivedHeaders = headers["received"] || [];
    for (const received of receivedHeaders) {
      if (received.includes("mta") || received.includes("relay")) {
        indicators.push("mta_detected");
      }
    }

    return {
      provider: "Unknown",
      confidence: Math.min(indicators.length * 10, 40),
      detectionMethod,
      indicators,
      details: {
        customHeaders,
        analysis: "Could not match known ESP patterns",
      },
    };
  }

  getSupportedESPs() {
    return Object.values(this.espPatterns).map((esp) => esp.name);
  }

  addCustomESP(key, config) {
    this.espPatterns[key] = config;
  }

  validateDetection(result) {
    const validation = {
      isValid: true,
      warnings: [],
      confidence: result.confidence,
    };

    if (result.confidence < 30) {
      validation.warnings.push("Low confidence detection");
    }

    if (result.indicators.length === 0) {
      validation.warnings.push("No indicators found");
    }

    if (result.provider === "Unknown") {
      validation.warnings.push("ESP could not be identified");
    }

    return validation;
  }
}

module.exports = new ESPDetector();
