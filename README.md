# 🌍 Land Registry dApp

A modern Web3 decentralized application for secure land registration using Ethereum blockchain and IPFS for document storage. Features a beautiful, responsive UI with real-time transaction status and seamless wallet integration.

## ✨ Features

- **🔐 Secure Land Registration**: Register land with unique ID, name, and PDF documents
- **🔄 Ownership Transfer**: Transfer land ownership between Ethereum addresses
- **🔍 Land Query**: Query land records and view IPFS-stored documents
- **🎨 Modern UI**: Beautiful glassmorphism design with Tailwind CSS
- **📱 Responsive**: Works perfectly on desktop and mobile devices
- **⚡ Real-time Status**: Live transaction updates and loading states
- **🛡️ Network Validation**: Automatic Sepolia testnet detection and switching

## 🛠️ Tech Stack

- **Smart Contract**: Solidity ^0.8.19
- **Blockchain**: Ethereum Sepolia Testnet
- **Wallet**: MetaMask
- **IPFS**: Pinata for document storage
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom Web3 theme
- **Web3 Library**: Ethers.js v6

## 📁 Project Structure

```
landregistry-bc/
├── contracts/
│   └── LandRegistry.sol          # Solidity smart contract
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── RegisterLand.jsx  # Land registration form
│   │   │   ├── TransferLand.jsx  # Ownership transfer form
│   │   │   └── QueryLand.jsx     # Land query interface
│   │   ├── App.jsx               # Main application
│   │   ├── constants.js          # Contract ABI and address
│   │   └── styles.css            # Tailwind CSS styles
│   ├── .env                      # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MetaMask browser extension
- Sepolia ETH for gas fees (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone and navigate to frontend:**
   ```bash
   cd landregistry-bc/frontend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   VITE_PINATA_JWT=your_pinata_jwt_here
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:5173](http://localhost:5173)**

## 📋 Usage

1. **Connect Wallet**: Click "🔗 Connect MetaMask" to connect your wallet
2. **Switch Network**: Ensure you're on Sepolia testnet
3. **Register Land**: Upload PDF document and register new land
4. **Transfer Land**: Transfer ownership to another address
5. **Query Land**: Search for land records by ID

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effects
- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Loading Animations**: Spinners and status indicators
- **Responsive Layout**: Mobile-first design approach
- **Web3 Integration**: Seamless wallet connection flow
- **Transaction Feedback**: Real-time status updates

## 🔧 Development

### Smart Contract Deployment

1. Open `contracts/LandRegistry.sol` in [Remix IDE](https://remix.ethereum.org/)
2. Compile with Solidity `^0.8.19`
3. Deploy to Sepolia testnet via MetaMask
4. Copy contract address to `.env`
5. Verify contract on Etherscan

### Building for Production

```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and building Web3 applications!

---

Built with ❤️ for the decentralized future
- Register land by providing an ID, name, and PDF file
- Transfer land to another wallet address
- Query land ownership and metadata by land ID

## Notes

- `pdfHash` is the IPFS CID returned by Pinata and uniquely represents the uploaded document.
- For production, avoid storing Pinata credentials in frontend code; use a backend service.
