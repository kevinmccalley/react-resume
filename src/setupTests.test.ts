import { describe, it, expect, afterEach, vi } from 'vitest';

describe('setupTests', () => {
  afterEach(() => {
    document.body.className = '';
    localStorage.clear();
  });

  describe('localStorage mock', () => {
    it('should initialize with empty store', () => {
      localStorage.clear();
      expect(localStorage.getItem('any-key')).toBe(null);
    });

    it('should set and get items', () => {
      localStorage.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('should convert values to strings when setting', () => {
      localStorage.setItem('number-key', 123);
      expect(localStorage.getItem('number-key')).toBe('123');
    });

    it('should convert object values to strings when setting', () => {
      const obj = { name: 'test' };
      localStorage.setItem('object-key', obj);
      expect(localStorage.getItem('object-key')).toBe('[object Object]');
    });

    it('should return null for non-existent keys', () => {
      localStorage.clear();
      expect(localStorage.getItem('non-existent')).toBe(null);
    });

    it('should remove items', () => {
      localStorage.setItem('to-remove', 'value');
      expect(localStorage.getItem('to-remove')).toBe('value');
      localStorage.removeItem('to-remove');
      expect(localStorage.getItem('to-remove')).toBe(null);
    });

    it('should clear all items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(localStorage.getItem('key1')).toBe(null);
      expect(localStorage.getItem('key2')).toBe(null);
    });

    it('should handle removing non-existent keys without error', () => {
      expect(() => {
        localStorage.removeItem('non-existent-key');
      }).not.toThrow();
    });

    it('should overwrite existing keys', () => {
      localStorage.setItem('key', 'value1');
      localStorage.setItem('key', 'value2');
      expect(localStorage.getItem('key')).toBe('value2');
    });
  });

  describe('IntersectionObserver mock', () => {
    it('should be defined on window', () => {
      expect(window.IntersectionObserver).toBeDefined();
    });

    it('should be instantiable', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(observer).toBeInstanceOf(window.IntersectionObserver);
    });

    it('should have observe method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(observer.observe).toBeDefined();
      expect(typeof observer.observe).toBe('function');
    });

    it('should have unobserve method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(observer.unobserve).toBeDefined();
      expect(typeof observer.unobserve).toBe('function');
    });

    it('should have disconnect method', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(observer.disconnect).toBeDefined();
      expect(typeof observer.disconnect).toBe('function');
    });

    it('should call observe without throwing', () => {
      const observer = new window.IntersectionObserver(() => {});
      const element = document.createElement('div');
      expect(() => {
        observer.observe(element);
      }).not.toThrow();
    });

    it('should call unobserve without throwing', () => {
      const observer = new window.IntersectionObserver(() => {});
      const element = document.createElement('div');
      expect(() => {
        observer.unobserve(element);
      }).not.toThrow();
    });

    it('should call disconnect without throwing', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(() => {
        observer.disconnect();
      }).not.toThrow();
    });
  });

  describe('matchMedia mock', () => {
    it('should be defined on window', () => {
      expect(window.matchMedia).toBeDefined();
    });

    it('should return an object with matches property', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList).toBeDefined();
      expect(mediaQueryList.matches).toBe(false);
    });

    it('should have addListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.addListener).toBeDefined();
      expect(typeof mediaQueryList.addListener).toBe('function');
    });

    it('should have removeListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.removeListener).toBeDefined();
      expect(typeof mediaQueryList.removeListener).toBe('function');
    });

    it('should have addEventListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.addEventListener).toBeDefined();
      expect(typeof mediaQueryList.addEventListener).toBe('function');
    });

    it('should have removeEventListener method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.removeEventListener).toBeDefined();
      expect(typeof mediaQueryList.removeEventListener).toBe('function');
    });

    it('should have dispatchEvent method', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.dispatchEvent).toBeDefined();
      expect(typeof mediaQueryList.dispatchEvent).toBe('function');
    });

    it('should return false for dispatchEvent', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(mediaQueryList.dispatchEvent()).toBe(false);
    });

    it('should handle different media queries', () => {
      const queries = [
        '(max-width: 600px)',
        '(min-width: 768px)',
        '(prefers-color-scheme: dark)',
        '(orientation: landscape)',
      ];

      queries.forEach((query) => {
        const mediaQueryList = window.matchMedia(query);
        expect(mediaQueryList.matches).toBe(false);
      });
    });

    it('should call addListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(() => {
        mediaQueryList.addListener(() => {});
      }).not.toThrow();
    });

    it('should call removeListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(() => {
        mediaQueryList.removeListener(() => {});
      }).not.toThrow();
    });

    it('should call addEventListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(() => {
        mediaQueryList.addEventListener('change', () => {});
      }).not.toThrow();
    });

    it('should call removeEventListener without throwing', () => {
      const mediaQueryList = window.matchMedia('(max-width: 600px)');
      expect(() => {
        mediaQueryList.removeEventListener('change', () => {});
      }).not.toThrow();
    });
  });

  describe('DOM cleanup', () => {
    it('should reset document body className after each test', () => {
      document.body.className = 'test-class';
      expect(document.body.className).toBe('test-class');
    });

    it('should have empty className at test start', () => {
      expect(document.body.className).toBe('');
    });

    it('should clear localStorage after each test', () => {
      localStorage.setItem('persistent-key', 'value');
      expect(localStorage.getItem('persistent-key')).toBe('value');
    });
  });
});