export function generatePlan(topics) {
  const sorted = [...topics].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return sorted.map((topic, index) => ({
    ...topic,
    day: index + 1,
  }));
}