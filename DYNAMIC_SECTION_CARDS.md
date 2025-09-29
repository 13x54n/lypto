# User-Specific Dynamic Section Cards System

This system allows you to manage section cards with both static content (titles, descriptions) and dynamic values that can be calculated from business data or manually updated. **Each user has their own separate section cards** that are referenced to their Firebase user ID.

## Features

### Static Content
- **Title**: Fixed titles like "Total Revenue", "Active Subscriptions"
- **Description**: Fixed descriptions that explain what each card represents
- **Business Type**: Categorizes cards by business function (revenue, subscriptions, payments, refunds, custom)

### Dynamic Values
- **Value**: The main metric (e.g., "$15,420.50", "7", "3")
- **Trend**: Numerical trend value (e.g., 24.5, -5.2)
- **Trend Label**: Human-readable trend (e.g., "+24.5%", "-5.2%")
- **Last Updated**: Timestamp of last value update
- **Data Source**: How the value was set (calculated, manual, api)

## Database Structure

```javascript
{
  userId: "firebase-user-123",             // User reference
  title: "Total Revenue",                  // Static
  description: "Total revenue generated",  // Static
  businessType: "revenue",                // Static
  value: "$15,420.50",                    // Dynamic
  trend: 24.5,                           // Dynamic
  trendLabel: "+24.5%",                  // Dynamic
  lastUpdated: "2024-01-15T10:30:00Z",   // Dynamic
  dataSource: "calculated"               // Dynamic
}
```

### User Isolation
- Each user has their own set of section cards
- Data is completely isolated between users
- Calculations are based on user-specific payment data
- No cross-user data leakage

## API Endpoints

### Get Section Cards (User-Specific)
```
GET /api/dashboard/section-cards?userId=firebase-user-123
```
Returns all section cards for the specified user.

### Update Section Cards (Recalculate)
```
POST /api/dashboard/section-cards/update
Content-Type: application/json

{
  "userId": "firebase-user-123"
}
```
Recalculates all section card values from user-specific business data.

### Update Individual Section Card
```
PUT /api/dashboard/section-cards/:title
Content-Type: application/json

{
  "userId": "firebase-user-123",
  "value": "$20,000.00",
  "trend": 35.5,
  "trendLabel": "+35.5%"
}
```

## Usage Examples

### Frontend Hook
```typescript
import { useSectionCards } from '@/hooks/use-dashboard-data'

function MyComponent() {
  const userId = 'firebase-user-123' // Get from Firebase auth context
  const { 
    data: sectionCards, 
    updateSectionCards, 
    updateSectionCardValue 
  } = useSectionCards(userId)

  // Recalculate all cards from user-specific business data
  const handleRecalculate = () => {
    updateSectionCards()
  }

  // Manually update a specific card
  const handleUpdateCard = () => {
    updateSectionCardValue(
      "Total Revenue", 
      "$25,000.00", 
      40.0, 
      "+40%"
    )
  }
}
```

### Backend Service
```javascript
const SectionCardService = require('./services/sectionCardService')

const userId = 'firebase-user-123'

// Initialize section cards with templates for specific user
await SectionCardService.initializeSectionCards(userId)

// Update all cards with calculated values for specific user
await SectionCardService.updateSectionCards(userId)

// Manually update a specific card for specific user
await SectionCardService.updateSectionCardValue(
  userId,
  "Total Revenue", 
  "$20,000.00", 
  35.5, 
  "+35.5%"
)
```

## Business Logic

### Automatic Calculation
The system automatically calculates values from **user-specific** payment data:

- **Total Revenue**: Sum of all positive payment amounts for the user
- **Active Subscriptions**: Count of subscription payments with positive amounts for the user
- **One-time Payments**: Count of one-time payments with positive amounts for the user
- **Refunds**: Count of payments with negative amounts for the user

### Manual Override
Any section card can be manually updated with custom values, which will be marked with `dataSource: "manual"`.

### Recalculation
The "Recalculate from Data" function will:
1. Query the latest **user-specific** business data
2. Calculate new values for all cards for that user
3. Update the database with user-specific records
4. Mark all cards as `dataSource: "calculated"`

## Admin Interface

Visit `/admin` to see the Section Card Admin interface where you can:
- View all section cards with their current values
- Edit individual card values manually
- Recalculate all cards from business data
- See when each card was last updated
- View the data source for each card

## Benefits

1. **User Isolation**: Each user has completely separate section cards
2. **Data Security**: No cross-user data leakage
3. **Flexibility**: Mix calculated and manual values as needed
4. **Transparency**: Track when and how values were updated
5. **Consistency**: Static content ensures consistent UI
6. **Scalability**: Easy to add new section card types
7. **Audit Trail**: Full history of value changes per user
8. **Multi-tenant Ready**: Perfect for SaaS applications
