import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header'
import { useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';

const host = 'http://localhost:3030';

const UserPage = () => {
  const [collections, setCollections] = useState([]);
  const [data, setData] = useState([]);
  const { darkMode } = useTheme();
  const locations = useLocation();
  const { t } = useTranslation();
  const id = locations?.state

  useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const resp = await axios.post(`${host}/userPage`, { id });
        setData(resp.data.dataUser);
        setCollections(resp.data.collections);
      } catch (e) {
        console.log(e)
      }
    }
    fetchUser(id)
  })

  return (
    <div>
      <Header showExit={true} app={true} path={'/admin'}/>
      <div className={`vh-100 p-4 ${darkMode ? 'dark-theme' : ''}`}>
      { data ? (
        data.map((el) => (
          <div className='d-flex justify-content-between flex-wrap' key={el.id}>
            <div>
              <h2 style={{fontSize: '20px'}}>{t('userPage.collOfUser')}{id}:</h2>
            </div>
            <div className='d-flex' style={{gap: '15px'}}>
              <h3 style={{fontSize: '20px'}}>{t('admin.id')}: {el.id}</h3>
              <h3 style={{fontSize: '20px'}}>{t('admin.name')}: {el.name}</h3>
              <h3 style={{fontSize: '20px'}}>{t('admin.login')}: {el.login}</h3>
              <h3 style={{fontSize: '20px'}}>{t('userPage.password')}: {el.password}</h3>
            </div>
          </div>
        ))
      ) : null}
      { collections.length > 0 ? (
        <div>
         <div className='d-flex justify-content-center container'>
          <table style={{width: '100%', marginTop: '20px', paddingLeft: '0', paddingRight: '0'}}>
            <thead>
              <tr>
                <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>№</th>
                <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.id')}</th>
                <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.name')}</th>
                <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('userPage.category')}</th>
                <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('userPage.likes')}</th>
              </tr>
            </thead>
            <tbody>
        { collections.map((coll, index) => (
              <tr key={coll.id}>
                <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{index +1}</td>
                <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{coll.id}</td>
                <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{coll.name}</td>
                <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{coll.topic ? (coll.topic) : '-'}</td>
                <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{coll.likes ? (coll.likes) : '0'}</td>
              </tr>
        ))}
          </tbody>
          </table>
        </div>
        </div>
      ) : (
        <h5>{t('userPage.notFound')}</h5>
      )}
      </div>
    </div>
  )
};
export default UserPage;