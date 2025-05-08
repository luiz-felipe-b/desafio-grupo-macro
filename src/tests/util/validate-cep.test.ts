import { describe, it, expect } from 'vitest';
import { validateCep } from '../../util/validate-cep.js';

describe('ValidateCep Utility', () => {
  it('should validate a correctly formatted CEP', () => {
    expect(() => validateCep('12345-678')).not.toThrow();
    expect(validateCep('12345-678')).toBe(true);
  });

  it('should throw error when CEP does not have a hyphen', () => {
    expect(() => validateCep('12345678')).toThrow('need-to-format-cep');
  });

  it('should throw error when CEP does not have 9 characters (including hyphen)', () => {
    expect(() => validateCep('1234-567')).toThrow('needs-nine-digits');
  });

  it('should throw error when CEP format is invalid', () => {
    expect(() => validateCep('1234a-678')).toThrow('invalid-cep');
    expect(() => validateCep('12345-67a')).toThrow('invalid-cep');
  });
});