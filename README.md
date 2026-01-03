# n8n-nodes-gateio

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Gate.io cryptocurrency exchange providing 14 resources and 100+ operations for spot, margin, futures, and options trading. Includes unified account, sub-account management, earn products, and flash swap functionality.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Gate.io API](https://img.shields.io/badge/Gate.io-APIv4-green)

## Features

- **Complete Spot Trading** - Place, cancel, and manage spot orders with batch operations
- **Margin Trading** - Cross margin and isolated margin with auto-repay support
- **Futures Trading** - USDT and BTC settled contracts with dual position mode
- **Options Trading** - Full options support with position and order management
- **Unified Account** - Cross-product margin with leverage settings
- **Wallet Operations** - Deposits, withdrawals, transfers between accounts
- **Sub-Account Management** - Create and manage API keys for sub-accounts
- **Earn Products** - Dual investment and structured products
- **Flash Swap** - Instant token swaps with preview
- **Poll-based Triggers** - 10 event triggers for automated workflows
- **Testnet Support** - Full testnet compatibility for development

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-gateio`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone or download this repository
npm install n8n-nodes-gateio
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-gateio.git
cd n8n-nodes-gateio

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gateio

# Restart n8n
n8n start
```

## Credentials Setup

To use this node, you need Gate.io API credentials:

1. Log into your [Gate.io account](https://www.gate.io)
2. Go to **API Management**
3. Create a new API key with appropriate permissions
4. Enable IP whitelisting for security (recommended)

### Credential Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| API Key | Your Gate.io API key | Required |
| API Secret | Your Gate.io API secret | Required |
| Environment | Production or Testnet | Production |
| Base URL - Spot | Spot API base URL | https://api.gateio.ws/api/v4 |
| Base URL - Futures USDT | USDT Futures base URL | https://api.gateio.ws/api/v4 |
| Base URL - Futures BTC | BTC Futures base URL | https://api.gateio.ws/api/v4 |
| Default Settle Currency | Default futures settlement | USDT |

## Resources & Operations

### Account
- Get account detail, balance, small balance
- Convert small balance to GT token
- Get rate limits, saved addresses, trading fees, withdrawal status

### Wallet
- Get currency chains, deposit addresses
- Withdraw, cancel withdrawal
- Get withdrawal/deposit records
- Transfer between accounts (spot, margin, futures, options)
- Get sub-account transfers and balances
- Get total estimated balance

### Spot Trading
- Get currency pairs, tickers, order book, trades, candlesticks
- Place orders (limit, market, IOC, POC)
- Batch place orders
- Get, amend, cancel orders
- Cancel batch orders, cancel all orders
- Get my trades
- Countdown cancel all

### Margin Trading
- Get margin accounts, account book, funding accounts
- Update/get auto-repay settings
- Get max transferable/borrowable amounts
- Get supported margin pairs
- Borrow, repay, merge loans
- Get loan records, repayment records

### Cross Margin
- Get supported currencies and details
- Get cross margin account and account book
- Create, get, repay loans
- Get repayments, interest records
- Get max transferable, borrowable, estimated rate

### Futures Trading
- Get contracts, contract details, contract stats
- Get order book, trades, candlesticks
- Get tickers, premium index
- Get funding rate and history
- Get insurance balance, index constituents, liquidation history

### Futures Account
- Get futures accounts and account book
- Get positions, single position
- Update position margin, leverage, risk limit
- Set dual mode (hedge mode)
- Get/update dual mode positions

### Futures Orders
- Place, get, cancel orders
- Batch orders, cancel all orders
- Amend orders
- Get my trades, position close history
- Get liquidation history
- Countdown cancel all

### Options Trading
- Get underlyings, contracts, settlements
- Get tickers, order book, trades, candlesticks
- Get options account, positions
- Place, get, cancel orders
- Get my trades

### Earn
- Get dual investment products and orders
- Place dual investment order
- Get structured products and orders
- Place structured order

### Flash Swap
- Get supported currencies and pairs
- Preview swap
- Create swap order
- Get orders and order detail

### Sub-Account
- Get, create sub-accounts
- Get, create, update, delete API keys
- Lock/unlock sub-accounts

### Unified Account
- Get unified account info
- Get borrowable/transferable amounts
- Borrow, repay funds
- Get loans, loan records, interest records
- Set/get leverage settings
- Get risk unit info

### Utility
- Get server time
- Check API health

## Trigger Node

The Gate.io Trigger node provides poll-based event detection:

| Event | Description |
|-------|-------------|
| New Spot Order | Triggered when a new spot order is placed |
| Spot Order Filled | Triggered when a spot order is filled |
| New Futures Order | Triggered when a new futures order is placed |
| Futures Order Filled | Triggered when a futures order is filled |
| Position Changed | Triggered when a futures position changes |
| Deposit Received | Triggered when a deposit is received |
| Withdrawal Completed | Triggered when a withdrawal completes |
| Price Alert | Triggered when price crosses a threshold |
| Funding Payment | Triggered when funding payment is received |
| Liquidation Warning | Triggered when position is near liquidation |

## Usage Examples

### Place a Spot Market Order

```
Resource: Spot Trading
Operation: Place Order
Currency Pair: BTC_USDT
Type: Market
Side: Buy
Amount: 0.001
```

### Get Futures Positions

```
Resource: Futures Account
Operation: Get Positions
Settle: USDT
```

### Transfer Between Accounts

```
Resource: Wallet
Operation: Transfer
Currency: USDT
From: Spot
To: Futures
Amount: 100
Settle Currency: USDT
```

## Gate.io Concepts

| Concept | Description |
|---------|-------------|
| settle | Settlement currency for futures (usdt/btc) |
| currency_pair | Trading pair format (e.g., BTC_USDT) |
| contract | Futures contract name (e.g., BTC_USDT) |
| size | Position size (negative for short positions) |
| leverage | Position leverage (0 for cross margin) |
| auto_size | Auto-close mode: close_long or close_short |
| reduce_only | Order only reduces position |
| GT | Gate Token - native exchange token |
| iceberg | Hidden order display amount |
| ioc | Immediate or cancel order |
| poc | Post-only (maker only) order |

## Networks

| Network | Base URL | Usage |
|---------|----------|-------|
| Production | https://api.gateio.ws/api/v4 | Live trading |
| Testnet | https://fx-api-testnet.gateio.ws/api/v4 | Paper trading/testing |

## Error Handling

The node handles Gate.io API errors with descriptive messages:

| Error Code | Description |
|------------|-------------|
| INVALID_KEY | Invalid API key |
| INVALID_SIGNATURE | Signature mismatch - check API secret |
| INVALID_TIMESTAMP | System clock out of sync |
| RATE_LIMIT_EXCEEDED | Too many requests |
| INSUFFICIENT_BALANCE | Not enough funds |
| ORDER_NOT_FOUND | Order doesn't exist |
| INVALID_CURRENCY_PAIR | Unsupported trading pair |
| INVALID_AMOUNT | Amount out of range |
| INVALID_PRICE | Price out of range |

## Security Best Practices

1. **Enable IP Whitelisting** - Restrict API access to specific IPs
2. **Use Minimal Permissions** - Only enable required permissions
3. **Separate API Keys** - Use different keys for different purposes
4. **Enable 2FA** - Protect your Gate.io account
5. **Test on Testnet** - Validate workflows before production
6. **Monitor API Usage** - Track rate limits and activity

## Rate Limits

Gate.io implements rate limiting:
- **Read operations**: 900 requests per second per IP
- **Write operations**: 300 requests per second per IP

The node handles rate limiting automatically with exponential backoff.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and follow the existing code style.

## Support

- **Documentation**: [Gate.io API Documentation](https://www.gate.io/docs/developers/apiv4/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gateio/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Gate.io](https://www.gate.io) for their comprehensive API
- [n8n](https://n8n.io) for the excellent automation platform
- [Velocity BPA](https://velobpa.com) for sponsoring development
