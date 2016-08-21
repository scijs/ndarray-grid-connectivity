'use strict';

var assert = require('chai').assert;
var grid = require('../');
var ndarray = require('ndarray');
var fill = require('ndarray-fill');
var pool = require('ndarray-scratch');

// A note on the tests:
//
// Honestly, most of these tests are just based on visual confirmation
// via plotting with regl, so that the purpose of these tests is to
// ensure that the output doesn't change, not so much that it's obviously
// verified correct by long arrays of numbers.
//
// One exception: For 3+ dimensional arrays, the edges are duplicated by
// multiple faces. This should be optimized away, in which case these
// arrays would change slightly. If that's done, they should be confirmed
// visually and reentered here.
describe('ndarray-grid-connectivity', function () {
  it('2 x 2 x 2', function () {
    var A = pool.zeros([2, 2, 2]);
    var g = grid(A.pick(null, null, 0));
    assert.deepEqual(g, [0, 4, 2, 6, 0, 2, 4, 6]);
  });

  it('2 x 2 x 2 (nothing visible)', function () {
    var A = pool.zeros([2, 2, 2]);
    var g = grid(A.pick(null, null, 0), {visible: [false, false]});
    assert.deepEqual(g, []);
  });

  it('2 x 2 x 2 (dim 1 visible)', function () {
    var A = pool.zeros([2, 2, 2]);
    var g = grid(A.pick(null, null, 0), {visible: [true, false]});
    assert.deepEqual(g, [0, 4, 2, 6]);
  });

  it('2 x 2 x 2 (dim 2 visible)', function () {
    var A = pool.zeros([2, 2, 2]);
    var g = grid(A.pick(null, null, 0), {visible: [false, true]});
    assert.deepEqual(g, [0, 2, 4, 6]);
  });

  it('2 x 2 x 2 (transposed)', function () {
    var A = pool.zeros([2, 2, 2]).transpose(1, 0);
    var g = grid(A.pick(null, null, 0));
    assert.deepEqual(g, [0, 2, 4, 6, 0, 4, 2, 6]);
  });

  it('2 x 2 x 3', function () {
    var A = pool.zeros([2, 2, 3]);
    var g = grid(A.pick(null, null, 0));
    assert.deepEqual(g, [0, 6, 3, 9, 0, 3, 6, 9]);
  });

  it('3 x 4 x 3 (dim-1-stride)', function () {
    var A = pool.zeros([3, 4, 3]);
    var g = grid(A.pick(null, null, 0), {stride: [2, 1]});
    assert.deepEqual(g, [ 0, 12, 12, 24, 3, 15, 15,
      27, 6, 18, 18, 30, 9, 21, 21, 33, 0, 3, 3, 6,
      6, 9, 24, 27, 27, 30, 30, 33
    ]);
  });

  it('3 x 4 x 3 (dim-2-stride)', function () {
    var A = pool.zeros([2, 5, 3]);
    var g = grid(A.pick(null, null, 0), {stride: [1, 2]});
    assert.deepEqual(g, [ 0, 15, 6, 21, 12, 27, 0, 3, 3,
      6, 6, 9, 9, 12, 15, 18, 18, 21, 21, 24, 24, 27 ]
    );
  });

  it('2 x 2 x 4', function () {
    var A = pool.zeros([2, 2, 4]);
    var g = grid(A.pick(null, null, 0));
    assert.deepEqual(g, [0, 8, 4, 12, 0, 4, 8, 12]);
  });

  it('5 x 6 x 7', function () {
    var A = pool.zeros([3, 4, 1]);
    var g = grid(A.pick(null, null, 0));
    assert.deepEqual(g,
      [0, 4, 4, 8, 1, 5, 5, 9,
      2, 6, 6, 10, 3, 7, 7, 11,
      0, 1, 1, 2, 2, 3, 4, 5, 5,
      6, 6, 7, 8, 9, 9, 10, 10, 11
    ]);
  });

  it('2 x 3 x 4 x 3', function () {
    var A = pool.zeros([2, 3, 4, 3]);
    var g = grid(A.pick(null, null, null, 0));
    assert.deepEqual(g,
      [0, 36, 12, 48, 24, 60, 3, 39, 15, 51, 27, 63,
        6, 42, 18, 54, 30, 66, 9, 45, 21, 57, 33, 69, 0, 12,
        12, 24, 36, 48, 48, 60, 3, 15, 15, 27, 39, 51, 51, 63,
        6, 18, 18, 30, 42, 54, 54, 66, 9, 21, 21, 33, 45, 57,
        57, 69, 0, 3, 3, 6, 6, 9, 36, 39, 39, 42, 42, 45, 12,
        15, 15, 18, 18, 21, 48, 51, 51, 54, 54, 57, 24, 27, 27,
        30, 30, 33, 60, 63, 63, 66, 66, 69]
    );
  });
});
