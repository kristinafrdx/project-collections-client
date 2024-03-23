import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from './context/ThemeContext';
import Header from "./Header";
import { useTranslation } from 'react-i18next';
import { useAuth } from "./context/IsloggedContext";
import { useUser } from "./context/UserContext";

const host = 'http://localhost:3030';

const Registration = () => {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const { setLogged } = useAuth();
  const { setUserRole, setUserId } = useUser();

  const [name, setName] = useState("");
  const [login, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataUser = {
      name,
      login,
      password,
    };
    const resp = await axios.post(`${host}/registration`, dataUser);
    if (resp.data.message === 'exist') {
      setError(true)
      setEmail("");
      setPassword("");
    } else {
      setLogged(true);
      setUserRole('user');
      setUserId(resp.data.id);
      navigate('/collections');
    }
  };
  
  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleMail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="d-flex flex-column">
      <Header />
      <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'dark-theme' : 'light-theme'}`} >
        <div
          className={`login-container p-4 rounded shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'}`}
          style={{ width: "500px", height: "500px" }}
        >
          <h2 className="text-center mb-4 fs-5 mt-5 upper">{t('registration.signUp')}</h2>
          <form className="p-4 pt-2" onSubmit={handleSubmit} name="registrationForm">
            <div className="form-group mb-3">
              <label htmlFor="username" className="fw-bold mb-2">
                {t('registration.name')}
              </label>
              <input
                type="text"
                className="form-control w-100 p-2"
                id="username"
                placeholder="Kristina"
                value={name}
                onChange={handleName}
                autoFocus
                required
              />
              <label htmlFor="username" className="fw-bold mb-2 mt-2">
                {t('registration.email')}
              </label>
              <input
                type="text"
                className="form-control w-100 p-2"
                id="email"
                placeholder="siginur@mail.ru"
                value={login}
                onChange={handleMail}
                required
              />
              <label htmlFor="password" className="fw-bold mb-2 mt-2">
                {t('registration.password')}
              </label>
              <input
                type="password"
                className="form-control w-100 p-2"
                id="password"
                placeholder="qwerty12345"
                value={password}
                onChange={handlePassword}
                required
              />
            </div>
            {err && (
              <p className="text-danger">
                {t('registration.errorAlreadyExist')}
              </p>
            )}
            <div className="d-flex justify-content-between mt-4 flex-row gap-2">
              <button
                type="submit"
                className={`btn w-100 ${darkMode? 'button-dark' : 'btn-light'} `}
              >
                {t('registration.signUp')}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className={`btn ${darkMode ? 'button-dark' : 'btn-light'}  w-100`}
              >
                {t('registration.back')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;