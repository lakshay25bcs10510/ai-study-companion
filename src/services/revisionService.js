export function generateRevisions(topicId, startDate) {
  const intervals = [2, 5, 10];

  return intervals.map(days => ({
    topicId,
    date: new Date(Date.now() + days * 86400000),
    type: "revision",
    completed: false
  }));
}