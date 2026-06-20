"use client";

import { createContext, useContext, useState } from "react";
import Loader from "../Loader/Loader";
import styles from "./LoaderContext.module.css";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loadingScreen, setLoadingScreen] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        loadingScreen,
        setLoadingScreen,
      }}
    >
      {loadingScreen && (
        <div className={styles.loadingScreen}>
          <Loader />
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
