import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import RegisterLand from './components/RegisterLand';
import TransferLand from './components/TransferLand';
import QueryLand from './components/QueryLand';
import { contractAddress, contractAbi } from './constants';

function App() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState('Connect MetaMask to start');
  const [contract, setContract] = useState(null);
  const [configError, setConfigError] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    try {
      // Validate contractAddress is available and valid
      if (!contractAddress || contractAddress === '0xYourDeployedContractAddress') {
        throw new Error('VITE_CONTRACT_ADDRESS not configured in .env');
      }
    } catch (error) {
      setConfigError(error.message);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      initContract();
    }
  }, [account]);

  const initContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork({ name: network.name, chainId: network.chainId });

      const SEPOLIA_CHAIN_ID = 11155111n;
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        setStatus(`Wrong network. Expected Sepolia (${SEPOLIA_CHAIN_ID}), got ${network.name} (${network.chainId}). Please switch networks.`);
        setContract(null);
        return;
      }

      const signer = await provider.getSigner();
      const landContract = new ethers.Contract(contractAddress, contractAbi, signer);
      setContract(landContract);
      setStatus('Connected to Sepolia. Ready to register or transfer land.');
    } catch (error) {
      console.error(error);
      setStatus('Unable to initialize contract. Check console for details.');
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setContract(null);
      setStatus('MetaMask locked or no account connected');
    } else {
      setAccount(accounts[0]);
      setStatus('Account connected');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask is not installed');
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      console.error(error);
      setStatus('Connection rejected');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask is not installed');
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xAA36A7' }], // 11155111 in hex
      });
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xAA36A7',
                chainName: 'Sepolia',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
          setStatus('Failed to add Sepolia network');
        }
      } else {
        console.error(error);
        setStatus('Failed to switch to Sepolia');
      }
    }
  };

  const contractLoaded = useMemo(() => !!contract && account, [contract, account]);

  const getStatusClass = () => {
    if (configError) return 'status-warning';
    if (account && network?.chainId === 11155111n) return 'status-connected';
    return 'status-disconnected';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="web3-card p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🌍 Land Registry dApp
            </h1>
            <p className="text-white/80 text-lg">
              Secure land registration on the blockchain with IPFS document storage
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className={`web3-card p-6 mb-6 ${getStatusClass()}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Wallet Status</h3>
                <p className="text-white/90">{status}</p>
                {network && (
                  <p className="text-sm text-white/70 mt-1">
                    Network: <span className="font-medium">{network.name}</span> (Chain ID: {network.chainId})
                  </p>
                )}
                {account && (
                  <p className="text-sm text-white/70 mt-1 font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                {!account ? (
                  <button
                    onClick={connectWallet}
                    disabled={!!configError || isConnecting}
                    className="web3-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isConnecting && <div className="spinner"></div>}
                    {isConnecting ? 'Connecting...' : '🔗 Connect MetaMask'}
                  </button>
                ) : account && network && network.chainId !== 11155111n && (
                  <button
                    onClick={switchToSepolia}
                    className="web3-button bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    🔄 Switch to Sepolia
                  </button>
                )}
              </div>
            </div>
          </div>

          {configError && (
            <div className="web3-card p-4 status-warning">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-white">Configuration Error</h4>
                  <p className="text-white/90">{configError}</p>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {!configError && (
            <>
              <RegisterLand contract={contract} enabled={contractLoaded} />
              <TransferLand contract={contract} enabled={contractLoaded} />
              <QueryLand contract={contract} enabled={contractLoaded} />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="web3-card p-6">
            <p className="text-white/80 text-sm">
              Built with ❤️ using{' '}
              <span className="text-blue-400 font-semibold">Ethereum</span>,{' '}
              <span className="text-purple-400 font-semibold">IPFS</span>, and{' '}
              <span className="text-green-400 font-semibold">React</span>
            </p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <span className="text-2xl">⛓️</span>
              <span className="text-white/60 text-xs">Decentralized • Secure • Transparent</span>
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
