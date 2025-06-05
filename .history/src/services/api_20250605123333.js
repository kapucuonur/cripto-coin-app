export const getCoins = async () => {
  const URL = 'https://api.coinranking.com/v2/coins';
  
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  
  const data = await res.json();
  return data.data.coins;
};