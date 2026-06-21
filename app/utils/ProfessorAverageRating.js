export const ProfessorAverageRating = (professor) => {
  if (!professor?.feedbacks || professor.feedbacks.length === 0) {
    return {
      averageRating: 0,
      numberOfRatings: 0,
    };
  }

  const ratings = professor.feedbacks.map((feedback) => feedback.rating);

  const averageRating =
    Math.floor(
      (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10,
    ) / 10;

  return {
    averageRating,
    numberOfRatings: ratings.length,
  };
};
