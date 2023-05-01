import React, { useLayoutEffect, useState } from 'react';
import '../style.css';
import cle from '../../../assets/img/Vector.png';
import clock from '../../../assets/img/clock.png';
import DollarBag from '../../../assets/img/DollarBag.png';
import header from '../../../assets/img/Group.png';
import settings from '../../../assets/img/settings.png';
import Tag from '../../../assets/img/Tag.png';
import Calendar from '../../../assets/img/Calendar.png';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

// Old Imports

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Slider from '@mui/material/Slider';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import DoneIcon from '@mui/icons-material/Done';
import '../Popup.css';
import { Divider } from '@mui/material';
import {
  getCurrentYearMonthDay,
  getDateYearsFromNow,
  parseDateFromStore,
} from '../../../helpers/dateHelper.js';
import { getLocalStorage } from '../../../modules/Utils.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = ({ Activate }) => {
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState('error');
  const [message, setMessage] = React.useState('This is an Error Message');
  const [response, setResponse] = React.useState({});
  const [date, setDate] = React.useState(dayjs(getDateYearsFromNow(3)));
  const [loan, setLoan] = React.useState(0);
  const [lease, setLease] = React.useState(0);
  const [loanAmount, setLoanAmount] = React.useState(0);
  const [leaseAmount, setLeaseAmount] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [showLoan, setShowLoan] = useState(true);
  const [showLeasing, setShowLeasing] = useState(false);
  const [showNone, setShowNone] = useState(false);
  const [loanTerm, setloanTerm] = useState(5);
  const [leasingTerm, setleasingTerm] = useState(5);

  var Server = chrome.runtime;
  var Store = chrome.storage.local;

  useLayoutEffect(() => {
    Store.get((e) => {
      if (e.response) {
        setResponse(e.response);
      }
      if (e.date) {
        setDate(dayjs(parseDateFromStore(e.date)));
      } else {
        Store.set({ date: date });
      }
      if (e.loan) {
        setLoan(e.loan);
      } else {
        Store.set({ loan: loan });
        e.loan = 0;
      }
      if (e.lease) {
        setLease(e.lease);
      } else {
        Store.set({ lease: lease });
        e.lease = 0;
      }
      if (e.value) {
        console.log(e.value);
        console.log(e.loan);
        setLoanAmount((Number(e.value) / 100) * e.loan);
        setLeaseAmount((Number(e.value) / 100) * e.lease);
        setPrice(Number(e.value));
      }
    });

    chrome.storage.onChanged.addListener((e) => {
      console.log(e);
      if (e?.response?.newValue) {
        setResponse(e.response.newValue);
      }
      if (e?.value?.newValue) {
        setPrice(e.value.newValue);
      }
    });
  }, []);

  const showAlert = (type, message) => {
    setAlert(type);
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleSubmit = async () => {
    try {
      const updatedPrice = await getUpdatedPrice();
      setPrice(updatedPrice);
      await Server.sendMessage({ action: 'sendToApi', data: updatedPrice });
    } catch (error) {
      showAlert('Something went wrong. Please try again.');
    }
  };
  const handleSlider = async (e) => {
    setLoan(Number(e.target.value));
    Store.set({ loan: e.target.value });
    if (price) {
      try {
        const updatedPrice = await getUpdatedPrice();
        console.log(updatedPrice);
        setPrice(updatedPrice);
        setLoanAmount((updatedPrice / 100) * e.target.value);
      } catch (error) {
        showAlert('Something went wrong. Please try again.');
      }
    }
  };
  const getUpdatedPrice = async () => {
    try {
      const updatedPrice_ = await getLocalStorage('value');
      return Number(updatedPrice_.value);
    } catch (error) {
      return;
    }
  };
  console.log();

  let month = date.$d.getMonth();

  let montharray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let year = date.$d.getFullYear();
  // console.log();

  const handleShow = (e) => {
    console.log(e);
    let nameofinput = e.target.value;

    Store.set({ mode: nameofinput });

    if (nameofinput === 'loan') {
      setShowLoan(true);
      setShowLeasing(false);
      setShowNone(false);
    } else if (nameofinput === 'leasing') {
      setShowLoan(false);
      setShowLeasing(true);
      setShowNone(false);
    } else {
      setShowLoan(false);
      setShowLeasing(false);
      setShowNone(true);
    }
  };

  return (
    <div className="App ext">
      <img
        src={header}
        alt=""
        className="img"
        style={{
          backgroundColor: '#54A9E8',
          width: '100%',
          marginLeft: '-20px',
          paddingLeft: '28px',
          paddingTop: '10px',
        }}
      />
      <div className="wrapper">
        <div className="outer_box">
          <div className="big-innerbox">
            <div className="img-box">
              <img src={DollarBag} />
            </div>
            <h4>Monthly Saving</h4>
            <p>${response?.text?.result?.saving?.value}</p>
          </div>
          <div className="sm-innerbox">
            <p>|</p>
            <h4>OR</h4>
            <p>|</p>
          </div>
          <div className="big-innerbox">
            <div className="img-box">
              <img src={Tag} />
            </div>
            <h4>Purchase Price</h4>
            <p>${response?.text?.result?.price?.value}</p>
          </div>
          <div className="sm-innerbox">
            <p>|</p>
            <h4>OR</h4>
            <p>|</p>
          </div>
          <div className="big-innerbox">
            <div className="img-box">
              <img src={Calendar} />
            </div>
            <h4>Purchase Date</h4>
            <p>{response?.text?.result?.ttp?.value}</p>
          </div>
        </div>

        <h2 className="price">
          <span>Price:</span> ${price}
        </h2>

        <h2 className="price">Financing</h2>

        <div className="radiobtn">
          <div className="btn">
            <input
              type="radio"
              id="loan"
              name="money"
              value="loan"
              onClick={handleShow}
              defaultChecked
            />
            <label for="loan" class="label">
              Loan
            </label>
          </div>
          <div className="btn">
            <input
              type="radio"
              id="leasing"
              name="money"
              value="leasing"
              onClick={handleShow}
            />
            <label for="leasing" class="label">
              Leasing
            </label>
          </div>
          <div className="btn">
            <input
              type="radio"
              id="none"
              name="money"
              value="none"
              onClick={handleShow}
            />
            <label for="none" class="label">
              None
            </label>
          </div>
        </div>

        <div className="form-wrapper">
          {showLoan && (
            <>
              {/* <div className="input-wrapper">
                <div className=" loan-heading">
                  <label for="loan">Loan Amount</label>
                  <div className="toggle-btn">
                    <div>%</div>
                    <div>$</div>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="USD"
                  name="loan"
                  className="input-loan"
                />
              </div> */}
              <div className="input-wrapper input-wrapper-margin">
                <label for="purchase" className="perchase">
                  Purchase Date
                </label>
                <Stack direction="row" spacing={3} sx={{ marginTop: '1rem' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year', 'month']}
                      label="Date"
                      minDate={dayjs(getCurrentYearMonthDay())}
                      maxDate={dayjs(getDateYearsFromNow(10))}
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                        Store.set({ date: newValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
              </div>

              <div className="range-wrapper">
                <div className="range-head">
                  <h4>Loan as % of Price</h4>
                  <div className="head-right">
                    <span>%</span>
                    <span>|</span>
                    <span>{loan}</span>
                  </div>
                </div>

                <input
                  type="range"
                  id="loan"
                  name="loan"
                  min="0"
                  defaultValue={loan}
                  value={loan}
                  max="100"
                  onChange={handleSlider}
                />
                <div className="range-foot">
                  <span>0</span>
                  <span>100</span>
                </div>
                <p>
                  Loan amount: $
                  {typeof loanAmount == 'number'
                    ? Math.round(loanAmount)
                    : loanAmount}
                </p>
              </div>

              <div className="range-wrapper">
                <div className="range-head">
                  <h4>Loan Term</h4>
                  <div className="head-right">
                    <img src={clock} alt="" />
                    <span></span>
                    <span>|</span>
                    <span>{loanTerm}</span>
                  </div>
                </div>

                <input
                  type="range"
                  id="loan"
                  name="loan"
                  min="1"
                  defaultValue="5"
                  max="20"
                  onChange={(e) => setloanTerm(e.target.value)}
                  value={loanTerm}
                />
                <div className="range-foot">
                  <span>1 year</span>
                  <span>20 year</span>
                </div>
              </div>

              <div className="footer">
                <button className="btn" onClick={handleSubmit}>
                  Get Info
                </button>
                <div className="setting">
                  <a href="https://affordify.io/financial-goal" target="_blank">
                    All Settings
                    <img src={settings} alt="settings" />
                  </a>
                </div>
              </div>
            </>
          )}
          {showLeasing && (
            <>
              {/* <div className="input-wrapper">
                <div className=" loan-heading">
                  <label for="loan" style={{ marginTop: '7px' }}>
                    Monthly Payments Amount
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="USD"
                  name="loan"
                  className="input-loan"
                />
              </div> */}
              <div className="input-wrapper input-wrapper-margin">
                <label for="purchase" className="perchase">
                  Purchase Date
                </label>
                <Stack direction="row" spacing={3} sx={{ marginTop: '1rem' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year', 'month']}
                      label="Date"
                      minDate={dayjs(getCurrentYearMonthDay())}
                      maxDate={dayjs(getDateYearsFromNow(10))}
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                        Store.set({ date: newValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
              </div>

              <div className="range-wrapper">
                <div className="range-head">
                  <h4>Downpayment as % of Price</h4>
                  <div className="head-right">
                    <span>%</span>
                    <span>|</span>
                    <span>{lease}</span>
                  </div>
                </div>

                <input
                  type="range"
                  id="loan"
                  name="loan"
                  min="0"
                  onChange={async (e) => {
                    setLease(Number(e.target.value));
                    Store.set({ lease: e.target.value });
                    if (price) {
                      try {
                        const updatedPrice = await getUpdatedPrice();
                        console.log(updatedPrice);
                        setPrice(updatedPrice);
                        setLeaseAmount((updatedPrice / 100) * e.target.value);
                      } catch (error) {
                        showAlert('Something went wrong. Please try again.');
                      }
                    }
                  }}
                  max="100"
                />
                <div className="range-foot">
                  <span>0</span>
                  <span>100</span>
                </div>
                <p>
                  Downpayment amount: $
                  {typeof leaseAmount == 'number'
                    ? Math.round(leaseAmount)
                    : leaseAmount}
                </p>
              </div>

              <div className="range-wrapper">
                <div className="range-head">
                  <h4>Leasing Term</h4>
                  <div className="head-right">
                    <img src={clock} alt="" />
                    <span></span>
                    <span>|</span>
                    <span>{leasingTerm}</span>
                  </div>
                </div>

                <input
                  type="range"
                  id="loan"
                  name="loan"
                  min="1"
                  defaultValue="5"
                  onChange={(e) => setleasingTerm(e.target.value)}
                  value={leasingTerm}
                  max="20"
                />
                <div className="range-foot">
                  <span>1 year</span>
                  <span>20 year</span>
                </div>
              </div>

              <div className="footer">
                <button className="btn" onClick={handleSubmit}>
                  Get Info
                </button>
                <div className="setting">
                  <a href=" ">
                    All Settings
                    <img src={settings} alt="settings" />
                  </a>
                </div>
              </div>
            </>
          )}
          {showNone && (
            <>
              <div className="input-wrapper input-wrapper-margin">
                <label for="purchase" className="perchase">
                  Purchase Date
                </label>
                <Stack direction="row" spacing={3} sx={{ marginTop: '1rem' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year', 'month']}
                      label="Date"
                      minDate={dayjs(getCurrentYearMonthDay())}
                      maxDate={dayjs(getDateYearsFromNow(10))}
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue);
                        Store.set({ date: newValue });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
              </div>

              <div className="footer">
                <button className="btn" onClick={handleSubmit}>
                  Get Info
                </button>
                <div className="setting">
                  <a href="https://affordify.io/financial-goal" target="_blank">
                    All Settings
                    <img src={settings} alt="settings" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* <Box>
				<Stack
					direction="row"
					spacing={10}
					sx={{ placeContent: "center", backgroundColor: "#cfe7fb" }}
				>
					<Typography
						variant="h5"
						component="div"
						gutterBottom
						sx={{
							fontWeight: "bold",
							textAlign: "center",
							marginTop: "0.25rem",
						}}
					>
						Affordify.io
					</Typography>
				</Stack>
				<Stack direction="row" spacing={3}>
					<DoneIcon
						sx={{ width: "2.5rem", height: "2.5rem", color: "green" }}
					/>
					<Stack>
						<Typography
							className="leftSet"
							sx={{
								textAlignLast: "left",
								marginTop: "0.5rem",
								fontWeight: "bold",
							}}
						>
							{response?.text?.title
								? response?.text?.title.trim()
								: "Select a price on any webpage and we will show you your loan options"}
						</Typography>
						{response?.text?.saving ? (
							<Typography
								className="leftSet"
								sx={{ textAlignLast: "left", marginTop: "0.3rem" }}
							>
								{response?.text?.saving.trim()}
							</Typography>
						) : null}
						{response?.text?.price ? (
							<Typography className="leftSet" sx={{ textAlignLast: "left" }}>
								{response?.text?.price.trim()}
							</Typography>
						) : null}
						{response?.text?.ttp ? (
							<Typography className="leftSet" sx={{ textAlignLast: "left" }}>
								{response?.text?.ttp.trim()}
							</Typography>
						) : null}
					</Stack>
				</Stack>
				<Divider />
				<Stack direction="row" spacing={3} sx={{ marginTop: "1rem" }}>
					<Typography sx={{ fontWeight: "bold" }}>Purchase date</Typography>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							views={["year", "month"]}
							label="Year and Month"
							minDate={dayjs(getCurrentYearMonthDay())}
							maxDate={dayjs(getDateYearsFromNow(10))}
							value={date}
							onChange={(newValue) => {
								setDate(newValue);
								Store.set({ date: newValue });
							}}
							renderInput={(params) => (
								<TextField {...params} helperText={null} />
							)}
						/>
					</LocalizationProvider>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ marginTop: "1rem" }}>
					<Typography sx={{ fontWeight: "bold" }}>
						loan as % of price
					</Typography>
					<Stack>
						<Slider
							value={loan}
							aria-label="Default"
							valueLabelDisplay="auto"
							onChange={handleSlider}
						/>
						<Typography sx={{ fontWeight: "bold", color: "darkgrey" }}>
							loan amount: {typeof(loanAmount) == 'number' ? Math.round(loanAmount) : loanAmount}
						</Typography>
					</Stack>
				</Stack>
				<Box
					m={1}
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography sx={{ fontWeight: "bold" }}>
						Price: {price}
					</Typography>
					<Button variant="contained" onClick={handleSubmit}>
						Get info
					</Button>
				</Box>
			</Box>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={alert} sx={{ width: "100%" }}>
					{message}
				</Alert>
			</Snackbar> */}
    </div>
  );
};

export default Home;
