import { useState } from 'react';

export default function TransferLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!enabled) return;

    setIsLoading(true);
    try {
      setMessage('⛓️ Submitting transfer transaction...');
      const tx = await contract.transferLand(BigInt(landId), recipient);
      setMessage('⏳ Waiting for blockchain confirmation...');
      await tx.wait();
      setMessage(`🎉 Land ${landId} transferred successfully to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
      // Clear form
      setLandId('');
      setRecipient('');
    } catch (error) {
      console.error(error);
      setMessage(`❌ Error: ${error.message || 'Transfer failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="web3-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔄</span>
        <h2 className="text-2xl font-bold text-white">Transfer Land Ownership</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="web3-label">Land ID</label>
          <input
            type="number"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            min="1"
            className="web3-input"
            placeholder="Enter land ID to transfer"
            required
          />
        </div>

        <div>
          <label className="web3-label">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="web3-input"
            placeholder="0x..."
            pattern="^0x[a-fA-F0-9]{40}$"
            title="Please enter a valid Ethereum address"
            required
          />
          {recipient && !/^0x[a-fA-F0-9]{40}$/.test(recipient) && (
            <p className="text-red-400 text-sm mt-1">Please enter a valid Ethereum address</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!enabled || isLoading || !/^0x[a-fA-F0-9]{40}$/.test(recipient)}
          className="web3-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <div className="spinner"></div>}
          {isLoading ? 'Processing...' : '🚀 Transfer Land'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl border ${
          message.includes('Error') || message.includes('❌')
            ? 'bg-red-500/20 border-red-500/30 text-red-300'
            : message.includes('✅') || message.includes('🎉')
            ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
