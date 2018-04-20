var WSocket = new WebSocket('ws://82.146.54.90:2346');

WSocket.onopen = function() {

};

WSocket.onclose = function(event) {
  if (event.wasClean) {
    alert('Соединение закрыто чисто');
  } else {
    alert('Обрыв соединения'); // например, "убит" процесс сервера
  }
  alert('Код: ' + event.code + ' причина: ' + event.reason);
};

WSocket.onerror = function(error) {
  alert("Ошибка " + error.message);
};
