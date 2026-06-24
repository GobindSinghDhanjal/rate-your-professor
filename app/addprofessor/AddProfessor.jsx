"use client";
import React, { useState } from "react";
import SuccessPage from "./SuccessPage";
import FailedPage from "./FailedPage";
import styles from "./AddProfessor.module.css";
import { motion } from "framer-motion";
import { useLoader } from "../components/LoaderContext/LoaderContext";

const AddProfessor = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const { setLoadingScreen } = useLoader();

  const [professorData, setProfessorData] = useState({
    name: "",
    title: "Assistant Professor",
    gender: "Female",
    college: "",
    university: "",
    department: "",
    subjects: "",
    image: null,
  });

  const genderOptions = ["Male", "Female"];
  const titleOptions = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Ph.D. Scholar",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfessorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingScreen(true);
    professorData.image = null;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/tempProfessor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(professorData),
        },
      );

      if (response.ok) {
        setLoadingScreen(false);
        setSuccess(true);
      } else {
        setLoadingScreen(false);
        setFail(true);
      }
    } catch (error) {
      setLoadingScreen(false);
      setFail(true);
      console.error("Error sending professor data:", error);
    }
  };

  if (success) {
    return <SuccessPage />;
  }

  if (fail) {
    return <FailedPage />;
  }

  return (
    <>
      <section className={`${styles.searchHero} sub-container page-top`}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Add Professor
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Can't find your professor? Submit a request and we'll verify and add
            them within 24 hours. Stay updated on the progress through your
            notifications.
          </motion.p>
        </div>
      </section>
      <form
        className={`${styles.formWrapper} sub-container`}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.fieldLabel}>
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={professorData.name}
            onChange={handleChange}
            required
            className={styles.textInput}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.fieldLabel}>
              Title
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="title"
                name="title"
                value={professorData.title}
                onChange={handleChange}
                required
                className={styles.selectInput}
              >
                {titleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender" className={styles.fieldLabel}>
              Gender
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="gender"
                name="gender"
                value={professorData.gender}
                onChange={handleChange}
                required
                className={styles.selectInput}
              >
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="college" className={styles.fieldLabel}>
            College
          </label>
          <input
            id="college"
            type="text"
            name="college"
            value={professorData.college}
            onChange={handleChange}
            required
            className={styles.textInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="university" className={styles.fieldLabel}>
            University
          </label>

          <textarea
            id="university"
            type="text"
            name="university"
            value={professorData.university}
            required
            onChange={(e) => {
              handleChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            className={styles.textArea}
          />

          {/* <input
            id="university"
            type="text"
            name="university"
            value={professorData.university}
            onChange={handleChange}
            required
            className={styles.textInput}
          /> */}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="department" className={styles.fieldLabel}>
            Department
          </label>
          <input
            id="department"
            type="text"
            name="department"
            value={professorData.department}
            onChange={handleChange}
            className={styles.textInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subjects" className={styles.fieldLabel}>
            Subjects (Comma separated)
          </label>
          <input
            id="subjects"
            type="text"
            name="subjects"
            value={professorData.subjects}
            onChange={handleChange}
            className={styles.textInput}
          />
          <p className={styles.helperText}>
            Enter multiple subjects separated by commas.
          </p>
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Professor
        </button>
      </form>
    </>
  );
};

export default AddProfessor;
