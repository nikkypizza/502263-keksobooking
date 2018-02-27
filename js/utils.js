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
    }
  };
})();
