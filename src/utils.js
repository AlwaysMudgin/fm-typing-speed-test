import data from './data/data.json';

export function getTestArray(difficulty) {
  const maxIndex = data[difficulty].length - 1;
  const randomIndex = Math.floor(Math.random() * maxIndex);
  return data[difficulty][randomIndex].text.split('');
}

function accuracyAccumulator(total, current) {
  if (current) {
    total.correct++;
  } else {
    total.incorrect++;
  }
}

export function getAccuracyTotals(accuracyArray) {
  if (accuracyArray.length === 0)
    return { correct: 0, incorrect: 0, percentage: 0 };
  const results = accuracyArray.reduce(accuracyAccumulator, {
    correct: 0,
    incorrect: 0,
  });
  const percentage = Math.round(
    (results.correct / (results.correct + results.incorrect)) * 100
  );
  return { ...results, percentage };
}

export function formatTime(seconds) {
  if (seconds === 60) return '1:00';
  if (seconds < 10) return `0:0${seconds}`;
  return `0:${seconds}`;
}

export function getWpm(words, time) {
  if (time === 60) return 0;
  return Math.round((words * 60) / (60 - time));
}
