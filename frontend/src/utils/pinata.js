export async function uploadFileToPinata(file) {
  const pinataJwt = import.meta.env.VITE_PINATA_JWT;
  if (!pinataJwt) {
    throw new Error('Pinata JWT is required in .env as VITE_PINATA_JWT');
  }

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed: ${errorText}`);
  }

  const data = await response.json();
  return data.IpfsHash;
}
