export const ProfessorAverageRating = (feedbacks) => {
  if (!feedbacks || feedbacks.length === 0) {
    return {
      averageRating: 0,
      numberOfRatings: 0,
    };
  }

  const ratings = feedbacks.map((feedback) => feedback.rating);

  const averageRating =
    Math.floor(
      (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10,
    ) / 10;

  return {
    averageRating,
    numberOfRatings: ratings.length,
  };
};
