/**
 * Quick test for Hedera MCP integration
 */

import 'dotenv/config';

const MIRROR_NODE = 'https://testnet.mirrornode.hedera.com';
const ACCOUNT_ID = process.env.HEDERA_OPERATOR_ID;

async function testConnection() {
  console.log('🔗 Testing Hedera Testnet Connection...\n');
  console.log(`Account: ${ACCOUNT_ID}`);
  console.log(`Network: ${process.env.HEDERA_NETWORK}`);

  // Test account balance
  const response = await fetch(`${MIRROR_NODE}/api/v1/accounts/${ACCOUNT_ID}`);
  const data = await response.json();

  const hbars = data.balance.balance / 100000000;
  console.log(`\n✅ Account Balance: ${hbars.toLocaleString()} HBAR`);
  console.log(`   Key Type: ${data.key._type}`);
  console.log(`   EVM Address: ${data.evm_address}`);

  // Test network status
  const networkResponse = await fetch(`${MIRROR_NODE}/api/v1/network/nodes?limit=3`);
  const networkData = await networkResponse.json();

  console.log(`\n🌐 Network Nodes (sample):`);
  networkData.nodes.slice(0, 3).forEach(node => {
    console.log(`   - ${node.node_id}: ${node.description}`);
  });

  console.log('\n✅ Hedera MCP integration ready!');
}

testConnection().catch(console.error);
