'use strict';

(function () {
  var TIMEOUT = 10000;

  var ERRORS = {
    timeoutExceeded: function (timeout) {
      return 'Запрос не успел выполниться за ' + timeout + 'мс';
    },
    generalError: function (error) {
      return 'Произошла ошибка ' + error;
    },
    connectionError: function () {
      return 'Произошла ошибка соединения';
    }
  };


  var getData = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError(ERRORS.generalError(xhr.status));
      }
    });

    xhr.addEventListener('error', function () {
      onError(ERRORS.connectionError());
    });
    xhr.addEventListener('timeout', function () {
      onError(ERRORS.timeoutExceeded(xhr.timeout));
    });
    return xhr;
  };

  var get = function (url, onSuccess, onError) {
    var xhr = getData(onSuccess, onError);

    xhr.open('GET', url);
    xhr.send();
  };

  var post = function (url, data, onSuccess, onError) {
    var xhr = getData(onSuccess, onError);

    xhr.open('POST', url);
    xhr.send(data);
  };


  window.backend = {
    get: get,
    post: post
  };
})();
