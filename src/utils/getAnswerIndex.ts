/**
 * The Wordle of the day is calculated by counting the number of days
 * since May 5 2021. The resulting index is used to get the word from
 * an array of answers.
 *
 * @returns {number} index of today's wordle solution
 */
export const getAnswerIndex = () => {
  const startTime = (new Date(2021, 5, 19, 0, 0, 0, 0)).getTime();
  const now = Date.now();
  const difference = now - startTime;
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);
  return days;
};
