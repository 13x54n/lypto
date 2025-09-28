// Debug script to test mock API
const { mockApiService } = require('./src/lib/mock-api.ts')

async function testMockAPI() {
  try {
    console.log('Testing mock API...')
    
    const payments = await mockApiService.getPayments()
    console.log('Payments:', payments.length, payments[0])
    
    const sectionCards = await mockApiService.getSectionCards()
    console.log('Section Cards:', sectionCards.length, sectionCards[0])
    
    const stats = await mockApiService.getDashboardStats()
    console.log('Stats:', stats)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testMockAPI()
