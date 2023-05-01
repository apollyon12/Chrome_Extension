import { Store, Server, extractNumber } from '../../modules/Utils';

function getSelectionText() {
  var text = '';
  if (window.getSelection) {
    text = window.getSelection()?.toString();
  } else if (document.selection && document.selection.type != 'Control') {
    text = document.selection.createRange().text;
  }
  return text;
}

document.addEventListener('mouseup', (e) => {
  var txt = getSelectionText();
  console.log('selected txt',txt);
  if (txt === '') {
    return;
  }
  var num = extractNumber(txt);
  if (!num) {
    return;
  }
  Store.set({ value: num });
  Server.sendMessage({ action: 'sendToApi', data: num });
});
