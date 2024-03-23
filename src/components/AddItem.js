import React, { useEffect } from "react";
import Header from "./Header";
import { useTheme } from "./context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";
import { WithContext as ReactTags } from 'react-tag-input';
import options from "./tags";

const host = 'http://localhost:3030';

const AddItem = () => {
  const { darkMode } = useTheme();
  const { userRole, userId } = useUser();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [valueField, setValueField] = useState([]);

  const [id, setId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const idColl = location?.state?.id;
  const objFields = location?.state?.fields;
  const inputs = Object.values(objFields)

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const suggestions = options.map((option) => {
    return {
      id: option,
      text: option,
    };
  });

  useEffect(() => {
    setId(idColl)
  }, [idColl])

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleField = (event) => {
    const {name, value} = event.target;
    setValueField({...valueField, [name]: value})
  }

  const handleBack = () => {
    navigate('/mycollections')
  }

    const fetchFields = async () => {
      try {
        const resp = await axios.post(`${host}/addItem`, { nameItem: name, tag: tags, idC: id, valueField, userId});
        if (resp.data.message === 'ok') {
          navigate('/success')
        }
      } catch (e) {
        console.log(e)
      }
    }
    
  return (
    <div className="d-flex flex-column">
      <Header showExit={true} app={userRole === 'admin'} path={'/admin'}/>
      <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'dark-theme' : 'light-theme'}`} >
        <div
          className={`p-4 rounded shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'}`}
          style={{ width: "500px" }}
        >
          <h2 className="text-center mb-4 fs-5 mt-4 upper">
            {t('addItem.add')}
          </h2>
          <form className="p-4 pt-2">
            <div className="form-group mb-3">
              <label htmlFor="username" className="fw-bold mb-2">
              {t('addItem.name')}
              </label>
              <input
                type="text"
                className="form-control w-100 p-2"
                id="nameItem"
                value={name}
                onChange={handleName}
                autoFocus
                required
              />
              <label htmlFor="username" className="fw-bold mb-2 mt-2">
              {t('addItem.tags')}
              </label>
              <ReactTags
                suggestions={suggestions}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                inputFieldPosition="top"
                autocomplete
                tags={tags}
                placeholder=""
              />
              { inputs ? (
                inputs.map((el) => (
                  el == null ? null : (
                    <div key={el}>
                    <label htmlFor={el} className="fw-bold mb-2 mt-2">
                      {el}
                    </label>
                    <input
                      name={el}
                      type="text"
                      className="form-control w-100 p-2"
                      required
                      value={valueField[el] || ''}
                      onChange={handleField}
                    />
                  </div>)
                ))
              ) : null}   
            </div>
            <div className="d-flex justify-content-between mt-4 flex-row gap-2">
              <button
                type="button"
                className={`btn w-100 ${darkMode? 'button-dark' : 'btn-light'} `}
                onClick={fetchFields}
              >
                {t('page.add')}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className={`btn ${darkMode ? 'button-dark' : 'btn-light'}  w-100`}
              >
                {t('registration.back')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddItem;