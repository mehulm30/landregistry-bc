# Land Registry using IPFS

A Web3 project to register land with a unique ID, name, and PDF proof stored on IPFS. Users can register land, transfer ownership, and query land ownership using Ethereum wallet accounts.

## Stack

- Smart contract: Solidity
- Wallet: MetaMask
- Deployment & verification: Remix IDE (Sepolia testnet)
- IPFS pinning: Pinata
- Frontend: React + Vite

## Project structure

- `contracts/LandRegistry.sol` — Solidity contract for land registration, transfer, and ownership lookup.
- `frontend/` — React app for wallet connection, file upload, and contract interaction.

## Setup

1. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a Pinata JWT and add it to `frontend/.env`:

   ```env
   VITE_PINATA_JWT=your_pinata_jwt_here
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   ```

3. Start the React app:

   ```bash
   npm run dev
   ```

## Deployment

1. Open `contracts/LandRegistry.sol` in Remix.
2. Compile with Solidity `^0.8.19`.
3. Deploy to Sepolia with MetaMask.
4. Copy the deployed contract address into `frontend/.env`.
5. Verify the contract in Remix using the same compiler version and optimization settings.

## Usage

- Connect MetaMask
- Register land by providing an ID, name, and PDF file
- Transfer land to another wallet address
- Query land ownership and metadata by land ID

## Notes

- `pdfHash` is the IPFS CID returned by Pinata and uniquely represents the uploaded document.
- For production, avoid storing Pinata credentials in frontend code; use a backend service.
