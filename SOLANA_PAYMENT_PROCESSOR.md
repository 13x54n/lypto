# Solana Payment Processor

A complete full-stack payment processor application for Solana blockchain, similar to Stripe but for cryptocurrency payments. This application allows users to send and receive SOL and SPL tokens on the Solana network.

## Features

### 🔗 Wallet Integration
- **Multi-Wallet Support**: Phantom, Solflare, Torus wallet support
- **Auto-Connect**: Automatic wallet connection on page load
- **Network Support**: Devnet, Testnet, and Mainnet-beta support
- **Balance Tracking**: Real-time SOL and SPL token balance display

### 💳 Payment Processing
- **SOL Transfers**: Send native Solana tokens
- **SPL Token Support**: Send USDC, USDT, and other SPL tokens
- **Transaction Signing**: Secure transaction signing with user's wallet
- **Memo Support**: Add custom memos to transactions
- **Real-time Verification**: Blockchain transaction verification

### 📊 Dashboard & Analytics
- **Payment Dashboard**: View all transactions and balances
- **Transaction History**: Complete transaction history with explorer links
- **Payment Statistics**: Track payment metrics and analytics
- **Search & Filter**: Search transactions by signature, wallet, or memo

### 🛡️ Security & Reliability
- **Transaction Verification**: Automatic blockchain verification
- **Status Tracking**: Pending, confirmed, and failed payment tracking
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: API rate limiting for security

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI components
- **Solana Web3.js**: Solana blockchain integration
- **Wallet Adapter**: Multi-wallet support

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Solana Web3.js**: Blockchain integration

### Blockchain
- **Solana Network**: High-performance blockchain
- **SPL Tokens**: Solana Program Library tokens
- **Transaction Signing**: Secure wallet-based signing

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Solana wallet (Phantom, Solflare, etc.)

### Frontend Setup

1. **Install Dependencies**
```bash
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/spl-token
```

2. **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

3. **Start Development Server**
```bash
npm run dev
```

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install @solana/web3.js
```

2. **Environment Variables**
```bash
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zypto
PORT=3001
NODE_ENV=development
```

3. **Start Backend Server**
```bash
npm run dev
```

## Usage

### 1. Connect Wallet
- Visit the Solana payments page
- Click "Connect Wallet" button
- Select your preferred wallet (Phantom, Solflare, etc.)
- Approve the connection

### 2. Send Payments
- Navigate to "Send Payment" tab
- Select token type (SOL or SPL token)
- Enter recipient wallet address
- Enter amount to send
- Add optional memo
- Click "Send Payment"
- Sign transaction in your wallet

### 3. View Dashboard
- View your SOL and token balances
- See recent transaction history
- Track payment statistics
- Search and filter transactions

## API Endpoints

### Solana Payments

#### Create Payment
```http
POST /api/solana-payments
Content-Type: application/json

{
  "signature": "transaction_signature",
  "userId": "user_id",
  "amount": 1.5,
  "tokenMint": "optional_token_mint",
  "fromWallet": "sender_wallet_address",
  "toWallet": "recipient_wallet_address",
  "memo": "optional_memo"
}
```

#### Get Payment by Signature
```http
GET /api/solana-payments/:signature
```

#### Get User Payments
```http
GET /api/solana-payments/user/:userId?limit=20&offset=0
```

#### Get Payments by Wallet
```http
GET /api/solana-payments/wallet/:walletAddress?limit=20&offset=0
```

#### Update Payment Status
```http
PUT /api/solana-payments/:signature/status
Content-Type: application/json

{
  "status": "confirmed",
  "blockInfo": {
    "slot": 123456,
    "blockTime": "2024-01-15T10:30:00Z",
    "confirmationStatus": "confirmed"
  }
}
```

#### Verify Transaction
```http
POST /api/solana-payments/:signature/verify
```

#### Get Payment Statistics
```http
GET /api/solana-payments/stats/:userId
```

#### Search Payments
```http
GET /api/solana-payments/search?q=search_query&userId=optional_user_id
```

## Database Schema

### SolanaPayment Model
```javascript
{
  signature: String,        // Transaction signature (unique)
  userId: String,          // User reference
  amount: Number,          // Payment amount
  tokenMint: String,       // SPL token mint (optional)
  fromWallet: String,      // Sender wallet address
  toWallet: String,        // Recipient wallet address
  memo: String,            // Transaction memo (optional)
  status: String,          // pending, confirmed, failed
  network: String,         // devnet, testnet, mainnet-beta
  slot: Number,            // Block slot
  blockTime: Date,       // Block timestamp
  confirmationStatus: String, // Transaction confirmation status
  fee: Number,             // Transaction fee
  metadata: Object,        // Additional metadata
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Supported Tokens

### Native Tokens
- **SOL**: Native Solana token

### SPL Tokens
- **USDC**: USD Coin (mainnet & devnet)
- **USDT**: Tether USD
- **RAY**: Raydium token
- **SRM**: Serum token

## Network Support

### Development
- **Devnet**: For testing and development
- **Testnet**: For testing with real network conditions

### Production
- **Mainnet-beta**: Production Solana network

## Security Considerations

### Transaction Security
- All transactions are signed by user's wallet
- Private keys never leave the user's device
- Transactions are verified on blockchain
- Status tracking prevents double-spending

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- Error handling without sensitive data exposure
- CORS configuration for frontend access

### Database Security
- User data isolation
- Encrypted sensitive information
- Indexed queries for performance
- Regular cleanup of old pending transactions

## Development

### Adding New Tokens
1. Add token mint address to `COMMON_TOKENS` in `solana-payment.ts`
2. Update frontend token selection
3. Test token transfers on devnet

### Adding New Networks
1. Update network configuration in `SolanaWalletContext.tsx`
2. Add network support in `SolanaPaymentService`
3. Update backend network handling

### Customizing UI
- Modify components in `/src/components/`
- Update styles with Tailwind CSS
- Add new features to dashboard

## Testing

### Manual Testing
1. **Connect Wallet**: Test wallet connection
2. **Send SOL**: Test native token transfers
3. **Send SPL Tokens**: Test token transfers
4. **Verify Transactions**: Check blockchain verification
5. **View Dashboard**: Test balance and history display

### Automated Testing
```bash
# Run frontend tests
npm run test

# Run backend tests
cd backend && npm run test
```

## Deployment

### Frontend Deployment
1. Build the application
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or your preferred platform

### Backend Deployment
1. Set up MongoDB Atlas or your database
2. Configure environment variables
3. Deploy to Heroku, AWS, or your preferred platform

### Environment Configuration
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set up proper CORS origins
- Configure rate limiting for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

### Phase 1 (Current)
- ✅ Basic SOL and SPL token transfers
- ✅ Wallet integration
- ✅ Transaction history
- ✅ Payment dashboard

### Phase 2 (Planned)
- 🔄 Payment links and QR codes
- 🔄 Recurring payments
- 🔄 Payment analytics
- 🔄 Multi-signature support

### Phase 3 (Future)
- 🔄 Cross-chain support
- 🔄 DeFi integration
- 🔄 Advanced analytics
- 🔄 Mobile app

---

**Built with ❤️ for the Solana ecosystem**
