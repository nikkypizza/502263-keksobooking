'use strict';

(function () {
  window.utils = {
    // Добавляет 0, если num = число однозначное
    addZero: function (num) {
      return (num < 10 ? '0' : '') + num;
    },

    // Делает чило кратным 100. Срежем мелочь от рандомной цены
    roundTo100: function (num) {
      return Math.round(num / 100) * 100;
    },

    // Генерирует случайное число от min до max. Если третий параметр = true, то включает max
    getRandomNumber: function (min, max, includeMax) {
      var addMax = includeMax ? 1 : 0;
      return Math.floor(Math.random() * (max - min + addMax) + min);
    },

    // Возвращает массив значений произвольной длины
    getArrayOfRandomLength: function (srcArray) {
      var randomLength = this.getRandomNumber(0, srcArray.length, true);
      return srcArray.slice(0, randomLength);
    },

    // Возвращает случайный элемент массива
    getRandomElem: function (srcArray) {
      return srcArray[window.utils.getRandomNumber(0, srcArray.length)];
    },

    /* Возвращает перемешаный массив
     Тасование Фишера — Йетса      */
    getShuffleArray: function (array) {
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
    },

    enableDragging: function (dragElem, callback) {
      var dragElemHalfWidth = dragElem.offsetWidth / 2;
      var dragElemHalfHeight = dragElem.offsetHeight / 2;

      var dragLimits = {
        x: {
          left: -dragElemHalfWidth,
          right: -dragElemHalfWidth
        },
        y: {
          top: 100,
          bottom: 15
        }
      };

      var limits = Object.assign(dragLimits);

      dragElem.addEventListener('mousedown', function (event) {
        event.preventDefault();

        var clickInsideElemOffset = {
          x: event.clientX - dragElem.offsetLeft,
          y: event.clientY - dragElem.offsetTop
        };

        // Меньше этих значений драг идти не будет
        var minCoords = {
          x: dragElemHalfWidth + limits.x.left,
          y: dragElemHalfHeight + limits.y.top
        };

        // Значения родительского элемента. Больше этих значений драг идти не будет
        var maxCoords = {
          x: dragElem.parentNode.offsetWidth - dragElemHalfWidth - limits.x.right,
          y: dragElem.parentNode.offsetHeight - dragElemHalfHeight - limits.y.bottom
        };


        var onElemHandlerMouseMove = function (moveEvent) {
          // Здесь новые координаты перемещаемого элемента, которыми обновляется элемент
          var moveCoords = {
            x: moveEvent.clientX - clickInsideElemOffset.x,
            y: moveEvent.clientY - clickInsideElemOffset.y
          };

          var movedElemNewPosition = {
            x: Math.max(minCoords.x, Math.min(moveCoords.x, maxCoords.x)),
            y: Math.max(minCoords.y, Math.min(moveCoords.y, maxCoords.y))
          };

          // Назначает новые координаты в зависимости от ширины и высоты родительского элемента
          dragElem.style.left = movedElemNewPosition.x + 'px';
          dragElem.style.top = movedElemNewPosition.y + 'px';

          if (typeof callback === 'function') {
            callback(movedElemNewPosition);
          }
        };

        var onElemHandlerMouseUp = function () {
          document.removeEventListener('mousemove', onElemHandlerMouseMove);
          document.removeEventListener('mouseup', onElemHandlerMouseUp);
        };

        document.addEventListener('mousemove', onElemHandlerMouseMove);
        document.addEventListener('mouseup', onElemHandlerMouseUp);
      });
    }
  };
})();
