import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useTheme } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./context/UserContext";
import { useTranslation} from "react-i18next";

const host = 'http://localhost:3030';

const MyCollections = () => {
  const { darkMode } = useTheme();
  const { userId, userRole } = useUser();

  const navigate = useNavigate();
  const [myColl, setMyColl] = useState([]);
  const { t } = useTranslation();
  const [selectedColl, setSelectedColl] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showDeleteButton, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const resp = await axios.post(`${host}/mycollections`, { userId });
        const likes = resp.data.getMy.likes
        setMyColl(resp.data.getMy);
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false);
      }
    }
    getCollections();
  }, [userId])
 
  const handleCard = (id) => {
    if (selectedColl === id) {
      setSelectedColl(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      setCheckboxChecked(!checkboxChecked);
      setSelectedColl(Number(id));
      setShowDelete(true)
    }
  }

  const handleReset = (e) => {
    const elem = e.target.closest('.card');
    if (!elem && e.target.tagName !== 'BUTTON') {
      setSelectedColl(null)
      setShowDelete(false)
    } 
  }
 
  const deleteColl = async (id) => {
    const resp = await axios.post(`${host}/deleteColl`, { id })
    setMyColl(resp.data.updateColl)
    setShowDelete(false);
  }

  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showExit={true} app={userRole === 'admin'} path={'/admin'}/>
      <div 
        className={`wrap ${myColl.length < 1 ? 'coll-height' : ''} ${darkMode ? 'dark-theme' : '' }`} 
        onClick={(e) => handleReset(e)}
      >
        <div className='link'>
          <button 
            type="button" 
            className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
            onClick={() => navigate('/createColl')}
          >
            {t("collections.create")}
          </button>
          <button 
            type="button" 
            className={`linkButton pb-2 ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
            onClick={() => navigate('/collections')}
          >
            {t("registration.back")}
          </button>
          {showDeleteButton ? (
            <button 
              type='button' 
              className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
              onClick={(e) => deleteColl(selectedColl)}
            >
              {t("collections.delete")}
            </button>
          ) : null}
        </div>
        <div className={`coll`}>
          {loading ? null : (
            myColl.length > 0 ? (
              myColl.map((el) => (
                <div key={el.id}>
                <div 
                  className={`card shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} 
                  onClick={() => handleCard(el.id)}
                >
                  {el.linkToImage ? (
                    <img style={{ width: '200px', height: '200px' }} src={ el.linkToImage } alt='imageColl' />
                  ) : null} 
                  <div 
                    className='d-flex justify-content-end' 
                    style={{ width: '100%', padding: '10px', position: 'absolute' }}>
                    <label htmlFor={el.id}></label>
                    <input 
                      className={'checkbox'} 
                      id={el.id} type="radio" 
                      checked={selectedColl === el.id} 
                      onChange={() => handleCard(el.id)}
                    />
                  </div>
                </div>
                <ul className='text-coll'>
                  <li 
                    className={`nameColl ${darkMode ? 'li-dark' : 'li-light'}}`} 
                    onClick={() => navigate('/page', { state: { id: el.id }})}
                  >
                    {el.name}
                  </li>
                </ul>
              </div>
              ))
            ) : (
            <div>
              <h5 className={`${darkMode ? 'empty-coll-dark' : 'empty-coll-light'}`}>{t('collections.empty')}</h5>
              <button 
                type='button' 
                className={`linkButton text-underline ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                onClick={(e) => navigate('/createColl')}
              >
                {t("collections.create")}
              </button>
            </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCollections;
