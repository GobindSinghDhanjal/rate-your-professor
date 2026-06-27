export function updateProfessorStats(professor) {
  if (!professor) return;

  const reviews = professor.feedbacks ?? [];

  const reviewCount = reviews.length;
  professor.reviewCount = reviewCount;

  if (reviewCount === 0) {
    professor.averageRating = 0;
    professor.averageClarity = 0;
    professor.averageHelpfulness = 0;
    professor.averageFairness = 0;
    return;
  }

  const average = (field) =>
    Number(
      (
        reviews.reduce((sum, review) => {
          const value = Number(review?.[field]);
          return sum + (Number.isFinite(value) ? value : 0);
        }, 0) / reviewCount
      ).toFixed(1),
    );

  professor.averageRating = average("rating");
  professor.averageClarity = average("clarity");
  professor.averageHelpfulness = average("helpfulness");
  professor.averageFairness = average("fairness");
}
