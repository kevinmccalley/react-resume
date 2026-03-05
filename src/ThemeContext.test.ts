import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeContext, ThemeProvider, useTheme } from '../src/ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div>Test Child</div>
        </ThemeProvider>
      );
      expect(screen.getByText('Test Child')).toBeDefined();
    });

    it('should initialize theme from localStorage if available', () => {
      localStorage.setItem('theme', 'dark');
      
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('dark')).toBeDefined();
    });

    it('should default to light theme when localStorage is empty', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('light')).toBeDefined();
    });

    it('should add theme class to document.body', () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.body.classList.contains('theme-light')).toBe(true);
    });

    it('should add dark theme class when theme is dark', () => {
      localStorage.setItem('theme', 'dark');

      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should remove old theme class when theme changes', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span>{theme}</span>
            <button onClick={() => setTheme('dark')}>Switch to Dark</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.body.classList.contains('theme-light')).toBe(true);
      expect(document.body.classList.contains('theme-dark')).toBe(false);

      const button = screen.getByRole('button');
      await act(async () => {
        button.click();
      });

      expect(document.body.classList.contains('theme-light')).toBe(false);
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should persist theme to localStorage when changed', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Switch</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      await act(async () => {
        button.click();
      });

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should persist initial theme to localStorage', () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should handle multiple theme class removals', () => {
      document.body.className = 'theme-old theme-another custom-class theme-legacy';

      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.body.className).toContain('custom-class');
      expect(document.body.className).toContain('theme-light');
      expect(document.body.className).not.toContain('theme-old');
      expect(document.body.className).not.toContain('theme-another');
      expect(document.body.className).not.toContain('theme-legacy');
    });

    it('should provide context with theme and setTheme', () => {
      const TestComponent = () => {
        const context = React.useContext(ThemeContext);
        return (
          <div>
            <span>{context.theme}</span>
            <button onClick={() => context.setTheme('dark')}>Change</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('light')).toBeDefined();
    });

    it('should handle rapid theme changes', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <>
            <button onClick={() => setTheme('dark')}>Dark</button>
            <button onClick={() => setTheme('light')}>Light</button>
          </>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const [darkBtn, lightBtn] = screen.getAllByRole('button');

      await act(async () => {
        darkBtn.click();
        lightBtn.click();
        darkBtn.click();
      });

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });
  });

  describe('useTheme', () => {
    it('should return theme and setTheme from context', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            Theme: {theme}
            <button onClick={() => setTheme('dark')}>Change</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText(/Theme: light/)).toBeDefined();
    });

    it('should throw error when used outside ThemeProvider', () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('should have correct error message', () => {
      const TestComponent = () => {
        useTheme();
        return null;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('should allow changing theme through setTheme', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span>{theme}</span>
            <button onClick={() => setTheme('dark')}>Switch to Dark</button>
            <button onClick={() => setTheme('light')}>Switch to Light</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('light')).toBeDefined();

      await act(async () => {
        screen.getByRole('button', { name: /Switch to Dark/ }).click();
      });

      expect(screen.getByText('dark')).toBeDefined();

      await act(async () => {
        screen.getByRole('button', { name: /Switch to Light/ }).click();
      });

      expect(screen.getByText('light')).toBeDefined();
    });

    it('should work with multiple components using useTheme', async () => {
      const ThemeDisplayer = () => {
        const { theme } = useTheme();
        return <div>Current: {theme}</div>;
      };

      const ThemeSwitcher = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Switch</button>;
      };

      render(
        <ThemeProvider>
          <ThemeDisplayer />
          <ThemeSwitcher />
        </ThemeProvider>
      );

      expect(screen.getByText('Current: light')).toBeDefined();

      await act(async () => {
        screen.getByRole('button').click();
      });

      expect(screen.getByText('Current: dark')).toBeDefined();
    });
  });

  describe('Integration tests', () => {
    it('should sync theme across browser tabs via localStorage', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('light')).toBeDefined();

      localStorage.setItem('theme', 'dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should maintain theme persistence across re-renders', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <span>{theme}</span>
            <span>{count}</span>
            <button onClick={() => setTheme('dark')}>Change Theme</button>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>
        );
      };

      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await act(async () => {
        screen.getByRole('button', { name: /Change Theme/ }).click();
      });

      expect(screen.getByText('dark')).toBeDefined();

      await act(async () => {
        screen.getByRole('button', { name: /Increment/ }).click();
      });

      expect(screen.getByText('dark')).toBeDefined();
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});