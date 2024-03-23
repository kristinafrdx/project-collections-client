import React from "react";
import { useState } from "react";
import { useTheme } from './context/ThemeContext';
import Header from "./Header";
import { useTranslation } from 'react-i18next';
import remove from "../logo/remove.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import axios from "axios";
import SuccessColl from '../components/SuccessColl';
import Select from 'react-select';
import ReactMarkdown from 'react-markdown'
import options from "./category";

const host = 'http://localhost:3030';

const CreateColl = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { userId, userRole } = useUser();
  const [inputs, setInputs] = useState([])
  const [nameField, setNameField] = useState('');
  const [valueField, setValue] = useState('');
  const [values, setValues] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescr] = useState('');
  const [category, setCategory] = useState('');
  const [success, setSuccss] = useState(false);
  const [showText, setShowText] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInputCategory, setShowInputCategory] = useState(false);

  const maxFields = 3;
  const navigate = useNavigate();

  const addField = () => {
    setShowText(true);
    if (inputs.length < maxFields) {
      setInputs([...inputs, nameField ])
      setValues([...values, valueField]);
      setValue('');
      setNameField('')
    }
  }

  const handleName = (e) => {
    setNameField(e.target.value)
  }

  const customDarkStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#4a3f51'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#6d6d6d' :'transporant' 
    })
  }
  const handleRemoveField = (index) => {
    setInputs(inputs.filter((_, i) => i!== index));
    setValues(values.filter((_, i) => i!== index));
    if (inputs.length < 2) {
      setShowText(false);
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true)
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);
      try {
       const resp = await axios.post(`${host}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const link = resp.data.message;
        setLoading(false)
        return link
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      setErr('Select a file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lin = await handleUpload();
    const data = {
      name,
      category,
      description,
      userId,
      lin
    };

    inputs.forEach((key, index)=> {
      data[key] = values[index];
    });

    try {
      const resp = await axios.post(`${host}/createcoll`, { data, inputs });
      if (resp.data.message === 'ok') {
        setSuccss(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleCategory = (e) => {
    if (e.value === 'Other') {
      setShowInputCategory(true)
    } else {
      setShowInputCategory(false)
    }
    setCategory(e.value);
  }

  const handleOtherCategory = (e) => {
    setCategory(e.target.value)
  }

  const handleDescr = (e) => {
    setDescr(e.target.value);
  }

  const handleNameColl = (e) => {
    setName(e.target.value)
  }

  return (
    <div>
      { success ? <SuccessColl /> : (
        <div>
          <Header showExit={true} app={userRole === 'admin'} path={'/admin'}/>
          <div className={`d-flex align-items-center flex-column ${darkMode ? 'dark-theme' : 'light-theme'}`} style={{height: '100%', paddingBottom: '100px', padding: '10px', minHeight: '100vh'}}>
            <h2 className="pb-3 pt-4">
              {t('create.add')}
            </h2>
            <div className={`p-4 rounded shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'} d-flex flex-column`} style={{ maxWidth: '600px', height: 'auto'}}>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="name" className="fw-bold mb-3">
                {t('create.name')}
                </label>
                <input onChange={handleNameColl} className='mb-4 form-control' id="name" required autoFocus></input>

               <label htmlFor="category" className="fw-bold mb-2">
                  {t('create.category')}
                </label>
                <Select styles={darkMode ? customDarkStyles : ''} onChange={(e) => handleCategory(e)} className="mb-4 darkCategory" options={options}></Select>
                {showInputCategory ? (
                  <div>
                    <label htmlFor="categoryOther" className="fw-bold mb-2">
                    {t('create.yourCategory')}
                    </label>
                  <input onChange={handleOtherCategory} id="categoryOther" className='mb-4 form-control'></input>
                  </div>
                ) : null}

                <label htmlFor="description" className="fw-bold mb-2">
                  {t('create.description')}
                </label>
                 <textarea
                  onChange={handleDescr} 
                  id="description" 
                  type="text" 
                  className='form-control last-input mb-4'
                  value={description}
                /> 
                <div>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
                
                {showText ? (
                  <h5 style={{margin: '0', fontSize: '1rem'}} className="fw-bold mb-2">
                    {t('create.newFields')}
                  </h5>
                ) : null}
                { inputs.map((el, index) => (
                  <div key={index}>
                    <div className="d-flex align-items-center mb-4 justify-content-between pt-2">
                      <h5 className="addedField form-control" style={{margin: '0'}}>{el}</h5>
                      <button type="button" className="linkButton" onClick={() => handleRemoveField(index)}>
                        <img className="remove" src={remove} alt="remove" />
                      </button> 
                    </div>
                  </div>
                ))}
                
                <div className="mb-3">
                  <input type="file" name='file' onChange={handleFileChange} />
                  {!loading ? null : (
                    <p>
                      {t('create.loading')}
                    </p>
                  )}
                   {err ? (<p>{err}</p>) : null}
                </div>

                { inputs.length < maxFields ? (
                  <div>
                    <label className="mb-2 fw-bold">
                      {t('create.addedFieldName')}
                    </label>
                    <div className="d-flex flex-row justify-content-between mb-2" style={{gap: '5px'}}>
                      <input id="nameField" value={nameField} className="form-control" onChange={handleName} placeholder={t('create.exampleName')} style={{width: '100%', marginRight: '10px'}}></input>
                      <button type='button' onClick={addField} className={`btn ${darkMode ? 'button-dark' : 'btn-light'}`} style={{height: '40px'}}>
                        {t('create.addField')}
                      </button>
                    </div>
                  </div>
                ) : null}
                <div className="d-flex justify-content-center flex-wrap" style={{marginTop: '20px', gap: '10px'}}>
                  <button type="submit" className={` btn ${darkMode ? 'button-dark' : 'btn-light'} mt-2`} style={{minWidth: '100px'}}>
                    {t('create.create')}
                  </button>
                  <button onClick={() => navigate('/collections')} className={`btn mt-2 ${darkMode ? 'button-dark' : 'btn-light'}`} style={{minWidth: '100px'}}>
                    {t('registration.back')}
                  </button>
                </div> 
              </form>   
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateColl;