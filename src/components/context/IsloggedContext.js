import React, { createContext, useState, useContext, useEffect } from 'react';

const Logged = createContext();

export const IsLoggedProvider = ({ children }) => {
  const [isLogged, setLogged] = useState(() => {
    const logged = localStorage.getItem('isLogged');
    return logged ? JSON.parse(logged) : false;
  });

  useEffect(() => {
    localStorage.setItem('isLogged', JSON.stringify(isLogged));
  }, [isLogged]);
 
  return (
    <Logged.Provider value={{ isLogged, setLogged }}>
      {children}
    </Logged.Provider>
  );
};

export const useAuth = () => {
  return useContext(Logged);
};

