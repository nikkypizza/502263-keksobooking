'use strict';

(function () {
  var mapNode = document.querySelector('.map');
  var addressNode = document.getElementById('address');
  var mapPinMainNode = mapNode.querySelector('.map__pin--main');
  var mapPinsNode = document.querySelector('.map__pins');
  var mapFiltersFormNode = document.querySelector('.map').querySelector('.map__filters');

  var noticeFormNode = document.querySelector('.notice__form');

  var closePopup = function () {
    var popupNode = document.querySelector('.map__card');
    popupNode.classList.add('hidden');
  };

  var onPopupEscPress = function (event) {
    if (event.keyCode === window.constants.KEYCODE_ESC) {
      closePopup();
    }
  };

  // Вешает закрывателей на ноду попапа
  var addPopupCloseHandlers = function () {
    var popupCloseElem = document.querySelector('.popup__close');

    popupCloseElem.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };


  // Отрисовывает пины, снимает блокировку с элементов форм
  var enableInteractivity = function () {
    mapNode.classList.remove('map--faded');
    noticeFormNode.classList.remove('notice__form--disabled');
    mapPinMainNode.zIndex = 10;

    window.form.toggleDisabledOnFormNodes(noticeFormNode, false);
    window.form.toggleDisabledOnFormNodes(mapFiltersFormNode, false);
    mapPinMainNode.zIndex = '';

    // Оставляет поле адреса визуально неактивным
    addressNode.style = 'pointer-events:none';
    addressNode.previousElementSibling.style = 'pointer-events:none';

    window.map.renderMap();
    addPopupCloseHandlers();
  };

  // Удаляет обработчик кнопки после того, как он отрабатывает
  var onUserPinEnterPress = function (event) {
    if (event.keyCode === window.constants.KEYCODE_ENTER || event.keyCode === window.constants.KEYCODE_SPACE) {
      enableInteractivity();
      mapPinMainNode.removeEventListener('mouseup', onUserPinMouseUp);
      mapPinMainNode.removeEventListener('keydown', onUserPinEnterPress);
    }
  };

  // Удаляет обработчик клика после того, как он отрабатывает
  var onUserPinMouseUp = function () {
    enableInteractivity();
    mapPinMainNode.removeEventListener('mouseup', onUserPinMouseUp);
    mapPinMainNode.removeEventListener('keydown', onUserPinEnterPress);
  };

  // Добавляет обработчиков на главный пин
  mapPinMainNode.addEventListener('mouseup', onUserPinMouseUp);
  mapPinMainNode.addEventListener('keydown', onUserPinEnterPress);


  // Матчит дата-аттрибут пина с индексом соответствующего пину объявления
  var getClickedPinOffer = function (eventTarget) {
    var offerIndex = parseFloat(eventTarget.dataset.offer);
    return window.data.offersArray[offerIndex];
  };

  // Рендерит объявление с заменой предыдущего (если оно было)
  var renderPopup = function (offer) {
    var mapFiltersNode = document.querySelector('.map__filters-container');

    var oldOfferNode = mapFiltersNode.querySelector('.map__card');
    var offerElem = window.map.renderOffer(offer);

    if (oldOfferNode) {
      mapFiltersNode.replaceChild(offerElem, oldOfferNode);
    } else {
      mapFiltersNode.appendChild(offerElem);
    }
  };


  // Приниммет цель события и элемент, на котором этом событие ловим. Использует всплытие, чтобы поймать нужный элемент и возвращает его.
  var findClosestElem = function (target, elem) {
    var closestElem;

    while (target.className !== mapPinsNode.className) {
      if (target.className === elem) {
        closestElem = target;
      }
      target = target.parentNode;
    }

    return closestElem;
  };


  // Клик всплывает до нужной ноды. Когда находит нужную - заменяет попап и вешает на него отслеживание закрытия
  var onOfferPinClick = function (event) {
    var clickedPin = findClosestElem(event.target, 'map__pin');

    if (clickedPin) {
      renderPopup(getClickedPinOffer(clickedPin));
      document.querySelector('.map__card').classList.remove('hidden');
      addPopupCloseHandlers();
    }
  };

  mapPinsNode.addEventListener('click', onOfferPinClick);

  window.popup = {
    noticeFormNode: noticeFormNode,
    mapFiltersFormNode: mapFiltersFormNode,
    addressNode: addressNode,
    mapPinMainNode: mapPinMainNode,
    mapPinsNode: mapPinsNode
  };
})();
