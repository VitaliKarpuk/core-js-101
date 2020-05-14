/* *********************************************************************************************
 *                                                                                             *
 * Plese read the following tutorial before implementing tasks:                                *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions                     *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments       *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures                            *
 *                                                                                             *
 ********************************************************************************************* */


/**
 * Returns the functions composition of two specified functions f(x) and g(x).
 * The result of compose is to be a function of one argument, (lets call the argument x),
 * which works like applying function f to the result of applying function g to x, i.e.
 *  getComposition(f,g)(x) = f(g(x))
 *
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 *
 * @example
 *   getComposition(Math.sin, Math.asin)(x) => Math.sin(Math.asin(x))
 *
 */
function getComposition(f, g) {
  return function foo(x) {
    return f(g(x));
  };
}


/**
 * Returns the math power function with the specified exponent
 *
 * @param {number} exponent
 * @return {Function}
 *
 * @example
 *   const power2 = getPowerFunction(2); // => x^2
 *   power2(2) => 4
 *   power2(4) => 16
 *
 *   const power05 = getPowerFunction(0.5); // => x^0.5
 *   power05(4) => 2
 *   power05(16) => 4
 *
 */
function getPowerFunction(exponent) {
  return function foo(x) {
    // eslint-disable-next-line no-restricted-properties
    return Math.pow(x, exponent);
  };
}


/**
 * Returns the polynom function of one argument based on specified coefficients.
 * See: https://en.wikipedia.org/wiki/Polynomial#Definition
 *
 * @params {integer}
 * @return {Function}
 *
 * @example
 *   getPolynom(2,3,5) => y = 2*x^2 + 3*x + 5
 *   getPolynom(1,-3)  => y = x - 3
 *   getPolynom(8)     => y = 8
 *   getPolynom()      => null
 */
// eslint-disable-next-line consistent-return
function getPolynom(...arg) {
  if (arg.length === 1) {
    // eslint-disable-next-line no-param-reassign
    arg[1] = 0;
    // eslint-disable-next-line no-param-reassign
    arg[2] = 0;
    // eslint-disable-next-line no-inner-declarations
    function f() {
      return arg[0];
    }
    return f;
  }

  if (arg.length === 2) {
    // eslint-disable-next-line no-param-reassign
    arg[2] = 0;
    // eslint-disable-next-line no-inner-declarations
    function f(x) {
      return arg[0] * x + arg[1];
    }
    return f;
  }

  if (arg.length === 3) {
    // eslint-disable-next-line no-inner-declarations
    function f(x) {
      if (arg[0] === undefined) return null;

      return arg[0] * x * x + arg[1] * x + arg[2];
    }
    return f;
  }
  return null;
}


/**
 * Memoizes passed function and returns function
 * which invoked first time calls the passed function and then always returns cached result.
 *
 * @params {Function} func - function to memoize
 * @return {Function} memoized function
 *
 * @example
 *   const memoizer = memoize(() => Math.random());
 *   memoizer() => some random number  (first run, evaluates the result of Math.random())
 *   memoizer() => the same random number  (second run, returns the previous cached result)
 *   ...
 *   memoizer() => the same random number  (next run, returns the previous cached result)
 */
function memoize(func) {
  const cache = new Map();

  return function foo(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    const res = func(x);
    cache.set(x, res);
    return res;
  };
}


/**
 * Returns the function trying to call the passed function and if it throws,
 * retrying it specified number of attempts.
 *
 * @param {Function} func
 * @param {number} attempts
 * @return {Function}
 *
 * @example
 * const attempt = 0, retryer = retry(() => {
 *      if (++attempt % 2) throw new Error('test');
 *      else return attempt;
 * }, 2);
 * retryer() => 2
 */
function retry(func, attempts) {
  let count = 0;
  try {
    func();
    count = 1 + count;
    return func;
  } catch (e) {
    try {
      if (count === attempts) return attempts;
      func();
      count = 1 + count;
      return func;
    } catch (e1) {
      if (count === attempts) return attempts;
      func();
      count = 1 + count;
      return func;
    }
  }
}


/**
 * Returns the logging wrapper for the specified method,
 * Logger has to log the start and end of calling the specified function.
 * Logger has to log the arguments of invoked function.
 * The fromat of output log is:
 * <function name>(<arg1>, <arg2>,...,<argN>) starts
 * <function name>(<arg1>, <arg2>,...,<argN>) ends
 *
 *
 * @param {Function} func
 * @param {Function} logFunc - function to output log with single string argument
 * @return {Function}
 *
 * @example
 *
 * const cosLogger = logger(Math.cos, console.log);
 * const result = cosLogger(Math.PI));     // -1
 *
 * log from console.log:
 * cos(3.141592653589793) starts
 * cos(3.141592653589793) ends
 *
 */
function logger(func, logFunc) {
  // eslint-disable-next-line consistent-return
  return function wrapper(...args1) {
    const arr = args1;
    if (args1.length === 1) {
      logFunc(`${func.name}(${[...arr]}) starts`);
      logFunc(`${func.name}(${[...arr]}) ends`);
      return func(...args1);
    }
    // ===================================================
    const x = arr.slice(0, arr.length - 1);
    const xMap = x[0].map((item) => {
      if ((typeof item) === 'string') {
        return `"${item}"`;
      }
      return item;
    });
    logFunc(`${func.name}([${xMap}],${+arr[arr.length - 1]}) starts`);
    return (function f() {
      const x2 = func(...args1);
      logFunc(`${func.name}([${xMap}],${arr[arr.length - 1]}) ends`);
      return x2;
    }());
  };
}


/**
 * Return the function with partial applied arguments
 *
 * @param {Function} fn
 * @return {Function}
 *
 * @example
 *   const fn = function(x1,x2,x3,x4) { return  x1 + x2 + x3 + x4; };
 *   partialUsingArguments(fn, 'a')('b','c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b')('c','d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c')('d') => 'abcd'
 *   partialUsingArguments(fn, 'a','b','c','d')() => 'abcd'
 */
function partialUsingArguments(fn, ...args1) {
  function f(...args) {
    const str = `${args1.join('')}${args.join('')}`;
    return str;
  }
  return f;
}


/**
 * Returns the id generator function that returns next integer starting
 * from specified number every time when invoking.
 *
 * @param {Number} startFrom
 * @return {Function}
 *
 * @example
 *   const getId4 = getIdGenerator(4);
 *   const getId10 = gerIdGenerator(10);
 *   getId4() => 4
 *   getId10() => 10
 *   getId4() => 5
 *   getId4() => 6
 *   getId4() => 7
 *   getId10() => 11
 */
function getIdGeneratorFunction(startFrom) {
  let count = 0;
  let flag;
  function wrapper() {
    if (flag) count = 1 + count;
    flag = true;
    return startFrom + count;
  }
  return wrapper;
}


module.exports = {
  getComposition,
  getPowerFunction,
  getPolynom,
  memoize,
  retry,
  logger,
  partialUsingArguments,
  getIdGeneratorFunction,
};
