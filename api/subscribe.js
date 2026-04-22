export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });
 
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        attributes: { PRENOM: name },
        listIds: [2],
        updateEnabled: true
      })
    });
 
    if (response.ok || response.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      const err = await response.json();
      return res.status(400).json({ error: err.message });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
