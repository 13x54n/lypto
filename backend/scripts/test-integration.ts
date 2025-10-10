/**
 * Integration Test Script
 * Tests the complete merchant → customer payment flow
 */

const API_BASE = 'http://localhost:4000';

interface TestResult {
  step: string;
  success: boolean;
  data?: any;
  error?: string;
}

const results: TestResult[] = [];

async function testIntegration() {
  console.log('🧪 TESTING MERCHANT-CUSTOMER INTEGRATION\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Create a payment request (as merchant)
    console.log('\n📋 STEP 1: Merchant creates payment request');
    console.log('-'.repeat(60));
    
    const createPaymentRes = await fetch(`${API_BASE}/api/merchant/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_at_test_com',
        userEmail: 'test@test.com',
        amount: 25.50,
        merchantEmail: 'merchant@store.com',
      }),
    });

    const createPaymentData = await createPaymentRes.json();
    
    if (createPaymentRes.ok && createPaymentData.success) {
      console.log('✅ Payment request created');
      console.log(`   Payment ID: ${createPaymentData.paymentId}`);
      results.push({
        step: 'Create Payment',
        success: true,
        data: createPaymentData,
      });
    } else {
      console.log('❌ Failed to create payment');
      console.log(`   Error: ${createPaymentData.error}`);
      results.push({
        step: 'Create Payment',
        success: false,
        error: createPaymentData.error,
      });
      return;
    }

    const paymentId = createPaymentData.paymentId;

    // Step 2: Customer checks pending payments
    console.log('\n📋 STEP 2: Customer checks pending payments');
    console.log('-'.repeat(60));
    
    const pendingPaymentsRes = await fetch(
      `${API_BASE}/api/merchant/pending-payments?userEmail=test@test.com`
    );

    const pendingPaymentsData = await pendingPaymentsRes.json();
    
    if (pendingPaymentsRes.ok && pendingPaymentsData.payments.length > 0) {
      console.log(`✅ Found ${pendingPaymentsData.count} pending payment(s)`);
      console.log(`   First payment: $${pendingPaymentsData.payments[0].amount}`);
      console.log(`   From: ${pendingPaymentsData.payments[0].merchantEmail}`);
      results.push({
        step: 'Get Pending Payments',
        success: true,
        data: pendingPaymentsData,
      });
    } else {
      console.log('❌ No pending payments found');
      results.push({
        step: 'Get Pending Payments',
        success: false,
        error: 'No pending payments',
      });
    }

    // Step 3: Customer confirms payment
    console.log('\n📋 STEP 3: Customer confirms payment');
    console.log('-'.repeat(60));
    
    const confirmPaymentRes = await fetch(`${API_BASE}/api/merchant/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: paymentId,
        status: 'confirmed',
      }),
    });

    const confirmPaymentData = await confirmPaymentRes.json();
    
    if (confirmPaymentRes.ok && confirmPaymentData.success) {
      console.log('✅ Payment confirmed');
      console.log(`   Status: ${confirmPaymentData.payment.status}`);
      console.log(`   Confirmed at: ${confirmPaymentData.payment.confirmedAt}`);
      results.push({
        step: 'Confirm Payment',
        success: true,
        data: confirmPaymentData,
      });
    } else {
      console.log('❌ Failed to confirm payment');
      console.log(`   Error: ${confirmPaymentData.error}`);
      results.push({
        step: 'Confirm Payment',
        success: false,
        error: confirmPaymentData.error,
      });
    }

    // Step 4: Merchant checks transactions
    console.log('\n📋 STEP 4: Merchant checks transaction history');
    console.log('-'.repeat(60));
    
    const transactionsRes = await fetch(
      `${API_BASE}/api/merchant/transactions?merchantEmail=merchant@store.com`
    );

    const transactionsData = await transactionsRes.json();
    
    if (transactionsRes.ok) {
      console.log(`✅ Found ${transactionsData.count} transaction(s)`);
      const confirmed = transactionsData.transactions.filter((t: any) => t.status === 'confirmed');
      console.log(`   Confirmed: ${confirmed.length}`);
      results.push({
        step: 'Get Transactions',
        success: true,
        data: transactionsData,
      });
    } else {
      console.log('❌ Failed to get transactions');
      results.push({
        step: 'Get Transactions',
        success: false,
      });
    }

    // Step 5: Merchant checks stats
    console.log('\n📋 STEP 5: Merchant checks stats');
    console.log('-'.repeat(60));
    
    const statsRes = await fetch(
      `${API_BASE}/api/merchant/stats?merchantEmail=merchant@store.com`
    );

    const statsData = await statsRes.json();
    
    if (statsRes.ok) {
      console.log('✅ Stats retrieved');
      console.log(`   Today: ${statsData.today.count} transactions, $${statsData.today.total.toFixed(2)}`);
      console.log(`   Week: ${statsData.week.count} transactions, $${statsData.week.total.toFixed(2)}`);
      console.log(`   Month: ${statsData.month.count} transactions, $${statsData.month.total.toFixed(2)}`);
      results.push({
        step: 'Get Stats',
        success: true,
        data: statsData,
      });
    } else {
      console.log('❌ Failed to get stats');
      results.push({
        step: 'Get Stats',
        success: false,
      });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n✅ Passed: ${passed}/${results.length}`);
    console.log(`❌ Failed: ${failed}/${results.length}`);
    
    results.forEach((result, i) => {
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} ${i + 1}. ${result.step}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('Your integration is working perfectly! 🚀');
    } else {
      console.log('\n⚠️  Some tests failed. Check the errors above.');
    }

  } catch (error) {
    console.error('\n❌ TEST ERROR:', error);
  }
}

// Run if backend is available
console.log('⏳ Checking if backend is running...');
fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Backend is running!\n');
      testIntegration();
    } else {
      console.log('❌ Backend health check failed');
    }
  })
  .catch(error => {
    console.log('❌ Backend is not running!');
    console.log('\nPlease start the backend first:');
    console.log('   cd backend');
    console.log('   npm run dev');
  });

