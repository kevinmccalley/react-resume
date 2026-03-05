import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

describe('setupTests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    document.body.className = '';
  });

  afterEach(() => {
    document.body.className = '';
    localStorage.clear();
  });

  describe('localStorage mock', () => {
    it('should set and get items from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    it('should return null for non-existent keys', () => {
      expect(localStorage.getItem('nonExistentKey')).toBeNull();
    });

    it('should remove items from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      localStorage.removeItem('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });

    it('should convert values to string when setting items', () => {
      localStorage.setItem('numberKey', 123);
      expect(localStorage.getItem('numberKey')).toBe('123');
      expect(typeof localStorage.getItem('numberKey')).toBe('string');
    });

    it('should handle boolean values by converting to string', () => {
      localStorage.setItem('boolKey', true);
      expect(localStorage.getItem('boolKey')).toBe('true');
    });

    it('should handle null string values', () => {
      localStorage.setItem('nullKey', null);
      expect(localStorage.getItem('nullKey')).toBe('null');
    });

    it('should handle undefined values by converting to string', () => {
      localStorage.setItem('undefinedKey', undefined);
      expect(localStorage.getItem('undefinedKey')).toBe('undefined');
    });

    it('should handle empty string values', () => {
      localStorage.setItem('emptyKey', '');
      expect(localStorage.getItem('emptyKey')).toBe('');
    });

    it('should allow overwriting existing keys', () => {
      localStorage.setItem('key', 'value1');
      localStorage.setItem('key', 'value2');
      expect(localStorage.getItem('key')).toBe('value2');
    });
  });

  describe('IntersectionObserver mock', () => {
    it('should create an IntersectionObserver instance', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(observer).toBeDefined();
      expect(observer).toBeInstanceOf(window.IntersectionObserver);
    });

    it('should have observe method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(typeof observer.observe).toBe('function');
    });

    it('should have unobserve method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(typeof observer.unobserve).toBe('function');
    });

    it('should have disconnect method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(typeof observer.disconnect).toBe('function');
    });

    it('observe method should be callable without errors', () => {
      const observer = new window.IntersectionObserver(() => {});
      const element = document.createElement('div');
      expect(() => observer.observe(element)).not.toThrow();
    });

    it('unobserve method should be callable without errors', () => {
      const observer = new window.IntersectionObserver(() => {});
      const element = document.createElement('div');
      expect(() => observer.unobserve(element)).not.toThrow();
    });

    it('disconnect method should be callable without errors', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(() => observer.disconnect()).not.toThrow();
    });
  });

  describe('matchMedia mock', () => {
    it('should return a MediaQueryList-like object', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(mediaQueryList).toBeDefined();
      expect(typeof mediaQueryList).toBe('object');
    });

    it('should have matches property set to false by default', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(mediaQueryList.matches).toBe(false);
    });

    it('should have addListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(typeof mediaQueryList.addListener).toBe('function');
    });

    it('should have removeListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(typeof mediaQueryList.removeListener).toBe('function');
    });

    it('should have addEventListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(typeof mediaQueryList.addEventListener).toBe('function');
    });

    it('should have removeEventListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(typeof mediaQueryList.removeEventListener).toBe('function');
    });

    it('should have dispatchEvent method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(typeof mediaQueryList.dispatchEvent).toBe('function');
    });

    it('dispatchEvent should return false', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      const result = mediaQueryList.dispatchEvent(new Event('change'));
      expect(result).toBe(false);
    });

    it('addListener should be callable without errors', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      const listener = () => {};
      expect(() => mediaQueryList.addListener(listener)).not.toThrow();
    });

    it('removeListener should be callable without errors', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      const listener = () => {};
      expect(() => mediaQueryList.removeListener(listener)).not.toThrow();
    });

    it('addEventListener should be callable without errors', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      const listener = () => {};
      expect(() => mediaQueryList.addEventListener('change', listener)).not.toThrow();
    });

    it('removeEventListener should be callable without errors', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      const listener = () => {};
      expect(() => mediaQueryList.removeEventListener('change', listener)).not.toThrow();
    });

    it('should handle multiple query strings', () => {
      const mql1 = window.matchMedia('(max-width: 768px)');
      const mql2 = window.matchMedia('(min-width: 769px)');
      expect(mql1.matches).toBe(false);
      expect(mql2.matches).toBe(false);
    });
  });

  describe('DOM cleanup between tests', () => {
    it('should reset body className', () => {
      document.body.className = 'test-class another-class';
      // afterEach hook will reset this
      expect(document.body.className).not.toBe('');
    });

    it('body className should be empty after previous test', () => {
      expect(document.body.className).toBe('');
    });

    it('should clear localStorage after previous test', () => {
      localStorage.setItem('previousTest', 'value');
      // afterEach hook will clear this
      expect(localStorage.getItem('previousTest')).not.toBeNull();
    });

    it('localStorage should be empty after previous test', () => {
      expect(localStorage.getItem('previousTest')).toBeNull();
    });
  });

  describe('window.localStorage property', () => {
    it('should be defined on window object', () => {
      expect(window.localStorage).toBeDefined();
    });

    it('should be an object with expected methods', () => {
      expect(typeof window.localStorage.getItem).toBe('function');
      expect(typeof window.localStorage.setItem).toBe('function');
      expect(typeof window.localStorage.removeItem).toBe('function');
      expect(typeof window.localStorage.clear).toBe('function');
    });
  });

  describe('window.IntersectionObserver property', () => {
    it('should be defined on window object', () => {
      expect(window.IntersectionObserver).toBeDefined();
    });

    it('should be a constructor', () => {
      expect(typeof window.IntersectionObserver).toBe('function');
    });
  });

  describe('window.matchMedia function', () => {
    it('should be defined on window object', () => {
      expect(window.matchMedia).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof window.matchMedia).toBe('function');
    });

    it('should accept a query string parameter', () => {
      expect(() => window.matchMedia('(max-width: 600px)')).not.toThrow();
    });
  });
});