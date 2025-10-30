const utils = require('../src/utils');

describe('Utils', () => {
  describe('Array utilities', () => {
    describe('arraySum', () => {
      test('should sum array of numbers', () => {
        expect(utils.arraySum([1, 2, 3, 4])).toBe(10);
      });

      test('should handle empty array', () => {
        expect(utils.arraySum([])).toBe(0);
      });

      test('should handle negative numbers', () => {
        expect(utils.arraySum([-1, -2, 3])).toBe(0);
      });

      test('should throw error for non-array input', () => {
        expect(() => utils.arraySum('not an array')).toThrow('Input must be an array');
      });

      test('should throw error for non-number elements', () => {
        expect(() => utils.arraySum([1, '2', 3])).toThrow('All array elements must be numbers');
      });
    });

    describe('arrayAverage', () => {
      test('should calculate average correctly', () => {
        expect(utils.arrayAverage([2, 4, 6])).toBe(4);
      });

      test('should handle decimal averages', () => {
        expect(utils.arrayAverage([1, 2, 3])).toBe(2);
      });

      test('should throw error for empty array', () => {
        expect(() => utils.arrayAverage([])).toThrow('Input must be a non-empty array');
      });
    });

    describe('arrayMax', () => {
      test('should find maximum value', () => {
        expect(utils.arrayMax([1, 5, 3, 9, 2])).toBe(9);
      });

      test('should handle negative numbers', () => {
        expect(utils.arrayMax([-5, -1, -10])).toBe(-1);
      });

      test('should throw error for empty array', () => {
        expect(() => utils.arrayMax([])).toThrow('Input must be a non-empty array');
      });
    });

    describe('arrayMin', () => {
      test('should find minimum value', () => {
        expect(utils.arrayMin([1, 5, 3, 9, 2])).toBe(1);
      });

      test('should handle negative numbers', () => {
        expect(utils.arrayMin([-5, -1, -10])).toBe(-10);
      });

      test('should throw error for empty array', () => {
        expect(() => utils.arrayMin([])).toThrow('Input must be a non-empty array');
      });
    });
  });

  describe('String utilities', () => {
    describe('capitalize', () => {
      test('should capitalize first letter', () => {
        expect(utils.capitalize('hello')).toBe('Hello');
      });

      test('should handle already capitalized strings', () => {
        expect(utils.capitalize('Hello')).toBe('Hello');
      });

      test('should handle all caps', () => {
        expect(utils.capitalize('HELLO')).toBe('Hello');
      });

      test('should throw error for non-string input', () => {
        expect(() => utils.capitalize(123)).toThrow('Input must be a string');
      });
    });

    describe('reverseString', () => {
      test('should reverse string correctly', () => {
        expect(utils.reverseString('hello')).toBe('olleh');
      });

      test('should handle empty string', () => {
        expect(utils.reverseString('')).toBe('');
      });

      test('should handle single character', () => {
        expect(utils.reverseString('a')).toBe('a');
      });

      test('should throw error for non-string input', () => {
        expect(() => utils.reverseString(123)).toThrow('Input must be a string');
      });
    });

    describe('isPalindrome', () => {
      test('should identify palindromes', () => {
        expect(utils.isPalindrome('racecar')).toBe(true);
        expect(utils.isPalindrome('A man a plan a canal Panama')).toBe(true);
      });

      test('should identify non-palindromes', () => {
        expect(utils.isPalindrome('hello')).toBe(false);
      });

      test('should handle empty string', () => {
        expect(utils.isPalindrome('')).toBe(true);
      });

      test('should throw error for non-string input', () => {
        expect(() => utils.isPalindrome(123)).toThrow('Input must be a string');
      });
    });
  });

  describe('Number utilities', () => {
    describe('isPrime', () => {
      test('should identify prime numbers', () => {
        expect(utils.isPrime(2)).toBe(true);
        expect(utils.isPrime(3)).toBe(true);
        expect(utils.isPrime(17)).toBe(true);
      });

      test('should identify non-prime numbers', () => {
        expect(utils.isPrime(1)).toBe(false);
        expect(utils.isPrime(4)).toBe(false);
        expect(utils.isPrime(15)).toBe(false);
      });

      test('should handle negative numbers', () => {
        expect(utils.isPrime(-5)).toBe(false);
      });

      test('should throw error for non-integer input', () => {
        expect(() => utils.isPrime(3.5)).toThrow('Input must be an integer');
        expect(() => utils.isPrime('3')).toThrow('Input must be an integer');
      });
    });

    describe('fibonacci', () => {
      test('should calculate fibonacci numbers', () => {
        expect(utils.fibonacci(0)).toBe(0);
        expect(utils.fibonacci(1)).toBe(1);
        expect(utils.fibonacci(5)).toBe(5);
        expect(utils.fibonacci(10)).toBe(55);
      });

      test('should throw error for negative numbers', () => {
        expect(() => utils.fibonacci(-1)).toThrow('Input must be a non-negative integer');
      });

      test('should throw error for non-integer input', () => {
        expect(() => utils.fibonacci(3.5)).toThrow('Input must be a non-negative integer');
      });
    });
  });

  describe('Date utilities', () => {
    describe('formatDate', () => {
      test('should format date with default format', () => {
        const date = new Date('2023-12-25');
        expect(utils.formatDate(date)).toBe('2023-12-25');
      });

      test('should format date with custom format', () => {
        const date = new Date('2023-12-25');
        expect(utils.formatDate(date, 'DD/MM/YYYY')).toBe('25/12/2023');
      });

      test('should throw error for non-Date input', () => {
        expect(() => utils.formatDate('2023-12-25')).toThrow('Input must be a Date object');
      });
    });

    describe('daysBetween', () => {
      test('should calculate days between dates', () => {
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-01-11');
        expect(utils.daysBetween(date1, date2)).toBe(10);
      });

      test('should handle reverse order', () => {
        const date1 = new Date('2023-01-11');
        const date2 = new Date('2023-01-01');
        expect(utils.daysBetween(date1, date2)).toBe(10);
      });

      test('should throw error for non-Date inputs', () => {
        const date = new Date();
        expect(() => utils.daysBetween('2023-01-01', date)).toThrow('Both inputs must be Date objects');
        expect(() => utils.daysBetween(date, '2023-01-01')).toThrow('Both inputs must be Date objects');
      });
    });
  });
});
