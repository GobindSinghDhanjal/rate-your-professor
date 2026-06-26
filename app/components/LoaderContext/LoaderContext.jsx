"use client";

import { createContext, useContext, useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

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
      {loadingScreen && <LoadingScreen />}
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
