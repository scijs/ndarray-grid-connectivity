var grid = require('../');
var zeros = require('ndarray-scratch').zeros;

var A = zeros([2, 2, 3])
console.log(grid(A.pick(null, null, 0)));
// => [
//  0, 6,
//  3, 9,
//  0, 3,
//  6, 9
// ]

console.log('A.stride[2]:', A.stride[2]);
// => 1
