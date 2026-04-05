import { useState } from 'react';

export default function TransferLand({ contract, enabled }) {
  const [landId, setLandId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!enabled) return;

    try {
      setMessage('Sending transfer transaction...');
      const tx = await contract.transferLand(BigInt(landId), recipient);
      await tx.wait();
      setMessage(`Land ${landId} transferred to ${recipient}`);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Transfer failed');
    }
  };

  return (
    <section className="panel">
      <h2>Transfer Land</h2>
      <form onSubmit={handleSubmit}>
        <label>Land ID</label>
        <input type="number" value={landId} onChange={(e) => setLandId(e.target.value)} />

        <label>Recipient Address</label>
        <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />

        <button type="submit" disabled={!enabled}>Transfer Land</button>
      </form>
      <p>{message}</p>
    </section>
  );
}
