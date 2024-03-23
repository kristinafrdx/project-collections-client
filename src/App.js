import React from "react";
import Login from "./components/Login";
import Collections from "./components/Collections";
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import MyCollections from "./components/MyCollections";
import CreateColl from './components/CreateColl'
import PageCollection from "./components/PageCollection";
import SuccessColl from "./components/SuccessColl";
import { useAuth } from "./components/context/IsloggedContext";
import AddItem from "./components/AddItem";
import Admin from "./components/Admin";
import UserPage from "./components/UserPage";
import { useUser } from "./components/context/UserContext";
import AllColl from "./components/AllColl";

function App() {
  const { isLogged } = useAuth();
  const { userRole } = useUser();
  
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/myCollections" element={isLogged ? <MyCollections /> : <Navigate to={"/"} />} />
            <Route path="/createColl" element={isLogged ? <CreateColl /> : <Navigate to='/'/>} />
            <Route path="/page" element={<PageCollection /> }/>
            <Route path="/success" element={isLogged ? <SuccessColl /> : <Navigate to='/'/>} />
            <Route path="/addItem" element={isLogged ? <AddItem /> : <Navigate to='/registration' />}/>
            <Route path="/admin" element={userRole === 'admin' ? <Admin /> : <Navigate to='/collections' />} />
            <Route path="/user_page" element={userRole === 'admin' ? <UserPage /> : <Navigate to='/collections' />} />
            <Route path="/allColl" element={<AllColl />} />
          </Routes>
        </Router>
    </div>
  );
}
// export const useAuth = () => useContext(AuthContext);

export default App;
