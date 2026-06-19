"use client";
import React from "react";
import { Avatar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

const UniversityList = ({ universities }) => {
  const router = useRouter();

  function onButtonClick(slug) {
    router.push(`/university/${slug}`);
  }

  return (
    <div className={styles.container}>
      {universities.map((university, index) => (
        <div
          className={styles.universityCard}
          key={index}
          onClick={() => {
            onButtonClick(university.slug);
          }}
        >
          <Avatar
            alt={university.name}
            src={university.image}
            sx={{ width: 80, height: 80, margin: "auto", marginTop: 4 }}
          />
          <br />
          <Typography variant="subtitle2" align="center" gutterBottom>
            {university.name}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default UniversityList;
