import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from './context/ThemeContext';
import done from '../logo/done.svg'
import { useNavigate } from "react-router-dom";
import Header from "./Header";


const SuccessColl = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  })
  
  return (
    <div>
    <Header showExit={true} />
    <div>
      <div className={` ${darkMode ? 'dark-theme' : 'light-theme' } d-flex align-items-center flex-column pt-3`} style={{height: '100vh'}}>
        <div className="d-flex align-items-center justify-content-center">
          <img alt="done" src={done} className={`${darkMode ? 'logo-done-dark' : ''}`}></img>
          <h3 style={{margin: '0'}}>
            {t("create.success")}
          </h3>
        </div>
        <button type="button" className={`btn text-underline ${darkMode ? 'linkButton-dark' : 'linkButton-light'} mt-2`} onClick={() => navigate('/mycollections')}>
          {t("create.seeMy")}
        </button>
      </div>
    </div>
    </div>
  )
}

export default SuccessColl;