import React, { createContext, useState } from "react";

export const EscalationsContext = createContext();

export const EscalationsProvider = ({ children }) => {
  const [filteredEscalations, setFilteredEscalations] = useState([]);

  return (
    <EscalationsContext.Provider
      value={{ filteredEscalations, setFilteredEscalations }}
    >
      {children}
    </EscalationsContext.Provider>
  );
};
