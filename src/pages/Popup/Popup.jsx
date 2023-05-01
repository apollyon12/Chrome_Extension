import React, { useLayoutEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import Login from './Screens/Login';
import Home from './Screens/Home';
import { getCookie } from '../../modules/Utils';

const Popup = () => {
  const [page, setPage] = React.useState('login');

  var Store = chrome.storage.local;

  useLayoutEffect(() => {
    init();
  }, []);

  const init = async () => {
    var uid = await getCookie('user-auth-uid', 'affordify.io');
    // console.log(uid);
    if (uid !== null) {
      setPage('home');
    }
    Store.get((e) => {
      if (e.activate === undefined) {
        Store.set({ activate: true });
      }
    });
  };

  const ActivePage = (state) => {
    if (state) {
      setPage(state);
    }
  };

  return (
    <div className="App">
      {page === 'login' ? (
        <Login Activate={ActivePage} />
      ) : (
        <Home Activate={ActivePage} />
      )}
    </div>
  );
};

export default Popup;
