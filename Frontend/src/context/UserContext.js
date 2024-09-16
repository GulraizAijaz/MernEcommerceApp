import React, { createContext, useState } from 'react';

const UserContext = createContext(); 

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('guest');
  const changeName = (v)=>{
    setUsername(v)
  }
  return (
    <UserContext.Provider value={{ username, setUsername,changeName }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };