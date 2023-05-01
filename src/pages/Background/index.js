import {
  Server,
  Store,
  getLocalStorage,
  getLocalStorageAll,
  getCookie,
  Tab,
} from '../../modules/Utils';
import { auth, usersCol } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import {
  getCurrentYearMonthDay,
  parseDateFromStore,
} from '../../helpers/dateHelper.js';

Server.onMessage.addListener((res, sender, sendResponse) => {
  switch (res.action) {
    case 'sendToApi':
      sendToApi(res, sendResponse);
      break;
    case 'login':
      login(res, sendResponse);
      break;
    default:
      console.log('Invalid Action');
  }
  return true;
});

async function sendToApi(data, callback) {
  var userDetails = await getLocalStorage('userDetail');
  if (userDetails === null) {
    throw new Error('You are not logged in');
  }

  const requestData = {
    insurance: { val: 0, unit: 'percent' },
    int_rate: { val: 0, unit: 'value' },
    loan: { val: 0, unit: 'value' },
    loan_term: 0,
    maintenance: { val: 0, unit: 'value' },
    price: Number(data.data),
    purchase_date: '',
    revenue: 0,
    saving: 0,
    start_capital: 0,
    start_date: getCurrentYearMonthDay(),
  };

  try {
    const allStorage = await getLocalStorageAll();
    console.log('allStorage', allStorage);
    if (!allStorage.loan || !allStorage.date) {
      return;
    }
    if(!allStorage?.mode){
      allStorage.mode = 'loan';
    }
    requestData.purchase_date = parseDateFromStore(allStorage.date);
    requestData.loan = {
      val: Number(((allStorage.loan / 100) * Number(data.data)).toFixed(0)),
      unit: 'value',
    };
    if(allStorage?.mode == 'leasing' && allStorage?.lease !== undefined){
      requestData.leasing_downpayment = Number(((allStorage.lease / 100) * Number(data.data)).toFixed(0));
    }
  } catch (error) {
    throw new Error('Something went wrong. Please contact the administrator.');
  }

  try {
    var uid = await getCookie('user-auth-uid', 'affordify.io');
    console.log(uid);
    
    if (uid === null || uid === '') {
      Tab.create({ url: 'https://affordify.io/' });
      return;
    }
    const dbUser = await getDoc(doc(usersCol, uid));
    if (dbUser.exists()) {
      var userDbData = dbUser.data();
      if (userDbData && userDbData.finances) {
        requestData.insurance = {val: userDbData.finances.insurance || 0, unit: 'percent'};
        requestData.int_rate = {val: userDbData.finances.interestRate || 0, unit: 'value'};
        requestData.loan_term = userDbData.finances.loanTerm || 0;
        requestData.maintenance = {val: userDbData.finances.maintenance || 0, unit: 'value'};
        requestData.revenue = userDbData.finances.revenue || 0;
        requestData.saving = userDbData.finances.saving || 0;
        requestData.start_capital = userDbData.finances.startCapital || 0;
      } else {
        throw new Error(
          'Your finances were not found. Please fill out your info on our website: affordify.io'
        );
      }
    } else {
      throw new Error(`User not in DB`);
    }
  } catch (error) {
    throw new Error('Error. Please try again.');
  }

  var authToken = await getCookie('user-auth-token', 'affordify.io');

  if (!authToken) {
    console.log('no auth token found');
    return;
  }

  fetch('https://api.affordify.io/extension', {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      Store.set({ response: res });
      callback(res);
    })
    .catch((err) => {
      throw new Error('Error. Please try again.');
    });
}

async function login(data, callback) {
  signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      Store.set({ userDetail: user });
      callback({ token: user.accessToken });
    })
    .catch((error) => {
      const errorMessage = error.message;
      callback({ error: errorMessage });
    });
}

async function test() {
  var uid = await getCookie('user-auth-uid', 'affordify.io');
  console.log(uid);
}
// test();
