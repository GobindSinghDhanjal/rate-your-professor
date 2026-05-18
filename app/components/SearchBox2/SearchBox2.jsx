"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBox2.module.css";

const SearchBox2 = ({ page = "", university = {} }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    router.push(`/searchprofessors?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchBox}
        type="text"
        placeholder="Search professors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBox2;
