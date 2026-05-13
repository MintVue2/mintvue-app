# MintVue Backend

Production-ready backend orchestrating authentication, content management, NFT minting via Bags API, marketplace transactions, ticketing, and notifications.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (via SQLModel)
- **Caching**: Redis
- **Task Queue**: Celery / RQ
- **Email**: Resend
- **Encryption**: Fernet (dev) / AWS KMS (prod)
- **HTTP Client**: HTTPX
- **Real-time**: WebSockets

## Core Models

### User
- `id`: Unique identifier
- `email`: User email
- `username`: Display name
- `wallet_address`: Blockchain wallet
- `creator_flags`: Permissions/roles

### Content
- `id`: Unique identifier
- `creator_id`: Author reference
- `media_url`: Content file location
- `caption`: Description
- `views`: View count
- `likes`: Like count
- `nft_linkage`: Link to minted NFT

### NFT
- `id`: Internal identifier
- `token_id`: Blockchain token ID
- `contract_address`: Smart contract address
- `metadata_url`: IPFS/metadata URI
- `price`: NFT price
- `mint_status`: Pending/confirmed/failed

### Transaction
- `nft_id`: NFT being traded
- `buyer_id`: Purchaser reference
- `seller_id`: Seller reference
- `amount`: Transaction value
- `tx_hash`: Blockchain transaction hash

### Event/Ticket
- NFT-linked tickets with ownership validation

### Notification
- `user_id`: Recipient
- `type`: Category (in-app, email, etc.)
- `message`: Content

## Authentication Flow

```
POST /auth/login
├── Create user (if new)
├── Assign wallet
└── Return JWT
```

Google sign-in is available at `POST /auth/login/google` and accepts a Google ID token or credential payload. The backend verifies the token against `GOOGLE_OAUTH_CLIENT_ID`, creates the user on first login, and returns the same JWT response.

## Core Features

### Content Management
- `POST /content` - Create content
- `GET /content/feed` - Retrieve feed (Redis cached)

### NFT Minting
- `POST /nft/mint` - Initiate mint via Bags API
- Store pending status
- Confirm via webhook

### Marketplace
- `POST /marketplace/buy` - Purchase NFT
- Execute Bags API transfer
- Confirm and store transaction
- Track seller earnings

### Events & Ticketing
- Create events
- Mint tickets as NFTs
- Validate via ownership verification

### Paid Views
- Track views with anti-fraud measures
- Calculate earnings asynchronously

### Notifications
- In-app notifications
- Email notifications via Resend

## Webhook Handling

`POST /webhooks/bags` - Handles:
- Mint confirmations
- Transfer confirmations

## Security

- **Authentication**: JWT tokens
- **Data Protection**: Encryption (Fernet/AWS KMS)
- **Rate Limiting**: Enabled
- **Idempotency**: Idempotency keys on transactions

## Async Jobs

- Mint confirmations
- Transfer confirmations
- Email delivery
- Earnings calculations

## MVP Priority

1. Authentication
2. Content creation & feed
3. NFT minting
4. Marketplace (buy/sell)
5. Notifications
6. Ticketing

## Core Loop

```
Content → Mint → Buy → Earn → Repeat
```

## Project Structure

```
backend/
├── app/
│   ├── models/        # Data models
│   ├── routers/       # API endpoints
│   └── service/       # Business logic
├── core/
│   ├── config.py      # Configuration
│   ├── email.py       # Email service
│   ├── logger.py      # Logging
│   ├── middleware.py  # Middleware
│   └── session.py     # Session management
├── logs/              # Application logs
├── templates/         # Email templates
├── main.py            # Application entry
├── requirements.txt   # Dependencies
└── pyproject.toml     # Project configuration
```

## Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
python main.py
```

## Contributing

Follow the project structure and ensure all changes align with the MVP priority and security guidelines.
