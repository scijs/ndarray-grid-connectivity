'use strict';

module.exports = ndarrayGridGeometry;

function ndarrayGridGeometry (grid, options) {
  options = options || {};

  var draws = [];
  var lines = [];
  var dim, i, j, cursor, total;
  var lineSlice, ptr, pptr;
  var shape, slice;
  var setupMesh, drawProps;
  var dims = grid.dimension;

  if (options.stride) {
    if (!Array.isArray(options.stride[0])) {
      var cpy = options.stride.slice();
      options.stride = [];
      for (i = 0; i < dims; i++) {
        options.stride.push(cpy);
      }
    }
  }

  if (options.offset) {
    if (!Array.isArray(options.offset[0])) {
      var cpy = options.offset.slice();
      options.offset = [];
      for (i = 0; i < dims; i++) {
        options.offset.push(cpy);
      }
    }
  }

  for (dim = 0; dim < dims; dim++) {
    if (options.visible && !options.visible[dim]) continue;
    shape = [];
    slice = [];
    for (i = 0; i < dims; i++) {
      if (i === dim) {
        slice.push(null);
      } else {
        shape.push(grid.shape[i]);
        slice.push(0);
      }
    }
    slice.push(null);
    cursor = 0;
    total = shape.reduce((i, j) => i * j, 1);
    while (cursor < total) {
      cursor++;

      var dothis = true;
      if (options.stride) {
        for (i = 0, j = 0; i < dims; i++) {
          if (i === dim) continue;
          var idx = slice[i];
          if (options.offset) {
            idx -= options.offset[dim][i];
          }
          if (idx % options.stride[dim][i] !== 0) {
            dothis = false;
            break;
          }
        }
      }

      if (!options.stride || dothis) {
        lineSlice = grid.pick.apply(grid, slice);

        pptr = ptr = lineSlice.offset;
        for (j = 1; j < lineSlice.shape[0]; j++) {
          ptr += lineSlice.stride[0];
          lines.push(pptr)
          lines.push(ptr);
          pptr = ptr;
        }
      }

      for (i = 0; i < dims; i++) {
        if (i === dim) continue;
        slice[i]++;
        if (slice[i] >= grid.shape[i]) {
          slice[i] = 0;
        } else {
          break;
        }
      }
    }
  }

  return lines;
}
