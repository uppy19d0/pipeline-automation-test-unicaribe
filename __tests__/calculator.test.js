const Calculator = require('../src/calculator');

describe('Calculator', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(Calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(Calculator.add(-2, -3)).toBe(-5);
    });

    test('should add positive and negative numbers', () => {
      expect(Calculator.add(5, -3)).toBe(2);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.add('2', 3)).toThrow('Both arguments must be numbers');
      expect(() => Calculator.add(2, '3')).toThrow('Both arguments must be numbers');
    });
  });

  describe('subtract', () => {
    test('should subtract two numbers', () => {
      expect(Calculator.subtract(5, 3)).toBe(2);
    });

    test('should handle negative results', () => {
      expect(Calculator.subtract(3, 5)).toBe(-2);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.subtract('5', 3)).toThrow('Both arguments must be numbers');
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(Calculator.multiply(4, 5)).toBe(20);
    });

    test('should multiply by zero', () => {
      expect(Calculator.multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(Calculator.multiply(-3, -4)).toBe(12);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.multiply(4, '5')).toThrow('Both arguments must be numbers');
    });
  });

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(Calculator.divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(Calculator.divide(7, 2)).toBe(3.5);
    });

    test('should throw error for division by zero', () => {
      expect(() => Calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.divide('10', 2)).toThrow('Both arguments must be numbers');
    });
  });

  describe('power', () => {
    test('should calculate power correctly', () => {
      expect(Calculator.power(2, 3)).toBe(8);
    });

    test('should handle power of zero', () => {
      expect(Calculator.power(5, 0)).toBe(1);
    });

    test('should handle negative exponents', () => {
      expect(Calculator.power(2, -2)).toBe(0.25);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.power('2', 3)).toThrow('Both arguments must be numbers');
    });
  });

  describe('sqrt', () => {
    test('should calculate square root correctly', () => {
      expect(Calculator.sqrt(9)).toBe(3);
      expect(Calculator.sqrt(16)).toBe(4);
    });

    test('should handle zero', () => {
      expect(Calculator.sqrt(0)).toBe(0);
    });

    test('should throw error for negative numbers', () => {
      expect(() => Calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });

    test('should throw error for non-number inputs', () => {
      expect(() => Calculator.sqrt('9')).toThrow('Argument must be a number');
    });
  });

  describe('factorial', () => {
    test('should calculate factorial correctly', () => {
      expect(Calculator.factorial(0)).toBe(1);
      expect(Calculator.factorial(1)).toBe(1);
      expect(Calculator.factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => Calculator.factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });

    test('should throw error for non-integers', () => {
      expect(() => Calculator.factorial(3.5)).toThrow('Argument must be an integer');
      expect(() => Calculator.factorial('5')).toThrow('Argument must be an integer');
    });
  });
});
