import Constants from '../../utils/constants';

/**
 * Define an array `[1, 2, ..., n]`, that `n = 2 ^ k`, and a series of methods to compute folding result.
 * Here k is the `power`: given k=1, there are two numbers; given k=2, there are four numbers; given k=3, there are
 * eight numbers... etc.
 *
 * @param power the exponent of the number of the elements.
 * @constructor
 */
function Folding(power) {
  assert(typeof power === 'number' && power > 0, '`power` must be an positive integer.');

  this.count = Math.pow(2, power); // n = 2 ^ k
  this.original = Array.from(new Array(this.count), (val, index) => index + 1); // create [1, 2, ..., n]
  this.final = this.original;
  this.steps = [this.original.map(n => [n])];
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

  // Split the piles into half and half.
  let firstHalf = _.take(piles, halfLength);
  let laterHalf = _.takeRight(piles, halfLength);

  // Reverse the second half piles
  let reversedLaterHalf = _.each(_.reverse(laterHalf), function(pile) {
    return _.reverse(pile); // and then also reverse each pile
  });

  // Merge the two halves
  let result = [];
  for (let i = 0; i < firstHalf.length; i++) {
    result.push(_.concat(firstHalf[i], reversedLaterHalf[i]));
  }

  // Save each step.
  steps && steps.push(result);

  // Then folding the result array recursively.
  return doFoldingByRecursive(result, steps);
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
         '`algorithm` must be a flag defined in `Constants`, and it can be just omitted.');

  if (this.computeDone) return this.final;

  let result = this.original;
  switch (algorithm) {
    case Constants.ALGORITHM_RECURCIVE:
    default:
      result = doFoldingByRecursive(this.steps[0], this.steps)[0];
  }
  this.final = result;
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

  assert(typeof x === 'number' && x >= 1 && x <= this.count, 'the number `x` must be between 1 and ' + this.count);
  return _.indexOf(this.final, x) + 1;
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

  assert(typeof p === 'number' && p >= 1 && p <= this.count, 'the position `p` must be between 1 and ' + this.count);
  return this.final[p - 1];
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