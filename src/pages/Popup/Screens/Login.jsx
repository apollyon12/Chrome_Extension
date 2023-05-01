import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import '../Popup.css';
import { Link } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = ({ Activate }) => {
  // const [open, setOpen] = React.useState(false);
  // const [alert, setAlert] = React.useState('error');
  // const [message, setMessage] = React.useState('This is an Error Message');
  // const [email, setEmail] = React.useState('');
  // const [password, setPassword] = React.useState('');

  // var Server = chrome.runtime;
  // var Store = chrome.storage.local;

  const openTab = () => {
    window.open('https://affordify.io/', '_blank');
  }

  // const handleClick = () => {
  //   if (email === '' || password === '') {
  //     showAlert('error', 'Please fill all the fields');
  //     return;
  //   }
  //   Server.sendMessage(
  //     { action: 'login', email: email, password: password },
  //     (res) => {
  //       if (res?.token) {
  //         Store.set({ token: res.token, active: true });
  //         Activate('home');
  //       } else {
  //         if (res?.error) {
  //           showAlert('error', res.error);
  //         } else {
  //           showAlert('error', 'Incorrect Email/Password');
  //         }
  //       }
  //     }
  //   );
  // };

  // const showAlert = (type, message) => {
  //   setAlert(type);
  //   setMessage(message);
  //   setOpen(true);
  // };

  // const handleClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpen(false);
  // };
  // return (
  //   <div className="App " style={{ transform: "scale(0.82)"}} >
  //     <Box>
  //       <Typography
  //         variant="h3"
  //         component="div"
  //         gutterBottom
  //         sx={{ fontWeight: 'bold', textAlign: 'left', marginTop: '1rem' }}
  //       >
  //         LOGIN
  //       </Typography>
  //       <TextField
  //         id="outlined-basic"
  //         label="Email"
  //         variant="outlined"
  //         sx={{ marginTop: '1rem', width: '100%' }}
  //         onChange={(e) => {
  //           setEmail(e.target.value);
  //         }}
  //       />
  //       <TextField
  //         id="outlined-basic"
  //         label="Password"
  //         type="password"
  //         variant="outlined"
  //         sx={{ marginTop: '1rem', width: '100%' }}
  //         onChange={(e) => {
  //           setPassword(e.target.value);
  //         }}
  //       />
  //       <Button
  //         variant="contained"
  //         sx={{
  //           fontWeight: 'bold',
  //           width: '100%',
  //           marginTop: '1rem',
  //           height: '2.5rem',
  //         }}
  //         onClick={handleClick}
  //       >
  //         LOGIN
  //       </Button>
  //     </Box>
  //     <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  //       <Alert onClose={handleClose} severity={alert} sx={{ width: '100%' }}>
  //         {message}
  //       </Alert>
  //     </Snackbar>
  //   </div>
  // );

  return (
    <div className="App" style={{ transform: "scale(0.82)", top: '0px', height: '20rem', marginTop: '10rem'}} >
      <Typography sx={{fontSize:'1.6rem'}}>Please Login On the Website</Typography>
      <Link href='https://affordify.io/' sx={{fontSize:'1.6rem'}} onClick={openTab}>affordify.io</Link>
    </div>
  )
};

export default Login;
