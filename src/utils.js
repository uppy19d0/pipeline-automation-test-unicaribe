const utils = {
  arraySum(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Input must be an array');
    }
    return arr.reduce((sum, num) => {
      if (typeof num !== 'number') {
        throw new Error('All array elements must be numbers');
      }
      return sum + num;
    }, 0);
  },

  arrayAverage(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Input must be a non-empty array');
    }
    return this.arraySum(arr) / arr.length;
  },

  arrayMax(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Input must be a non-empty array');
    }
    return Math.max(...arr);
  },

  arrayMin(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Input must be a non-empty array');
    }
    return Math.min(...arr);
  },

  // String utilities
  capitalize(str) {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  reverseString(str) {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str.split('').reverse().join('');
  },

  isPalindrome(str) {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
  },

  isPrime(num) {
    if (typeof num !== 'number' || !Number.isInteger(num)) {
      throw new Error('Input must be an integer');
    }
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  },

  fibonacci(n) {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
      throw new Error('Input must be a non-negative integer');
    }
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  },

  // Date utilities
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!(date instanceof Date)) {
      throw new Error('Input must be a Date object');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  daysBetween(date1, date2) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error('Both inputs must be Date objects');
    }
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

module.exports = utils;
