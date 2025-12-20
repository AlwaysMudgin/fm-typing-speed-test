import data from './data/data.json';

export function getTestArray(difficulty) {
  const maxIndex = data[difficulty].length - 1;
  const randomIndex = Math.floor(Math.random() * maxIndex);
  return data[difficulty][randomIndex].text.split('');
}
