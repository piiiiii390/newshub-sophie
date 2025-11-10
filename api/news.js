export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; // simpan di environment variable Vercel
  const { category = 'general', q } = req.query;

  let url = '';
  if (q) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
}
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; // simpan di environment variable Vercel
  const { category = 'general', q } = req.query;

  let url = '';
  if (q) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
}