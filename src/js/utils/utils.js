export default {
  /**
   * Generate an array of colors from ligth to dark.
   *
   * @param count
   * @return {Array}
   */
  generateGradualColors: (count) => {
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
   * @param color a string of hex number that represents R/G/B. e.g., "FF0000".
   * @return {string} the string value of the reverse color. e.g., "00FFFF".
   */
  getReverseColor: (color) => {
    assert(typeof color === 'string' && color.trim() !== '', '`color` must be a positive integer with hex format.');
    let code = color.replace(/#/g, ''), value = _.parseInt(code, 16);
    assert(!isNaN(value) && value >= 0 && value <= 0xFFFFFF, '`color` must be a positive integer with hex format between #000000 and #FFFFFF.');

    let result = '000000' + (0xFFFFFF - value).toString(16);
    return '#' + result.substring(result.length - 6, result.length);
  }
}