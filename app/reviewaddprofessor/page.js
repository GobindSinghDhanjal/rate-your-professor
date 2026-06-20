"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import styles from "./styles.module.css";

const Page = () => {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [professors, setProfessors] = useState([]);

  // Remove the professor whose id matches — called by ProfileCard on successful add OR remove
  const handleClick = (data) => {
    setProfessors((prev) => prev.filter((p) => p._id !== data.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === process.env.NEXT_PUBLIC_PASSCODE) {
      setAuthenticated(true);
    } else {
      alert("Incorrect passcode. Please try again.");
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/tempProfessor/all`,
      )
        .then((res) => res.json())
        .then((data) => setProfessors(data))
        .catch((err) => console.error("Error fetching professors:", err));
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <Box padding={5} mt={10} mb={5} boxShadow={3} borderRadius={8}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Enter Passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to the secret page!</h1>
      {professors.map((professor) => (
        <ProfileCard
          key={professor._id}
          handleClick={handleClick}
          profile={{
            id: professor._id,
            name: professor.name,
            title: professor.title,
            gender: professor.gender,
            college: professor.college,
            university: professor.university,
            department: professor.department,
            subjects: professor.subjects,
            universityImageUrl: professor.universityImageUrl || "",
          }}
        />
      ))}
    </div>
  );
};

export default Page;
