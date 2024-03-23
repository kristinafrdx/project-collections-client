import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTheme } from './context/ThemeContext';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { useUser } from '../components/context/UserContext';
import likeLogo from '../logo/like.svg';
import likeFill from '../logo/likeFill.svg';

const host = 'http://localhost:3030';

const AllColl = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { userRole, userId } = useUser();

  const [collections, setCollections] = useState([]);
  const [admin] = useState(false);
  
  const [, setSelectedColl] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [likesSt, setLikes] = useState([]);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const resp = await axios.get(`${host}/collections`);
        const allColl = resp.data.collections;
        const likes = resp.data.likes;
        const likeIdCurrentUser = likes.filter((el) => Number(el.idUser) === Number(userId));
        const idC = likeIdCurrentUser.map((el) => el.idCollection);
        setLikes([...likesSt, ...idC]);
        setCollections(allColl);
      } catch (e) {
        console.error(e)
      }
    }
    getCollections();
  }, [])

  const navigate = useNavigate();

  const handleLike = (e, idUser, idColl) => {
    const fetchLikes = async (like) => {
      try {
        const resp = await axios.post(`${host}/like`, { idU: idUser, idC: idColl, like })
        const newColl = resp.data.updateColl;
        setCollections(newColl)
      } catch (e) {
        console.log(e)
      }
    }
    e.stopPropagation()
    if (likesSt.includes(idColl)) {
    setLikes(likesSt.filter(item => item !== idColl))
    fetchLikes(false)
  } else {
    setLikes([...likesSt, idColl]);
    fetchLikes(true);
  }
  }

  const handleCard = (e, id) => {
    if (admin) {
      setCheckboxChecked(!checkboxChecked);
      setSelectedColl(Number(id));
    }
  }

  return (
    <div>
      <Header showExit={true} app={userRole === 'admin'} path={'/admin'}/>
      <div className={`${darkMode ? 'dark-theme' : '' } pb-5`} style={{minHeight: '100vh', height: 'fit-content'}}>
        <div className='d-flex justify-content-between coll' style={{marginRight: '50px', marginLeft: '50px', paddingTop: '30px', paddingBottom: '20px'}}>
          <h5 className='m-0'>
            {t('collections.all')}:
          </h5>
          <button 
            className={`linkButton`} 
            onClick={() => navigate('/collections')}
            style={{fontSize: '1.25rem'}}
          >
            {t('registration.back')}
          </button>
        </div>
      
      <div className="coll pt-0">
        { collections && collections.length > 0 ? (
          collections.map((el) => (
            <div key={el.id}>
              <div 
                className={`card align-items-start shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} 
                style={{width: '200px', height: '200px'}} 
                id={el.id} 
                onClick={(e) => handleCard(e, el.id)}
              >
                {el.linkToImage ? (<img style={{width: '200px', height: '200px'}} src={el.linkToImage} alt=''></img>) : null} 
                <div 
                  className='d-flex justify-content-end' 
                  style={{width: '100%', padding: '10px', position:'absolute', height: '100%'}} 
                >
                </div>
              </div>
                <ul className='d-flex justify-content-between' id={el.id}>
                  <li className='nameColl' onClick={() => navigate('/page', { state: { id: el.id }})}>{el.name}</li>
                  <li>{ userRole !== 'guest' ? (
                    <div className='containerLikes d-flex align-items-baseline'>
                      <button className='linkButton d-flex' type="button" onClick={(e) => handleLike(e, userId, el.id)}>
                        {likesSt.includes(el.id) ? (
                          <div>
                            <img id={el.id} src={likeFill} alt='likefill' className={`${darkMode ? 'logo-done-dark': ''}`}/>
                          </div>
                          ) : (
                          <div>
                            <img id={el.id} src={likeLogo} alt='like' className={`${darkMode ? 'logo-done-dark': ''}`} ></img> 
                          </div>
                          )}
                      </button>
                      <h5 style={{fontSize: '12px'}}>
                        {el.likes}
                      </h5>
                    </div>
                  ) : null}</li>
                </ul>
            </div>
          ))
        ) : null }
      </div>
      </div>
    </div>
  )
}

export default AllColl;