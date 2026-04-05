import { useState } from 'react';
import { uploadFileToPinata } from '../utils/pinata';

export default function RegisterLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [name, setName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!enabled) return;
    if (!pdfFile) {
      setMessage('Choose a PDF file first.');
      return;
    }

    try {
      setMessage('Uploading PDF to Pinata...');
      const ipfsHash = await uploadFileToPinata(pdfFile);
      setMessage(`Pinata hash received: ${ipfsHash}`);

      const tx = await contract.registerLand(BigInt(landId), name, ipfsHash);
      setMessage('Waiting for blockchain confirmation...');
      await tx.wait();
      setMessage(`Land ${landId} registered successfully!`);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Registration failed');
    }
  };

  return (
    <section className="panel">
      <h2>Register Land</h2>
      <form onSubmit={handleSubmit}>
        <label>Land ID</label>
        <input type="number" value={landId} onChange={(e) => setLandId(e.target.value)} min="1" />

        <label>Land Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Land PDF</label>
        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />

        <button type="submit" disabled={!enabled}>
          Register Land
        </button>
      </form>
      <p>{message}</p>
    </section>
  );
}
