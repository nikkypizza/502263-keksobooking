'use strict';

(function () {
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

  // Массив с типом жилья
  var LIST_APARTMENT_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  // Массив с удобствами
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
    return 'img/avatars/user' + window.utils.addZero(avatar) + '.png';
  };

  // Создает массив объявлений
  var getOffersArray = function (quantity) {
    var offersArray = [];
    var currentOffer;
    var shuffleTitles = window.utils.getShuffleArray(ALL_TITLES);

    for (var i = 0; i < quantity; i += 1) {
      var x = window.utils.getRandomNumber(300, 900, true);
      var y = window.utils.getRandomNumber(150, 500, true);

      currentOffer = {
        author: {
          avatar: getAvatarUrl(i + 1)
        },
        offer: {
          title: shuffleTitles[i],
          address: 'x:' + x + ', y:' + y,
          price: window.utils.roundTo100(window.utils.getRandomNumber(1000, 1000000, true)),
          type: window.utils.getRandomElem(Object.keys(LIST_APARTMENT_TYPES)),
          rooms: window.utils.getRandomNumber(1, 5, true),
          guests: window.utils.getRandomNumber(1, 10, true),
          checkin: window.utils.getRandomElem(LIST_CHECK_IN),
          checkout: window.utils.getRandomElem(LIST_CHECK_OUT),
          features: window.utils.getArrayOfRandomLength(FEATURES),
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

  var offersArray = getOffersArray(window.constants.OFFERS_COUNT);
  var CURRENT_OFFER = offersArray[0];


  window.data = {
    CURRENT_OFFER: CURRENT_OFFER,
    LIST_APARTMENT_TYPES: LIST_APARTMENT_TYPES,
    offersArray: offersArray
  };
})();
