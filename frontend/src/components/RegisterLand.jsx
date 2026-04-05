import { useState } from 'react';
import { uploadFileToPinata } from '../utils/pinata';

export default function RegisterLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [name, setName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!enabled) return;
    if (!pdfFile) {
      setMessage('Choose a PDF file first.');
      return;
    }

    setIsLoading(true);
    try {
      setMessage('📤 Uploading PDF to IPFS...');
      const ipfsHash = await uploadFileToPinata(pdfFile);
      setMessage(`✅ IPFS hash received: ${ipfsHash.slice(0, 20)}...`);

      setMessage('⛓️ Submitting transaction to blockchain...');
      const tx = await contract.registerLand(BigInt(landId), name, ipfsHash);
      setMessage('⏳ Waiting for blockchain confirmation...');

      await tx.wait();
      setMessage('🎉 Land registered successfully!');
      // Clear form
      setLandId('');
      setName('');
      setPdfFile(null);
    } catch (error) {
      console.error(error);
      setMessage(`❌ Error: ${error.message || 'Registration failed'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="web3-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📋</span>
        <h2 className="text-2xl font-bold text-white">Register New Land</h2>
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
            placeholder="Enter unique land ID"
            required
          />
        </div>

        <div>
          <label className="web3-label">Land Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="web3-input"
            placeholder="Enter land name or description"
            required
          />
        </div>

        <div>
          <label className="web3-label">Land Document (PDF)</label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="web3-input file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              required
            />
          </div>
          {pdfFile && (
            <p className="text-sm text-white/70 mt-2">
              Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!enabled || isLoading}
          className="web3-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <div className="spinner"></div>}
          {isLoading ? 'Processing...' : '🚀 Register Land'}
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
