import React, { useState, useCallback } from "react";

export const APINotifContext = React.createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export default function APINotifProvider({ children }) {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const removeError = () => setError(null);

  const addError = (title, message, stat) => setError({ title, message, stat });

  const setIsLoading = (loading) => setLoading(loading);

  const contextValue = {
    error,
    addError: useCallback(
      (title, message, stat) => addError(title, message, stat),
      []
    ),
    removeError: useCallback(() => removeError(), []),
    isLoading,
    setIsLoading: useCallback((loading) => setIsLoading(loading), []),
  };

  return (
    <APINotifContext.Provider value={contextValue}>
      {children}
    </APINotifContext.Provider>
  );
}
