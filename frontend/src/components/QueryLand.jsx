import { useState } from 'react';

export default function QueryLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleQuery = async (event) => {
    event.preventDefault();
    if (!enabled) return;

    try {
      setMessage('Querying contract...');
      const landData = await contract.getLand(BigInt(landId));
      const owner = await contract.getOwner(BigInt(landId));
      setResult({ id: landData[0].toString(), name: landData[1], pdfHash: landData[2], owner });
      setMessage('Land record found');
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Query failed');
      setResult(null);
    }
  };

  return (
    <section className="panel">
      <h2>Query Land</h2>
      <form onSubmit={handleQuery}>
        <label>Land ID</label>
        <input type="number" value={landId} onChange={(e) => setLandId(e.target.value)} />

        <button type="submit" disabled={!enabled}>Query Land</button>
      </form>

      {message && <p>{message}</p>}
      {result && (
        <div style={{ marginTop: 12 }}>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>PDF Hash:</strong> {result.pdfHash}</p>
          <p><strong>Owner:</strong> {result.owner}</p>
          <p>
            <strong>View PDF:</strong>{' '}
            <a href={`https://gateway.pinata.cloud/ipfs/${result.pdfHash}`} target="_blank" rel="noreferrer">
              Open PDF on IPFS
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
