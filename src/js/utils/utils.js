export default {
  /**
   * Generate an array of colors from dark to light.
   *
   * @param count
   * @return {Array}
   */
  generateGradualColors: count => {
    assert(typeof count === 'number' && count > 0, '`count` must be a positive integer.');

    let colors = [];
    let max = 256;// FF+1
    let pace = max / count;
    let counter = 0;

    for (let i = 0; i < count; i++) {
      let color = counter.toString(16) + '0000';
      if (color.length < 6) color = '0' + color;
      colors.push('#' + color);
      counter += pace;
    }

    return colors;
  },

  /**
   * Generate a matrix of colors from dark to light.
   *
   * @param rowCount
   * @return {Array} a square matrix with rowCount*rowCount color codes.
   */
  generateGradualColorMatrix: rowCount => {
    assert(typeof rowCount === 'number' && rowCount > 0, '`rowCount` must be a positive integer.');

    let colors = [];
    let max = 256;// FF+1
    let pace = max / rowCount;
    let rowCounter = 0;

    for (let i = 0; i < rowCount; i++) {
      let colCounter = 0;
      let row = [];
      for (let j = 0; j < rowCount; j++) {
        let red = rowCounter.toString(16);
        if (red.length < 2) red = '0' + red;
        let green = colCounter.toString(16);
        if (green.length < 2) green = '0' + green;
        row.push('#' + red + green + '00');
        colCounter += pace;
      }
      colors.push(row);
      rowCounter += pace;
    }

    return colors;
  },

  /**
   * @param color a string of hex number that represents R/G/B. e.g., "FF0000".
   * @return {string} the string value of the reverse color. e.g., "00FFFF".
   */
  getReverseColor: color => {
    assert(typeof color === 'string' && color.trim() !== '', '`color` must be a positive integer with hex format.');
    let code = color.replace(/#/g, ''), value = _.parseInt(code, 16);
    assert(!isNaN(value) && value >= 0 && value <= 0xFFFFFF, '`color` must be a positive integer with hex format between #000000 and #FFFFFF.');

    let result = '000000' + (0xFFFFFF - value).toString(16);
    return '#' + result.substring(result.length - 6, result.length);
  },

  /**
   * Create natural numbers sequence [1, 2, ..., n]
   *
   * @param count the count of numbers.
   * @return {number[]} the natural sequence.
   */
  generateNaturalSequence: count => {
    assert(_.isInteger(count) && count > 0,
      '`count` must be a positive integer.');

    return Array.from(new Array(count), (value, index) => index + 1);
  },

  /**
   * Create a two-dimension array of natural numbers.
   *
   *  [
   *   [1, 2, ..., k],
   *   ...,
   *   [..., n]
   * ]
   *
   * n = k ^ 2
   *
   * @param rowCount the length (k) of the matrix.
   * @return {number[][]} the matrix of natural numbers.
   */
  generateNaturalMatrix: rowCount => {
    assert(_.isInteger(rowCount) && rowCount > 0,
      '`rowCount` must be a positive integer.');

    return Array.from(new Array(rowCount), (value, rowIndex) =>
                      Array.from(new Array(rowCount), (value, colIndex) =>
                                 rowIndex * rowCount + colIndex + 1));
  },

  /**
   * Convert a two-dimension matrix to a one-dimension array.
   *
   * @param matrix a two-dimension array.
   * @return {Array} the flatted matrix in one-dimension array.
   */
  matrixToArray: matrix => {
    assert(_.isArray(matrix) && _.reduce(matrix, (accumulator, row) => accumulator && _.isArray(row)),
      '`matrix` must be a two-dimension array.');

    return _.reduce(matrix, (accumulator, row) => accumulator.concat(row));
  },

  /**
   * Convert an array of n^2 elements to a square matrix.
   *
   * @param array must be an array of n^2 elements.
   * @param (optional) count the length of the original array.
   * @param (optional) rowCount the length of the row count of the original matrix.
   * @return {number[][] | *[][]} a two-dimension square matrix.
   */
  arrayToMatrix: (array, count, rowCount) => {
    let rCount = Math.sqrt(array.length);
    assert(_.isArray(array) && array.length > 0 && _.isInteger(rCount),
      '`array` must be a one-dimension array of n^2 members.\n' +
      'Your `array` is: ' + array + '\n' +
      'There are ' + array.length + ' members in total.');

    if (count !== undefined || rowCount !== undefined) {
      assert(_.isInteger(count) && count > 0 &&
             _.isInteger(rowCount) && rowCount > 0 &&
             count === rowCount ** 2,
        '`count` and `rowCount` must be integers, and `count` must be a square of `rowCount`');
      assert(array.length === count,
        '`array` must be a one-dimension array of ' + count + ' members.\nYour `array` is: ' + array);
    }

    return Array.from(new Array(rCount), (val, rowIndex) =>
                      Array.from(new Array(rCount), (val, colIndex) =>
                                 array[rowIndex * rCount + colIndex]));
  }
}