'use strict';

(function () {

  var MIN_PRICES = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  // Отключает все поля формы по умолчанию
  window.popup.noticeFormNode.style = 'pointer-events:none';

  var pinLeft = window.popup.mapPinMainNode.offsetLeft;
  var pinTop = window.popup.mapPinMainNode.offsetTop;
  var pinWidth = window.map.PIN_WIDTH;
  var pinHeight = window.map.PIN_HEIGHT;

  // Добавляет координаты main пина в адресную строку

  var addressValue = 'x:' + (pinLeft + pinWidth / 2) + ', y:' + (pinTop + pinHeight + 22);
  window.popup.addressNode.value = addressValue;


  // Добавляет или убирает аттрибут disabled нодам формы
  var toggleDisabledOnFormNodes = function (formElementNodes, isDisabled) {
    var elementNodes = Array.prototype.slice.call(formElementNodes);

    elementNodes.forEach(function (elementNode) {
      elementNode.disabled = isDisabled;
    });
  };

  toggleDisabledOnFormNodes(window.popup.noticeFormNode, true);
  toggleDisabledOnFormNodes(window.popup.mapFiltersFormNode, true);


  var userFormNode = document.querySelector('.notice__form');

  var checkinSelectNode = userFormNode.querySelector('#timein');
  var checkoutSelectNode = userFormNode.querySelector('#timeout');

  var typeSelectNode = userFormNode.querySelector('#type');
  var priceInputNode = userFormNode.querySelector('#price');

  var numOfRoomsSelectNode = userFormNode.querySelector('#room_number');
  var capacitySelectNode = userFormNode.querySelector('#capacity');


  // При выборе опции селекта из первого параметра выбирает опцию с аналогичным значением у селекта из второго параметра
  var syncSelectNodesValue = function (changedSelect, syncingSelect) {
    var selectedValue = changedSelect.options[changedSelect.selectedIndex].value;

    for (var i = 0; i < syncingSelect.length; i += 1) {
      if (syncingSelect[i].value === selectedValue) {
        syncingSelect[i].selected = true;
        break;
      }
    }
  };

  // Задает минимальную цену за ночь
  var syncTypeWithMinPrice = function () {
    var selectedType = typeSelectNode.options[typeSelectNode.selectedIndex].value;
    priceInputNode.min = MIN_PRICES[selectedType];
    priceInputNode.placeholder = MIN_PRICES[selectedType];
  };

  var mapOfRoomsEnabled = {
    1: [0],
    2: [0, 1],
    3: [0, 1, 2],
    100: [3]
  };

  var syncRoomsWithGuests = function (mapSync) {
    var roomSelectValue = numOfRoomsSelectNode.options[numOfRoomsSelectNode.selectedIndex].value;
    var capacitySelectOptions = capacitySelectNode.querySelectorAll('option');
    toggleDisabledOnFormNodes(capacitySelectOptions, true);
    var enabledValues = mapSync[roomSelectValue];

    if (enabledValues && enabledValues.length) {
      enabledValues.forEach(function (optionNumber) {
        capacitySelectOptions[optionNumber].disabled = false;
      });

      if (roomSelectValue === '100') {
        capacitySelectOptions[3].selected = true;
      } else {
        capacitySelectOptions[enabledValues.length - 1].selected = true;
      }
    }
  };

  var onUserFormNodeChange = function (event) {
    var target = event.target;

    switch (target) {
      case checkinSelectNode:
        syncSelectNodesValue(checkinSelectNode, checkoutSelectNode);
        break;
      case checkoutSelectNode:
        syncSelectNodesValue(checkoutSelectNode, checkinSelectNode);
        break;
      case typeSelectNode:
        syncTypeWithMinPrice();
        break;
      case numOfRoomsSelectNode:
        syncRoomsWithGuests(mapOfRoomsEnabled);
        break;
    }
  };

  syncRoomsWithGuests(mapOfRoomsEnabled);
  userFormNode.addEventListener('change', onUserFormNodeChange);

  window.form = {
    toggleDisabledOnFormNodes: toggleDisabledOnFormNodes
  };
})();
