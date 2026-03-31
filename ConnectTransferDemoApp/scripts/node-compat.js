/*
 * Runtime compatibility shim for Node 18 when running RN 0.84 tooling.
 * RN/Metro expect modern Array copy methods and performance clear APIs.
 */

(function applyNodeCompatPolyfills() {
  try {
    const nodeUtil = require('node:util');
    if (typeof nodeUtil.styleText !== 'function') {
      nodeUtil.styleText = function styleText(_styles, text) {
        return String(text);
      };
    }
  } catch (_error) {
    // Ignore if util cannot be patched in this runtime.
  }

  if (!Array.prototype.toReversed) {
    Object.defineProperty(Array.prototype, 'toReversed', {
      value: function toReversed() {
        return this.slice().reverse();
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  if (!Array.prototype.toSorted) {
    Object.defineProperty(Array.prototype, 'toSorted', {
      value: function toSorted(compareFn) {
        return this.slice().sort(compareFn);
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  if (!Array.prototype.toSpliced) {
    Object.defineProperty(Array.prototype, 'toSpliced', {
      value: function toSpliced(start, deleteCount) {
        const copy = this.slice();
        const items = Array.prototype.slice.call(arguments, 2);
        copy.splice(start, deleteCount, ...items);
        return copy;
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  if (!Array.prototype.with) {
    Object.defineProperty(Array.prototype, 'with', {
      value: function withAt(index, value) {
        const copy = this.slice();
        const normalizedIndex = index < 0 ? copy.length + index : index;
        if (normalizedIndex < 0 || normalizedIndex >= copy.length) {
          throw new RangeError('Invalid index');
        }
        copy[normalizedIndex] = value;
        return copy;
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }

  if (typeof globalThis.performance === 'object' && globalThis.performance) {
    if (typeof globalThis.performance.clearMarks !== 'function') {
      globalThis.performance.clearMarks = function clearMarks() {};
    }
    if (typeof globalThis.performance.clearMeasures !== 'function') {
      globalThis.performance.clearMeasures = function clearMeasures() {};
    }
  }
})();
