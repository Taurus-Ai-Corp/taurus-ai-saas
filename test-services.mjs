/**
 * Test all configured services
 */

import 'dotenv/config';

const tests = [];

// Test Hedera
async function testHedera() {
  const res = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${process.env.HEDERA_OPERATOR_ID}`);
  const data = await res.json();
  return {
    service: 'Hedera Testnet',
    status: res.ok ? '✅' : '❌',
    balance: data.balance ? `${(data.balance.balance / 1e8).toLocaleString()} HBAR` : 'N/A'
  };
}

// Test Anthropic
async function testAnthropic() {
  const hasKey = process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-');
  return {
    service: 'Anthropic API',
    status: hasKey ? '✅' : '❌',
    note: hasKey ? 'Key configured' : 'Missing key'
  };
}

// Test MongoDB
async function testMongoDB() {
  const hasUri = process.env.MONGODB_URI?.includes('mongodb');
  return {
    service: 'MongoDB Atlas',
    status: hasUri ? '✅' : '❌',
    note: hasUri ? 'URI configured' : 'Missing URI'
  };
}

// Test GitHub
async function testGitHub() {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  });
  const data = await res.json();
  return {
    service: 'GitHub',
    status: res.ok ? '✅' : '❌',
    user: data.login || 'N/A'
  };
}

// Test Firecrawl
async function testFirecrawl() {
  const hasKey = process.env.FIRECRAWL_API_KEY?.startsWith('fc-');
  return {
    service: 'Firecrawl',
    status: hasKey ? '✅' : '❌',
    note: hasKey ? 'Key configured' : 'Missing key'
  };
}

// Test Klavis
async function testKlavis() {
  const hasKey = !!process.env.KLAVIS_API_KEY;
  return {
    service: 'Klavis MCP',
    status: hasKey ? '✅' : '❌',
    note: hasKey ? 'Key configured' : 'Missing key'
  };
}

// Test HuggingFace
async function testHuggingFace() {
  const hasKey = process.env.HUGGINGFACE_TOKEN?.startsWith('hf_');
  return {
    service: 'HuggingFace',
    status: hasKey ? '✅' : '❌',
    note: hasKey ? 'Token configured' : 'Missing token'
  };
}

// Test Coinbase
async function testCoinbase() {
  const hasKey = process.env.COINBASE_API_KEY?.includes('organizations/');
  return {
    service: 'Coinbase (HTTPx402)',
    status: hasKey ? '✅' : '❌',
    note: hasKey ? 'Key configured' : 'Missing key'
  };
}

async function runTests() {
  console.log('🔍 Testing Taurus AI SAAS Services...\n');
  console.log('=' .repeat(50));

  const results = await Promise.all([
    testHedera(),
    testAnthropic(),
    testMongoDB(),
    testGitHub(),
    testFirecrawl(),
    testKlavis(),
    testHuggingFace(),
    testCoinbase(),
  ]);

  results.forEach(r => {
    console.log(`${r.status} ${r.service.padEnd(20)} ${r.balance || r.user || r.note || ''}`);
  });

  console.log('=' .repeat(50));
  const passed = results.filter(r => r.status === '✅').length;
  console.log(`\n📊 ${passed}/${results.length} services configured`);
}

runTests().catch(console.error);
