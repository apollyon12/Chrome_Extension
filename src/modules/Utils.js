export const Store = chrome.storage.local;

export const Server = chrome.runtime;

export const Cookie = chrome.cookies;

export const Tab = chrome.tabs;

export const getLocalStorage = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (e) => {
      if (e !== undefined) {
        resolve(e);
      } else {
        resolve(null);
      }
    });
  });
};

export const getLocalStorageAll = () => {
  return new Promise((resolve) => {
    Store.get(e => {
      if (e !== undefined) {
        resolve(e);
      } else {
        resolve(null);
      }
    })
  });
};

export const extractNumber = (str) => {
    var match = str.match(/[0-9]+/gi);
    if(match === null){
        return null;
    }
    return match.join('');
}

export const getCookie = (name, domain) => {
	return new Promise((resolve) => {
	  Cookie.getAll({ domain: domain, name: name }, (c) => {
		if (c.length === 0) {
		  resolve(null);
		} else {
		  resolve(c[0]?.value.replaceAll('"', ''));
		}
	  });
	});
  }
