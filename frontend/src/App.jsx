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
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      console.error(error);
      setStatus('Connection rejected');
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

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <header>
        <h1>Land Registry using IPFS</h1>
        {configError && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <strong>⚠ Configuration Error:</strong> {configError}
          </div>
        )}
        {network && (
          <div style={{ fontSize: 14, marginBottom: 12, color: '#666' }}>
            Network: <strong>{network.name}</strong> (Chain ID: {network.chainId})
          </div>
        )}
        <p>{status}</p>
        <div>
          <button onClick={connectWallet} disabled={!!configError} style={{ padding: '10px 16px', borderRadius: 8, marginRight: 8 }}>
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect MetaMask'}
          </button>
          {account && network && network.chainId !== 11155111n && (
            <button onClick={switchToSepolia} style={{ padding: '10px 16px', borderRadius: 8, background: '#dc2626' }}>
              Switch to Sepolia
            </button>
          )}
        </div>
      </header>

      <main style={{ marginTop: 24 }}>
        {!configError && (
          <>
            <RegisterLand contract={contract} enabled={contractLoaded} />
            <TransferLand contract={contract} enabled={contractLoaded} />
            <QueryLand contract={contract} enabled={contractLoaded} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
