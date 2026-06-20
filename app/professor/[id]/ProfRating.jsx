"use client";
import { Rating, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";

const ProfRating = ({ id }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${id}`
        );
        const data = await res.json();
        calculateAverageRating(data);
      } catch (error) {
        console.error("Failed to fetch professor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, [id]);

  const calculateAverageRating = (professor) => {
    if (!professor.feedbacks || professor.feedbacks.length === 0) {
      setAverageRating(null);
      setNumberOfRatings(0);
      return;
    }

    const ratings = professor.feedbacks.map((feedback) => feedback.rating);
    const avgRating =
      ratings.reduce((total, rating) => total + rating, 0) / ratings.length;

    setAverageRating(avgRating);
    setNumberOfRatings(ratings.length);
  };

  if (loading) {
    return (
      <>
        <Skeleton variant="text" width={120} height={30} />
        <Skeleton variant="text" width={80} height={20} />
      </>
    );
  }

  return (
    <>
      <Rating
        name="read-only"
        value={averageRating}
        precision={0.5}
        sx={{ display: "flex", fontSize: 16 }}
        readOnly
      />
      <small>({numberOfRatings} Ratings)</small>
    </>
  );
};

export default ProfRating;
