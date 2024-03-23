import React, { useEffect, useState } from 'react';
import { useTheme } from "./context/ThemeContext";
import { useTranslation } from 'react-i18next';
import Header from './Header';
import axios from 'axios';
import { useUser } from './context/UserContext';
import lock from '../logo/lock.svg';
import unlock from '../logo/unlock.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/IsloggedContext';

const host = 'http://localhost:3030';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const { setUserRole, userId } = useUser();
  const { setLogged } = useAuth();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [selected, setSelected] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showDeleteButton, setShowDelete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await axios.get(`${host}/admin`)
      const us = resp.data.users;
      setUsers((prev) => [...prev, ...us]);
    }
    fetchUsers();
  }, [])

  const deleteUser = async () => {
    const resp = await axios.post(`${host}/deleteUsers`, { selected });
    setUsers(resp.data.new)
    setSelected(null)
    if (Number(selected) === Number(userId)) {
      navigate('/')
    }
  }

  const handleSelect = (id) => {
    if (selected === id) {
      setSelected(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      setCheckboxChecked(!checkboxChecked);
      setSelected(Number(id));
      setShowDelete(true)
    }
  }

  const handleReset = (e) => {
    const isInsideTable = e.target.closest('table');
    const isInsideRow = e.target.closest('tr');
    const isInsideCell = e.target.closest('td') || e.target.closest('th');
    if (!isInsideCell || !isInsideRow || !isInsideTable) {
      setSelected(null);
      setCheckboxChecked(false);
      setShowDelete(false)
    }  
  }

  const handleMakeAdmin = async (id, status, userRole) => {
    const resp = await axios.post(`${host}/makeAdmin`, { id, status })
    const update = resp.data.update;
    setUserRole(userRole);
    setUsers(update);
    setSelected(null);
  }

  const handleBlock = async (selected, newStatus) => {
    if (newStatus === 'block') {
      try {
        const resp = await axios.post(`${host}/block`, { selected, newStatus })
        const updateUsers = resp.data.updateUsers;
        setUsers(updateUsers);
        if (Number(userId) === Number(selected)) {
          setLogged(false)
          navigate('/')
        }
      } catch (e) {
        console.log(e)
      }
    } else if (newStatus === 'unblock') {
      const resp = await axios.post(`${host}/block`, { selected, newStatus })
      const updateUsers = resp.data.updateUsers;
      setUsers(updateUsers)
    }
  }
  
  const handleUserPage = (e) => {
    const id = e.target.id;
    navigate('/user_page', { state: id})
  }
  return (
  <div>
    <Header showExit={true} app={true} path={'/collections'}></Header>
    <div
      className={`${darkMode ? 'dark-theme' : ''}`} 
      style={{padding: '20px 20px 0', minHeight: '100vh', paddingLeft: '0', paddingRight: '0' }} 
      onClick={(e) => handleReset(e)}>
    { showDeleteButton ? (
      <div className='d-flex justify-content-end container' style={{gap: '20px'}}>
        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={deleteUser} 
        >
          {t('admin.delete')}
        </button>

        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={() => handleMakeAdmin(selected, true, 'admin')}
        >
          {t('admin.makeAdmin')}
        </button>

        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={() => handleMakeAdmin(selected, false, 'user')}
        >
          {t('admin.makeUser')}
        </button>

        <button
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`}
          onClick={() => handleBlock(selected, 'block')}
        >
          <img className='logo-done-dark' src={lock} alt='lock'/>
        </button>

        <button
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`}
          onClick={() => handleBlock(selected, 'unblock')}
          type='button'
        >
          <img className='logo-done-dark' src={unlock} alt='unlock'/>
        </button>
        
      </div>
    ) : null}
    <div>
      <div className='container'>
        <h2 style={{paddingLeft: '30px', fontSize: '20px', marginBottom: '0'}}>
          {t('admin.users')}
        </h2>
      </div>
      <div className='d-flex justify-content-center container'>
      <table style={{width: '100%', marginTop: '20px', paddingLeft: '0', paddingRight: '0'}}>
        <thead>
          <tr>
            <th />
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.id')}</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.name')}</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.login')}</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.permissions')}</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>{t('admin.status')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleSelect(user.id)}>
              <td className={`${darkMode ? '' : 'light-theme'}`} style={{textAlign: 'end', width: '30px'}}>
                <input className={`checkbox ${darkMode ? 'select-dark' : ''}`} type="radio" checked={selected === user.id} onChange={() => handleSelect(user.id)}/>
                <label></label>
              </td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.id}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>
                <button 
                  id={user.id} 
                  className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                  type='button' 
                  onClick={(e) => handleUserPage(e)}>{user.name}</button>
              </td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.login}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.admin === 1 ? 'Admin' : 'User'}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  </div>
)
}
export default Admin;