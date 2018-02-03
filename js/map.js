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
var LIST_APARTMENT_TYPES = [
  'flat',
  'house',
  'bungalo'
];

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
