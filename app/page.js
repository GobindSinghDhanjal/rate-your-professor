"use client";
import React, { useEffect, useState } from "react";
import Banner from "./components/Banner/Banner";
import { Divider } from "@mui/material";
import SearchBox from "./components/SearchBox/SearchBox";
import TopUniversities from "./components/TopUniversities/TopUniversities";
import TopRatedProfessors from "./components/TopRatedProfessors/TopRatedProfessors";
import MostRatedProfessors from "./components/MostRatedProfessors/MostRatedProfessors";

export default function Home() {
  const [professors, setProfessors] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [mostRatedProfessors, setMostRatedProfessors] = useState([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/prof/topThree`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch professors");
        }
        const data = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities/top`,
          {
            next: { revalidate: 2592000 }, // revalidate every 30 days (in seconds)
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch universities");
        }
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchMostRatedProfessors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/mostRated`,
          { cache: "no-cache" }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch universities");
        }
        const data = await response.json();
        setMostRatedProfessors(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUniversities();
    fetchProfessors();
    fetchMostRatedProfessors();
  }, []);

  return (
    <div>
      <Banner />
      <div className="sub-container">
        <SearchBox />

        <div className="divider-p">
          <Divider className="divider" />
        </div>

        <h3>Top Universities</h3>
        <TopUniversities props={universities} />
        <br />
        <div className="divider-p">
          <Divider className="divider" />
        </div>

        <h3>Top Rated Professors</h3>
        <TopRatedProfessors props={professors} />

        <br />
        <div className="divider-p">
          <Divider className="divider" />
        </div>

        <h3>Most Rated Professors</h3>
        <MostRatedProfessors props={mostRatedProfessors} />
      </div>
    </div>
  );
}
