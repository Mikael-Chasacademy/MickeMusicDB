export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.deezer.com/chart/0/tracks?limit=50');
    if (!response.ok) {
      throw new Error('Kunde inte hämta topplåtar från Deezer');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fel vid hämtning av topplåtar:', error);
    res.status(500).json({ error: 'Kunde inte hämta topplåtar från Deezer' });
  }
} 