'use strict';

(function () {
  var pinTemplateNode = document.querySelector('template').content.querySelector('.map__pin');
  var pinImgNode = pinTemplateNode.querySelector('img');

  // Объявление фрагмента пина
  var createPinElem = function (coordinates, avatar, dataIndex) {

    var pinElem = pinTemplateNode.cloneNode(true);
    pinElem.querySelector('img').src = avatar;

    pinElem.style.left = coordinates.x - PIN_WIDTH + 'px';
    pinElem.style.top = coordinates.y - PIN_HEIGHT + 'px';
    pinElem.classList.add('map__pin');
    pinElem.dataset.offer = dataIndex;

    return pinElem;
  };

  // Константы пина
  var PIN_WIDTH = pinImgNode.getAttribute('width');
  var PIN_HEIGHT = parseFloat(pinImgNode.getAttribute('height'));

  // Отрисовка фрагмента пина
  var renderPins = function (offers) {
    var pinFragment = document.createDocumentFragment();

    offers.forEach(function (offer, index) {
      pinFragment.appendChild(createPinElem(offer.location, offer.author.avatar, index));
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
    var shuffledPhotos = window.utils.getShuffleArray(currentOffer.offer.photos);

    // Склоняет слово "комната" в зависимости от количества
    var createRoomPluralName = function () {
      var roomNoun = 'комнаты';
      var roomNumber = currentOffer.offer.rooms;
      if (roomNumber === 1) {
        roomNoun = 'комната';
      }
      if (roomNumber > 4) {
        roomNoun = 'комнат';
      }
      return roomNoun;
    };

    // Склоняет слово "гость" в зависимости от количества
    var createGuestPluralName = function () {
      var guestNoun = currentOffer.offer.guests === 1 ? 'гостя' : 'гостей';
      return guestNoun;
    };

    offerElem.querySelector('h3').textContent = currentOffer.offer.title;
    offerElem.querySelector('p small').textContent = currentOffer.offer.address;
    offerElem.querySelector('.popup__price').textContent = currentOffer.offer.price.toLocaleString() + ' ₽/ночь';
    offerElem.querySelector('h4').textContent = window.data.LIST_APARTMENT_TYPES[currentOffer.offer.type];
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
    mapElem.classList.remove('map--faded');

    var fragment = document.createDocumentFragment();

    var mapFiltersElem = document.querySelector('.map__filters-container');
    var offerElem = renderOffer(window.data.CURRENT_OFFER);

    offerElem.querySelector('.popup__features').appendChild(renderFeaturesElem(window.data.CURRENT_OFFER.offer.features));
    window.popup.mapPinsNode.appendChild(renderPins(window.data.offersArray));
    fragment.appendChild(offerElem);
    mapFiltersElem.appendChild(fragment);
  };

  window.map = {
    renderMap: renderMap,
    renderOffer: renderOffer,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT
  };
})();
