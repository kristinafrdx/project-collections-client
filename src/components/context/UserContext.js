import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedId = sessionStorage.getItem('userId');
    const savedRole = sessionStorage.getItem('userRole');
    if (savedId) {
      setUserId(savedId);
      setUserRole(savedRole);
    }
    setIsInit(true);
  }, []);

  useEffect(() => {
    if (isInit) {
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userRole', userRole)
    }
  }, [userId, isInit, userRole]
  );

  return (
    <UserContext.Provider value={{ userId, setUserId, userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [isLogged, setLogged] = useState(false);
//   return (
//     <UserProvider.Provider value={{ isLogged, setLogged}}>
//       {children}
//     </UserProvider.Provider>
//   );
// };

// export const useUserLog = () => {
//   return useContext(UserContext);
// };



// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userId, setUserId] = useState(null);
//   // const [isLogged, setLogged] = useState(false);
//   const [userRole, setUserRole] = useState(null); // Добавлено инициализация userRole

//   useEffect(() => {
//     const savedId = sessionStorage.getItem('userId', userId);
//     const savedRole = sessionStorage.getItem('userRole', userRole);
//     // const savedLog = sessionStorage.getItem('isLogged', isLogged)
//     if (savedId && savedRole) {
//       setUserId(savedId);
//       setUserRole(savedRole);
//       // setLogged(savedLog === 'true')
//     }
//   }, []);

//   useEffect(() => {
//       sessionStorage.setItem('userId', userId);
//       sessionStorage.setItem('userRole', userRole);
//       // sessionStorage.setItem('isLogged', isLogged) // Сохраняем userRole в sessionStorage
//   }, [userId, userRole]);

//   return (
//     <UserContext.Provider value={{ userId, setUserId, userRole, setUserRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   return context;
// };

