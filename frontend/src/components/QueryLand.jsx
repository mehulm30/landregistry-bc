import { useState } from 'react';

export default function QueryLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async (event) => {
    event.preventDefault();
    if (!enabled) return;

    setIsLoading(true);
    try {
      setMessage('🔍 Querying blockchain...');
      const landData = await contract.getLand(BigInt(landId));
      const owner = await contract.getOwner(BigInt(landId));
      setResult({
        id: landData[0].toString(),
        name: landData[1],
        pdfHash: landData[2],
        owner
      });
      setMessage('✅ Land record found');
    } catch (error) {
      console.error(error);
      setMessage(`❌ Error: ${error.message || 'Query failed'}`);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="web3-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔍</span>
        <h2 className="text-2xl font-bold text-white">Query Land Records</h2>
      </div>

      <form onSubmit={handleQuery} className="space-y-6">
        <div>
          <label className="web3-label">Land ID</label>
          <input
            type="number"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            min="1"
            className="web3-input"
            placeholder="Enter land ID to query"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!enabled || isLoading}
          className="web3-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <div className="spinner"></div>}
          {isLoading ? 'Searching...' : '🔍 Query Land'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl border ${
          message.includes('Error') || message.includes('❌')
            ? 'bg-red-500/20 border-red-500/30 text-red-300'
            : message.includes('✅')
            ? 'bg-green-500/20 border-green-500/30 text-green-300'
            : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📄</span> Land Record Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-white/70 text-sm">Land ID:</span>
                <p className="text-white font-medium">{result.id}</p>
              </div>
              <div>
                <span className="text-white/70 text-sm">Land Name:</span>
                <p className="text-white font-medium">{result.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-white/70 text-sm">Owner Address:</span>
                <p className="text-white font-mono text-sm break-all">
                  {result.owner.slice(0, 6)}...{result.owner.slice(-4)}
                </p>
              </div>
              <div>
                <span className="text-white/70 text-sm">IPFS Hash:</span>
                <p className="text-white font-mono text-sm break-all">
                  {result.pdfHash.slice(0, 20)}...{result.pdfHash.slice(-6)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${result.pdfHash}`}
              target="_blank"
              rel="noreferrer"
              className="web3-button inline-block"
            >
              📄 View Land Document
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
