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
  includeMax = includeMax ? 1 : 0;
  return Math.floor(Math.random() * (max - min + includeMax) + min);
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


// Создает массив объявлений
var getOffersArray = function (quantity) {
  var offersArray = [];
  var currentOffer;

  for (var i = 0; i < quantity; i += 1) {
    var x = getRandomNumber(300, 900, true);
    var y = getRandomNumber(150, 500, true);

    currentOffer = {
      author: {
        avatar: getAvatarUrl(i + 1)
      },
      offer: {
        title: getRandomElem(ALL_TITLES),
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
    pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar));
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

  offerElem.querySelector('h3').textContent = currentOffer.offer.title;
  offerElem.querySelector('p small').textContent = currentOffer.offer.address;
  offerElem.querySelector('.popup__price').textContent = currentOffer.offer.price + '₽/ночь';
  offerElem.querySelector('h4').textContent = LIST_APARTMENT_TYPES[currentOffer.offer.type];
  offerElem.querySelector('h4 + p').textContent = currentOffer.offer.rooms + ' комнаты для ' + currentOffer.offer.guests + ' гостей';
  offerElem.querySelector('h4 + p + p').textContent = 'Заезд после ' + currentOffer.offer.checkin + ',' + ' выезд до ' + currentOffer.offer.checkout;
  offerElem.querySelector('ul + p').textContent = currentOffer.offer.description;
  offerElem.querySelector('.popup__avatar').src = currentOffer.author.avatar;
  offerElem.querySelector('.popup__features').innerHTML = '';

  for (var i = 0; i < 3; i++) {
    var photoElement = photoList.querySelector('li').cloneNode(true);
    photoList.appendChild(photoElement);

    photoElement.querySelector('img').style.width = '100px';
    photoElement.querySelector('img').style.height = '100px';
    photoElement.querySelector('img').src = getRandomElem(ALL_PHOTOS);
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

renderMap();