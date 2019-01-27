import Constants from '../../utils/constants';

/**
 * Define an array `[1, 2, ..., n]`, that `n = 4 ^ k`, and a series of methods to compute folding result.
 * Here k is the `power`: given k=1, there are four numbers; given k=2, there are sixteen numbers; given k=3, there are
 * sixty-four numbers... etc.
 *
 * @param power the exponent of the number of the elements.
 * @constructor
 */
function Folding(power) {
  assert(typeof power === 'number' && power > 0, '`power` must be an positive integer.');

  this.power = power;
  this.count = 4 ** power; // n = 4 ^ k
  this.rowCount = 2 ** power;
  // build up a two-dimension array [[1, 2, ..., 2k], ..., [..., n]]
  this.original = Array.from(new Array(this.rowCount), (val, rowIndex) =>
                             Array.from(new Array(this.rowCount), (val, colIndex) =>
                                        rowIndex * this.rowCount + colIndex + 1));
  // the final array is one-dimension
  this.final = this.original;
  this.finalFlat = this.original.reduce((accumulator, currentValue) => accumulator.concat(currentValue));
  this.steps = [this.final.map(row => row.map(number => [number]))];// steps is 4-dimension array
  this.computeDone = false; // expected to true when computing done.
}

/**
 * Recursive computing of folding.
 *
 * @param piles a two-dimension array that represents the piles of each step of folding/merging,
 * and each pile is composed of the current result.
 * Example: [[x, x], [x, x], [x, x], [x, x]]
 * @return {number[][]} the two-dimension array of the merge result.
 */
function doFoldingByRecursive(piles, steps) {
  if (piles.length === 1) return piles;
  let halfLength = piles.length / 2;

  /* Step 1: fold the lower half to upper */
  // Split the piles into half and half.
  let result1 = [];
  let firstHalf = _.take(piles, halfLength);
  let laterHalf = _.takeRight(piles, halfLength);

  // Reverse the second half piles and then also reverse each inner pile
  let reversedLaterHalf = _.each(_.reverse(laterHalf), row => _.each(row, column => _.reverse(column)));

  // Merge the two halves
  _.each(firstHalf, (row, rowIndex) => {
    let newFirstHalf = _.map(row, (unit, colIndex) => _.concat(unit, reversedLaterHalf[rowIndex][colIndex]));
    result1.push(newFirstHalf);
  });

  // Save each step.
  // Recursive call will change the passed-in `result`, so here must save a full copy.
  steps && steps.push(_.cloneDeep(result1));

  /* Step 2: fold the right half to left */
  let result2 = [];
  _.each(result1, row => {
    // Split the piles into half and half.
    let firstHalfInRow = _.take(row, halfLength);
    let laterHalfInRow = _.takeRight(row, halfLength);

    // Reverse the second half piles
    let reversedLaterHalfInRow = _.each(_.reverse(laterHalfInRow), unit => {
      return _.reverse(unit); // and then also reverse each unit
    });

    // Merge the two halves
    let nextTurnRows = [];
    _.each(firstHalfInRow, (unit, index) => {
      nextTurnRows.push(_.concat(unit, reversedLaterHalfInRow[index]));
    });
    result2.push(nextTurnRows);
  });

  // Save each step.
  // Recursive call will change the passed-in `result`, so here must save a full copy.
  steps && steps.push(_.cloneDeep(result2));

  // Then folding the result array recursively.
  return doFoldingByRecursive(result2, steps);
}

/**
 * Build the original array before computing.
 *
 * @return {number[] | *} the original array.
 */
Folding.prototype.init = function() {
  return this.original;
};

/**
 * @return {number | *} the total count of numbers.
 */
Folding.prototype.getCount = function() {
  return this.count;
};

/**
 * @return {number | *} the rows count of the result matrix.
 */
Folding.prototype.getRowCount = function() {
  return this.rowCount;
};

/**
 * @return {boolean} true if computation is finished.
 */
Folding.prototype.isComputeDone = function() {
  return this.computeDone;
};

/**
 * Give the result of the first-order folading problem.
 *
 * @param algorithm (optional) By default, `recursive` is used.
 * @return {number[]}
 */
Folding.prototype.compute = function(algorithm) {
  assert(!algorithm || typeof algorithm === 'string',
    '`algorithm` must be a flag defined in `Constants`, and it can be just omitted.\nYour algorithm: ' + algorithm);

  if (this.computeDone) return this.final;

  let result = this.original;
  switch (algorithm) {
    case Constants.algorithm.RECURSIVE:
    default:
      result = doFoldingByRecursive(this.steps[0], this.steps)[0];
  }
  this.final = result;
  this.finalFlat = result.reduce((accumulator, currentValue) => accumulator.concat(currentValue));
  this.computeDone = true;
  return result;
};

/**
 * Give the position of an original number in the final sequence.
 * You must run `compute()` first.
 *
 * @param x the original number from 1 to 2^k.
 * @return {number} the position of an original number in the final sequence.
 */
Folding.prototype.positionOf = function(x) {
  if (!this.computeDone) return 1;

  assert(typeof x === 'number' && x >= 1 && x <= this.count, 'the number `x` must be between 1 and ' + this.count + '\nYour number x is: ' + x);
  return _.indexOf(this.finalFlat, x) + 1;
};

/**
 * Give the number of position p in the final sequence.
 * You must run `compute()` first.
 *
 * @param p the position in the final sequence.
 * @return {number} the value on the given position.
 */
Folding.prototype.valueOf = function(p) {
  if (!this.computeDone) return 1;

  assert(typeof p === 'number' && p >= 1 && p <= this.count, 'the position `p` must be between 1 and ' + this.count + '\nYour position p is: ' + p);
  return this.finalFlat[p - 1];
};

/**
 * You must run `compute()` first.
 *
 * @return {Array} All steps in the process of computation.
 */
Folding.prototype.getSteps = function() {
  return this.steps;
};

export default Folding;