/**
 * Email Header Parser Service
 * 
 * Parses email headers to extract receiving chain and other metadata
 */

class HeaderParser {
  /**
   * Parse email headers and extract receiving chain
   */
  parseHeaders(rawHeaders) {
    try {
      const headers = this.parseRawHeaders(rawHeaders);
      const receivingChain = this.extractReceivingChain(headers);
      const metadata = this.extractMetadata(headers);

      return {
        headers,
        receivingChain,
        metadata,
        success: true
      };
    } catch (error) {
      console.error('❌ Error parsing headers:', error);
      return {
        headers: {},
        receivingChain: [],
        metadata: {},
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Parse raw headers into key-value pairs
   */
  parseRawHeaders(rawHeaders) {
    const headers = {};
    const lines = rawHeaders.split('\r\n');
    let currentHeader = '';
    let currentValue = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if line starts with whitespace (continuation of previous header)
      if (line.match(/^\s+/) && currentHeader) {
        currentValue += ' ' + line.trim();
      } else {
        // Save previous header if exists
        if (currentHeader) {
          if (!headers[currentHeader.toLowerCase()]) {
            headers[currentHeader.toLowerCase()] = [];
          }
          headers[currentHeader.toLowerCase()].push(currentValue.trim());
        }

        // Parse new header
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentHeader = line.substring(0, colonIndex).trim();
          currentValue = line.substring(colonIndex + 1).trim();
        } else {
          currentHeader = '';
          currentValue = '';
        }
      }
    }

    // Save last header
    if (currentHeader) {
      if (!headers[currentHeader.toLowerCase()]) {
        headers[currentHeader.toLowerCase()] = [];
      }
      headers[currentHeader.toLowerCase()].push(currentValue.trim());
    }

    return headers;
  }

  /**
   * Extract receiving chain from Received headers
   */
  extractReceivingChain(headers) {
    const receivedHeaders = headers['received'] || [];
    const chain = [];

    // Process Received headers in reverse order (oldest first)
    for (let i = receivedHeaders.length - 1; i >= 0; i--) {
      const received = receivedHeaders[i];
      const hop = this.parseReceivedHeader(received, receivedHeaders.length - i);
      if (hop) {
        chain.push(hop);
      }
    }

    return chain;
  }

  /**
   * Parse individual Received header
   */
  parseReceivedHeader(receivedHeader, order) {
    try {
      const hop = {
        order,
        server: null,
        ip: null,
        timestamp: null,
        protocol: null,
        encryption: null,
        authResult: null
      };

      // Extract server information
      const fromMatch = receivedHeader.match(/from\s+([^\s\[\(]+)/i);
      if (fromMatch) {
        hop.server = fromMatch[1];
      }

      // Extract IP address
      const ipMatch = receivedHeader.match(/\[([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\]/);
      if (ipMatch) {
        hop.ip = ipMatch[1];
      }

      // Extract timestamp
      const timestampMatch = receivedHeader.match(/;\s*(.+)$/);
      if (timestampMatch) {
        try {
          hop.timestamp = new Date(timestampMatch[1].trim());
        } catch (e) {
          // Invalid date format
        }
      }

      // Extract protocol
      const protocolMatch = receivedHeader.match(/with\s+([A-Z]+)/i);
      if (protocolMatch) {
        hop.protocol = protocolMatch[1].toUpperCase();
      }

      // Extract encryption information
      if (receivedHeader.includes('TLS') || receivedHeader.includes('SSL')) {
        hop.encryption = 'TLS/SSL';
      } else if (receivedHeader.includes('STARTTLS')) {
        hop.encryption = 'STARTTLS';
      }

      // Extract authentication result
      if (receivedHeader.includes('authenticated')) {
        hop.authResult = 'authenticated';
      } else if (receivedHeader.includes('unauthenticated')) {
        hop.authResult = 'unauthenticated';
      }

      return hop;
    } catch (error) {
      console.error('❌ Error parsing received header:', error);
      return null;
    }
  }

  /**
   * Extract additional metadata from headers
   */
  extractMetadata(headers) {
    const metadata = {};

    // SPF information
    if (headers['received-spf']) {
      metadata.spf = headers['received-spf'][0];
    }

    // DKIM information
    if (headers['dkim-signature']) {
      metadata.dkim = headers['dkim-signature'];
    }

    // DMARC information
    if (headers['authentication-results']) {
      metadata.authenticationResults = headers['authentication-results'];
    }

    // Return-Path
    if (headers['return-path']) {
      metadata.returnPath = headers['return-path'][0];
    }

    // Message-ID
    if (headers['message-id']) {
      metadata.messageId = headers['message-id'][0];
    }

    // X-Originating-IP
    if (headers['x-originating-ip']) {
      metadata.originatingIp = headers['x-originating-ip'][0];
    }

    // X-Mailer
    if (headers['x-mailer']) {
      metadata.mailer = headers['x-mailer'][0];
    }

    // User-Agent
    if (headers['user-agent']) {
      metadata.userAgent = headers['user-agent'][0];
    }

    // X-Priority
    if (headers['x-priority']) {
      metadata.priority = headers['x-priority'][0];
    }

    // Content-Type
    if (headers['content-type']) {
      metadata.contentType = headers['content-type'][0];
    }

    return metadata;
  }

  /**
   * Get all header names for debugging
   */
  getHeaderNames(rawHeaders) {
    const headers = this.parseRawHeaders(rawHeaders);
    return Object.keys(headers).sort();
  }

  /**
   * Get specific header value
   */
  getHeader(rawHeaders, headerName) {
    const headers = this.parseRawHeaders(rawHeaders);
    return headers[headerName.toLowerCase()] || null;
  }

  /**
   * Validate receiving chain for completeness
   */
  validateReceivingChain(chain) {
    const validation = {
      isValid: true,
      warnings: [],
      errors: []
    };

    if (chain.length === 0) {
      validation.isValid = false;
      validation.errors.push('No receiving chain found');
      return validation;
    }

    // Check for missing timestamps
    const missingTimestamps = chain.filter(hop => !hop.timestamp);
    if (missingTimestamps.length > 0) {
      validation.warnings.push(`${missingTimestamps.length} hop(s) missing timestamps`);
    }

    // Check for missing server information
    const missingServers = chain.filter(hop => !hop.server);
    if (missingServers.length > 0) {
      validation.warnings.push(`${missingServers.length} hop(s) missing server information`);
    }

    // Check chronological order
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].timestamp && chain[i-1].timestamp) {
        if (chain[i].timestamp < chain[i-1].timestamp) {
          validation.warnings.push('Timestamps not in chronological order');
          break;
        }
      }
    }

    return validation;
  }
}

module.exports = new HeaderParser();
