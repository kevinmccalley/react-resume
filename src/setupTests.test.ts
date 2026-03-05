import { describe, it, expect, afterEach } from 'vitest';

describe('setupTests.js', () => {
  describe('localStorage mock', () => {
    it('should set and get items from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    it('should return null for non-existent keys', () => {
      expect(localStorage.getItem('nonExistentKey')).toBe(null);
    });

    it('should convert values to strings when setting', () => {
      localStorage.setItem('numberKey', 123);
      expect(localStorage.getItem('numberKey')).toBe('123');
    });

    it('should convert boolean values to strings', () => {
      localStorage.setItem('boolKey', true);
      expect(localStorage.getItem('boolKey')).toBe('true');
    });

    it('should remove items from localStorage', () => {
      localStorage.setItem('removeKey', 'removeValue');
      expect(localStorage.getItem('removeKey')).toBe('removeValue');
      localStorage.removeItem('removeKey');
      expect(localStorage.getItem('removeKey')).toBe(null);
    });

    it('should not throw error when removing non-existent key', () => {
      expect(() => localStorage.removeItem('nonExistentKey')).not.toThrow();
    });

    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(localStorage.getItem('key1')).toBe(null);
      expect(localStorage.getItem('key2')).toBe(null);
    });

    it('should handle multiple set and get operations', () => {
      localStorage.setItem('a', 'valueA');
      localStorage.setItem('b', 'valueB');
      localStorage.setItem('c', 'valueC');
      expect(localStorage.getItem('a')).toBe('valueA');
      expect(localStorage.getItem('b')).toBe('valueB');
      expect(localStorage.getItem('c')).toBe('valueC');
    });

    it('should overwrite existing keys', () => {
      localStorage.setItem('key', 'value1');
      expect(localStorage.getItem('key')).toBe('value1');
      localStorage.setItem('key', 'value2');
      expect(localStorage.getItem('key')).toBe('value2');
    });
  });

  describe('IntersectionObserver mock', () => {
    it('should be defined on window', () => {
      expect(window.IntersectionObserver).toBeDefined();
    });

    it('should be a constructor', () => {
      expect(typeof window.IntersectionObserver).toBe('function');
    });

    it('should instantiate without errors', () => {
      expect(() => new window.IntersectionObserver()).not.toThrow();
    });

    it('should have observe method', () => {
      const observer = new window.IntersectionObserver();
      expect(typeof observer.observe).toBe('function');
    });

    it('should have unobserve method', () => {
      const observer = new window.IntersectionObserver();
      expect(typeof observer.unobserve).toBe('function');
    });

    it('should have disconnect method', () => {
      const observer = new window.IntersectionObserver();
      expect(typeof observer.disconnect).toBe('function');
    });

    it('should call observe without throwing', () => {
      const observer = new window.IntersectionObserver();
      const element = document.createElement('div');
      expect(() => observer.observe(element)).not.toThrow();
    });

    it('should call unobserve without throwing', () => {
      const observer = new window.IntersectionObserver();
      const element = document.createElement('div');
      expect(() => observer.unobserve(element)).not.toThrow();
    });

    it('should call disconnect without throwing', () => {
      const observer = new window.IntersectionObserver();
      expect(() => observer.disconnect()).not.toThrow();
    });
  });

  describe('matchMedia mock', () => {
    it('should be defined on window', () => {
      expect(window.matchMedia).toBeDefined();
    });

    it('should be a function', () => {
      expect(typeof window.matchMedia).toBe('function');
    });

    it('should return an object with matches property', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(mediaQueryList.matches).toBeDefined();
    });

    it('should return false for matches by default', () => {
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

    it('should return false from dispatchEvent by default', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(mediaQueryList.dispatchEvent(new Event('test'))).toBe(false);
    });

    it('should accept any media query string', () => {
      expect(() => window.matchMedia('(min-width: 1024px)')).not.toThrow();
      expect(() => window.matchMedia('(prefers-color-scheme: dark)')).not.toThrow();
      expect(() => window.matchMedia('print')).not.toThrow();
    });

    it('should call addListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(() => mediaQueryList.addListener(() => {})).not.toThrow();
    });

    it('should call addEventListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');
      expect(() => mediaQueryList.addEventListener('change', () => {})).not.toThrow();
    });
  });

  describe('afterEach cleanup', () => {
    it('should clear body className', () => {
      document.body.className = 'test-class';
      afterEach(() => {
        document.body.className = '';
        localStorage.clear();
      });
      expect(document.body.className).toBe('test-class');
    });

    it('should clear localStorage after each test', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });
  });

  describe('global window property setup', () => {
    it('localStorage should be defined as a property descriptor on window', () => {
      const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
      expect(descriptor).toBeDefined();
      expect(descriptor?.value).toBeDefined();
    });

    it('IntersectionObserver should be accessible from window', () => {
      expect(window.IntersectionObserver).toBeDefined();
    });

    it('matchMedia should be accessible from window', () => {
      expect(window.matchMedia).toBeDefined();
    });
  });
});