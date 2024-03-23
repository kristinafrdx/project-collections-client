import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './components/context/ThemeContext';
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { LanguageProvider } from './components/context/LangContext';
import { UserProvider } from './components/context/UserContext';
import { IsLoggedProvider } from './components/context/IsloggedContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <I18nextProvider i18n={i18next}>
    <LanguageProvider>
      <ThemeProvider>
       <UserProvider>
        <IsLoggedProvider>
         <App />
        </IsLoggedProvider>
       </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  </I18nextProvider>
  // </React.StrictMode>
);

