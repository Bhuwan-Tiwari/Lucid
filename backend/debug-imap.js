/**
 * Comprehensive IMAP Debug Script
 * Tests multiple configurations and provides detailed diagnostics
 */

require('dotenv').config();
const Imap = require('imap');

console.log('🔍 IMAP Diagnostic Tool');
console.log('========================');
console.log('📧 Email:', process.env.EMAIL_USER);
console.log('🔑 Password length:', process.env.EMAIL_PASSWORD?.length || 'Not set');
console.log('🌐 Host:', process.env.EMAIL_HOST);
console.log('🔌 Port:', process.env.EMAIL_PORT);

// Test configurations
const testConfigs = [
  {
    name: 'Gmail Standard (TLS)',
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    timeout: 60000
  },
  {
    name: 'Gmail STARTTLS',
    host: 'imap.gmail.com', 
    port: 143,
    secure: false,
    timeout: 60000
  },
  {
    name: 'Gmail with longer timeout',
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    timeout: 120000
  }
];

async function testConnection(config) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Secure: ${config.secure}`);
    
    const imap = new Imap({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tlsOptions: {
        rejectUnauthorized: false,
        servername: config.host
      },
      connTimeout: config.timeout,
      authTimeout: config.timeout,
      keepalive: false
    });

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log('   ❌ Timeout after', config.timeout / 1000, 'seconds');
        imap.destroy();
        resolve({ success: false, error: 'Timeout' });
      }
    }, config.timeout + 5000);

    imap.once('ready', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.log('   ✅ Connection successful!');
        
        // Try to open inbox
        imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            console.log('   ⚠️ Connected but cannot open inbox:', err.message);
          } else {
            console.log('   ✅ Inbox opened successfully');
            console.log('   📊 Total messages:', box.messages.total);
          }
          imap.end();
          resolve({ success: true, config });
        });
      }
    });

    imap.once('error', (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.log('   ❌ Error:', err.message);
        
        // Provide specific error guidance
        if (err.message.includes('Invalid credentials')) {
          console.log('   💡 This suggests App Password is wrong');
        } else if (err.message.includes('Timed out')) {
          console.log('   💡 This suggests network/firewall issue');
        } else if (err.message.includes('ENOTFOUND')) {
          console.log('   💡 DNS resolution failed');
        } else if (err.message.includes('ECONNREFUSED')) {
          console.log('   💡 Connection refused - port might be blocked');
        }
        
        resolve({ success: false, error: err.message });
      }
    });

    imap.once('end', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ success: false, error: 'Connection ended unexpectedly' });
      }
    });

    console.log('   🔄 Connecting...');
    try {
      imap.connect();
    } catch (err) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.log('   ❌ Failed to initiate connection:', err.message);
        resolve({ success: false, error: err.message });
      }
    }
  });
}

async function runDiagnostics() {
  console.log('\n🚀 Starting IMAP diagnostics...\n');
  
  // Check prerequisites
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Email credentials not found in .env file');
    return;
  }

  if (process.env.EMAIL_PASSWORD.length !== 16) {
    console.log('⚠️ Gmail App Password should be 16 characters');
    console.log('   Current length:', process.env.EMAIL_PASSWORD.length);
  }

  let successfulConfig = null;

  for (const config of testConfigs) {
    const result = await testConnection(config);
    if (result.success) {
      successfulConfig = result.config;
      break;
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n📋 DIAGNOSIS SUMMARY');
  console.log('===================');
  
  if (successfulConfig) {
    console.log('✅ Working configuration found!');
    console.log('📝 Update your emailReceiver.js with these settings:');
    console.log(`   host: '${successfulConfig.host}'`);
    console.log(`   port: ${successfulConfig.port}`);
    console.log(`   secure: ${successfulConfig.secure}`);
  } else {
    console.log('❌ No working configuration found');
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Generate a fresh Gmail App Password');
    console.log('2. Verify 2-Factor Authentication is enabled');
    console.log('3. Check Windows Firewall settings');
    console.log('4. Try disabling antivirus temporarily');
    console.log('5. Check if your ISP blocks email ports');
    console.log('6. Try from a different network (mobile hotspot)');
  }
}

runDiagnostics().then(() => {
  console.log('\n🏁 Diagnostics complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Diagnostic error:', err);
  process.exit(1);
});
