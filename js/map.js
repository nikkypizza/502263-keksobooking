'use strict';

// Общее количество предложений
var OFFERS_COUNT = 8;

var ALL_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var ALL_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var LIST_CHECK_IN = [
  '12:00',
  '13:00',
  '14:00'
];

var LIST_CHECK_OUT = [
  '12:00',
  '13:00',
  '14:00'
];

// массив с типом жилья
var LIST_APARTMENT_TYPES = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом'
};

// массив с удобствами
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// Возвращает URL аватара
var getAvatarUrl = function (avatar) {
  return 'img/avatars/user' + addZero(avatar) + '.png';
};

// Добавляет 0, если num = число однозначное
var addZero = function (num) {
  return (num < 10 ? '0' : '') + num;
};

// Генерирует случайное число от min до max. Если третий параметр = true, то включает max
var getRandomNumber = function (min, max, includeMax) {
  var addMax = includeMax ? 1 : 0;
  return Math.floor(Math.random() * (max - min + addMax) + min);
};

// Возвращает массив значений произвольной длины
var getArrayOfRandomLength = function (srcArray) {
  var randomLength = getRandomNumber(0, srcArray.length, true);
  return srcArray.slice(0, randomLength);
};

// Возвращает случайный элемент массива
var getRandomElem = function (srcArray) {
  return srcArray[getRandomNumber(0, srcArray.length)];
};

/* Возвращает перемешаный массив
   Тасование Фишера — Йетса      */
function getShuffleArray(array) {
  var m = array.length;
  var t;
  var i;

  // Пока еще остаются элементы для тасования...
  while (m) {

    // Берем остающийся элемент...
    i = Math.floor(Math.random() * m--);

    // И меняем его местами с текущим элементом
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// Создает массив случайных чисел от 1 до 8
var getRandomNumberArray = function () {
  var arr = [];
  for (var i = 0; i < 8; i++) {
    var random = getRandomNumber(1, 8, true);
    arr.push(random);
  }
  return arr;
};


// Создает массив объявлений
var getOffersArray = function (quantity) {
  var offersArray = [];
  var currentOffer;
  var shuffleTitles = getShuffleArray(ALL_TITLES);

  for (var i = 0; i < quantity; i += 1) {
    var x = getRandomNumber(300, 900, true);
    var y = getRandomNumber(150, 500, true);

    currentOffer = {
      author: {
        avatar: getAvatarUrl(getRandomNumberArray()[i])
      },
      offer: {
        title: shuffleTitles[i],
        address: x + ', ' + y,
        price: getRandomNumber(1000, 1000000, true),
        type: getRandomElem(Object.keys(LIST_APARTMENT_TYPES)),
        rooms: getRandomNumber(1, 5, true),
        guests: getRandomNumber(1, 10, true),
        checkin: getRandomElem(LIST_CHECK_IN),
        checkout: getRandomElem(LIST_CHECK_OUT),
        features: getArrayOfRandomLength(FEATURES),
        description: '',
        photos: ALL_PHOTOS
      },
      location: {
        x: x,
        y: y
      },
      pin: {
        avatar: getAvatarUrl(i + 1)
      }
    };
    offersArray.push(currentOffer);
  }

  return offersArray;
};

var offersArray = getOffersArray(OFFERS_COUNT);
var CURRENT_OFFER = offersArray[0];

var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinImgElem = pinTemplate.querySelector('img');

// Константы пина
var PIN_X = pinImgElem.getAttribute('width') / 2;
var PIN_Y = parseFloat(pinImgElem.getAttribute('height'));

// Объявление фрагмента пина
var createPinElem = function (coordinates, avatar) {

  var pinElem = pinTemplate.cloneNode(true);
  pinElem.querySelector('img').src = avatar;

  pinElem.style.left = coordinates.x - PIN_X + 'px';
  pinElem.style.top = coordinates.y - PIN_Y + 'px';
  pinElem.classList.add('map__pin');

  return pinElem;
};

// Отрисовка фрагмента пина
var renderPins = function (offers) {
  var pinFragment = document.createDocumentFragment();

  offers.forEach(function (offer) {
    pinFragment.appendChild(createPinElem(offer.location, offer.pin.avatar));
  });

  return pinFragment;
};


// Объявление фрагмента фичи
var createFeaturesElem = function (feature) {
  var featureElem = document.createElement('li');
  featureElem.classList.add('feature', 'feature--' + feature);

  return featureElem;
};

// Отрисовка фрагмент фичи
var renderFeaturesElem = function (featuresArray) {
  var featuresFragment = document.createDocumentFragment();

  featuresArray.forEach(function (feature) {
    featuresFragment.appendChild(createFeaturesElem(feature));
  });

  return featuresFragment;
};


// Отрисовка объявления
var renderOffer = function (currentOffer) {
  var offerElem = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);
  var photoList = offerElem.querySelector('.popup__pictures');
  var shuffledPhotos = getShuffleArray(ALL_PHOTOS);

  // Склоняет слово "комната" в зависимости от количества
  var createRoomPluralName = function () {
    var roomQuantity = 'комнаты';
    var roomNumber = currentOffer.offer.rooms;
    if (roomNumber === 1) {
      roomQuantity = 'комната';
    }
    if (roomNumber > 4) {
      roomQuantity = 'комнат';
    }
    return roomQuantity;
  };

  // Склоняет слово "гость" в зависимости от количества
  var createGuestPluralName = function () {
    var guestQuantity;
    guestQuantity = currentOffer.offer.guests === 1 ? 'гостя' : 'гостей';
    return guestQuantity;
  };

  offerElem.querySelector('h3').textContent = currentOffer.offer.title;
  offerElem.querySelector('p small').textContent = currentOffer.offer.address;
  offerElem.querySelector('.popup__price').textContent = currentOffer.offer.price.toLocaleString() + ' ₽/ночь';
  offerElem.querySelector('h4').textContent = LIST_APARTMENT_TYPES[currentOffer.offer.type];
  offerElem.querySelector('h4 + p').textContent = currentOffer.offer.rooms + ' ' + createRoomPluralName() + ' для ' + currentOffer.offer.guests + ' ' + createGuestPluralName();
  offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + currentOffer.offer.checkin + ',' + ' выезд до ' + currentOffer.offer.checkout;
  offerElem.querySelector('ul + p').textContent = currentOffer.offer.description;
  offerElem.querySelector('.popup__avatar').src = currentOffer.author.avatar;
  offerElem.querySelector('.popup__features').innerHTML = '';

  for (var i = 0; i < 3; i++) {
    var photoElement = photoList.querySelector('li').cloneNode(true);
    photoList.appendChild(photoElement);

    photoElement.querySelector('img').style.width = '65px';
    photoElement.querySelector('img').style.height = '65px';
    photoElement.querySelector('img').style.padding = '0 3px 0 0';
    photoElement.querySelector('img').src = shuffledPhotos[i];
  }

  return offerElem;
};

// Отрисовывает карту, включая пины и объявление

var renderMap = function () {
  var mapElem = document.querySelector('.map');
  var mapPinsElem = mapElem.querySelector('.map__pins');
  mapElem.classList.remove('map--faded');

  var fragment = document.createDocumentFragment();

  var mapFiltersElem = document.querySelector('.map__filters-container');
  var offerElem = renderOffer(CURRENT_OFFER);

  offerElem.querySelector('.popup__features').appendChild(renderFeaturesElem(CURRENT_OFFER.offer.features));
  mapPinsElem.appendChild(renderPins(offersArray));
  fragment.appendChild(offerElem);
  mapFiltersElem.appendChild(fragment);
};


// ---------
var KEYCODE_ENTER = 13;

var mapNode = document.querySelector('.map');

var mapPinMainNode = mapNode.querySelector('.map__pin--main');

var mapFiltersFormNode = document.querySelector('.map').querySelector('.map__filters');
var noticeFormNode = document.querySelector('.notice__form');

// Добавляет или убирает аттрибут disabled нодам формы
var toggleDisabledOnFormNodes = function (form, isDisabled) {
  for (var i = 0; i < form.elements.length; i++) {
    form.elements[i].disabled = isDisabled;
  }
};

toggleDisabledOnFormNodes(noticeFormNode, true);
toggleDisabledOnFormNodes(mapFiltersFormNode, true);


// Отрисовывает пины, снимает блокировку с элементов форм
var enableInteractivity = function () {
  mapNode.classList.remove('map--faded');
  noticeFormNode.classList.remove('notice__form--disabled');

  toggleDisabledOnFormNodes(noticeFormNode, false);
  toggleDisabledOnFormNodes(mapFiltersFormNode, false);

  renderMap();
};

var onUserPinEnterPress = function (event) {
  if (event.keyCode === KEYCODE_ENTER) {
    enableInteractivity();
    mapPinMainNode.removeEventListener('mouseup', onUserPinMouseUp);
    mapPinMainNode.removeEventListener('keydown', onUserPinEnterPress);
  }
};

var onUserPinMouseUp = function () {
  enableInteractivity();
  mapPinMainNode.removeEventListener('mouseup', onUserPinMouseUp);
  mapPinMainNode.removeEventListener('keydown', onUserPinEnterPress);
};

mapPinMainNode.addEventListener('mouseup', onUserPinMouseUp);
mapPinMainNode.addEventListener('keydown', onUserPinEnterPress);
