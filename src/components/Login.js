import axios from "axios";
import React, { useState } from "react";
import { useTheme } from './context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "./Header";
import { useUser } from "./context/UserContext";
import { useAuth } from "./context/IsloggedContext";

const host = 'http://localhost:3030';

const Login = () => {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const { setUserId, setUserRole } = useUser();
  const { setLogged } = useAuth();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState(false);
  const [errBlock, setErrorBlock] = useState(false);

  const navigate = useNavigate();

  const fetchUser = async (data) => {
    try {
      const resp = await axios.post(`${host}/login`, data)
      if (resp.data.message === "data is't correct") {
       setError(true);
       setErrorBlock(false)
      } else if (resp.data.message === 'blocked') {
        setErrorBlock(true)
        setError(false)
      } else {
        const isAdmin = resp.data.isAdmin;
        const id = resp.data.userId;
        setUserId(id);
        setLogged(true);
        if (isAdmin) {
          setUserRole('admin');
        } else {
          setUserRole('user');
        }
        navigate('/collections');
      }
    } catch (e) {
      console.error(`Network error: ${e}`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      login,
      password,
    }
    await fetchUser(data);
  }

  const handleLogin = (event) => {
    setLogin(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleCreate = () => {
    navigate('/registration')
  }

  const handleGuest = () => {
    setUserRole('guest');
    setLogged(false);
    setUserId(null);
    navigate('/collections');
  }

  return (
    <div className="d-flex flex-column">
      <Header />
      <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'dark-theme' : 'light-theme'}`}> 
        <div className={`login-container p-4 shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'}`}>
          <h2 className="text-center mb-4 fs-5 mt-5 upper">
            {t('login.login')}
          </h2>
          <form className="p-4 pt-2" onSubmit={handleSubmit} >
            <div className="form-group mb-2">
              <label htmlFor="username" className="fw-bold mb-2">
                {t('login.enterLogin')}
              </label>
              <input type="text" className={`form-control w-100 pt-2 ${darkMode ? 'input-dark' : 'light-theme'}`} autoFocus id="username" placeholder="siginur@mail.ru" value={login} onChange={handleLogin} required />
              <label htmlFor="password" className="fw-bold mb-2 mt-2">
                {t('login.enterPassword')}
              </label>
              <input type="password" className={`form-control w-100 pt-2 ${darkMode ? 'input-dark' : 'light-theme'}`} id="password" placeholder="qwerty12345" value={password} onChange={handlePassword} required/>
            </div>
            {err && (
              <p className="text-danger mb-0">
              {t('login.errorIncorrect')}
              </p>)}
            {errBlock && (
              <p className="text-danger mb-0">
                {t('login.block')}
              </p>
            )}
            <div className="d-flex justify-content-between mt-4 flex-row gap-2">
              <button type="submit" className={`btn w-100 ${darkMode ? 'button-dark' : 'btn-light'}`}>
                {t('login.signIn')}
              </button> 
              <button type="button" onClick={handleGuest} className={`btn w-100 ${darkMode ? 'button-dark' : 'btn-light'}`}>{
                t('login.guest')}
              </button>
            </div>
            <div className="d-flex align-items-center mt-4 flex-column">
              <h5 className="account">
                {t('login.haveNotAccount')}
              </h5>
              <button type="button" onClick={handleCreate} className={`linkButton ${darkMode ? 'create-dark' : 'create-light'}`} value="create">
                {t('login.createAccount')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;