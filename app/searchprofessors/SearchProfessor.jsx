"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingScreen from "../components/LoadingScreen";
import ProfessorList from "../components/ProfessorList/ProfessorList";

const SearchProfessor = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [professors, setProfessors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    if (search) {
      fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/search/${search}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Introduce a delay of 2 seconds
          timer = setTimeout(() => {
            setProfessors(data);
            console.log(data);
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }

    return () => clearTimeout(timer); // Clear the timer on unmount or re-render
  }, [search]);

  return (
    <div className="container">
      <div className="sub-container">
        <h2 style={{ textAlign: "center" }}>Search Results</h2>
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="professors" style={{ textAlign: "center" }}>
            {professors && professors.length > 0 ? (
              <Suspense fallback={<LoadingScreen />}>
                <ProfessorList props={professors} />
              </Suspense>
            ) : (
              <div >
                <br />
                <p>No professor with name "{search}"</p>
              </div>
            )}

            <br />
            <hr />
            <br />
            <Link href="/addprofessor">
              Didn't Find Your Professor? <br /> Add Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfessor;
