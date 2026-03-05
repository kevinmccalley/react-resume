import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeContext, ThemeProvider, useTheme } from '../src/ThemeContext.jsx';

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  describe('ThemeProvider', () => {
    it('should render children correctly', () => {
      render(
        <ThemeProvider>
          <div data-testid="test-child">Test Content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should initialize theme as "light" when localStorage is empty', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-display">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    });

    it('should initialize theme from localStorage if available', () => {
      localStorage.setItem('theme', 'dark');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-display">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    });

    it('should add theme class to document body', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.classList.contains('theme-light')).toBe(true);
      });
    });

    it('should update theme class when theme changes', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="toggle-button">
              Toggle Theme
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.classList.contains('theme-light')).toBe(true);
      });

      const toggleButton = screen.getByTestId('toggle-button');
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(document.body.classList.contains('theme-dark')).toBe(true);
        expect(document.body.classList.contains('theme-light')).toBe(false);
      });
    });

    it('should remove old theme classes when theme changes', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <div>
            <button onClick={() => setTheme('dark')} data-testid="set-dark">
              Dark
            </button>
            <button onClick={() => setTheme('auto')} data-testid="set-auto">
              Auto
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.classList.contains('theme-light')).toBe(true);
      });

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(document.body.classList.contains('theme-dark')).toBe(true);
        expect(document.body.classList.contains('theme-light')).toBe(false);
      });

      await userEvent.click(screen.getByTestId('set-auto'));

      await waitFor(() => {
        expect(document.body.classList.contains('theme-auto')).toBe(true);
        expect(document.body.classList.contains('theme-dark')).toBe(false);
      });
    });

    it('should preserve non-theme classes when updating theme', async () => {
      document.body.className = 'custom-class another-class';

      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')} data-testid="toggle">
            Toggle
          </button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.classList.contains('theme-light')).toBe(true);
        expect(document.body.classList.contains('custom-class')).toBe(true);
        expect(document.body.classList.contains('another-class')).toBe(true);
      });

      await userEvent.click(screen.getByTestId('toggle'));

      await waitFor(() => {
        expect(document.body.classList.contains('theme-dark')).toBe(true);
        expect(document.body.classList.contains('custom-class')).toBe(true);
        expect(document.body.classList.contains('another-class')).toBe(true);
        expect(document.body.classList.contains('theme-light')).toBe(false);
      });
    });

    it('should persist theme to localStorage', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')} data-testid="toggle">
            Toggle
          </button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('light');
      });

      await userEvent.click(screen.getByTestId('toggle'));

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark');
      });
    });

    it('should provide theme context value with theme and setTheme', () => {
      const TestComponent = () => {
        const context = useTheme();
        return (
          <div>
            <div data-testid="has-theme">{typeof context.theme}</div>
            <div data-testid="has-setTheme">{typeof context.setTheme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-theme')).toHaveTextContent('string');
      expect(screen.getByTestId('has-setTheme')).toHaveTextContent('function');
    });

    it('should handle multiple theme changes in sequence', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="dark-btn">
              Dark
            </button>
            <button onClick={() => setTheme('light')} data-testid="light-btn">
              Light
            </button>
            <button onClick={() => setTheme('auto')} data-testid="auto-btn">
              Auto
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('dark-btn'));
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        expect(document.body.classList.contains('theme-dark')).toBe(true);
      });

      await userEvent.click(screen.getByTestId('auto-btn'));
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('auto');
        expect(document.body.classList.contains('theme-auto')).toBe(true);
      });

      await userEvent.click(screen.getByTestId('light-btn'));
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
        expect(document.body.classList.contains('theme-light')).toBe(true);
      });
    });
  });

  describe('useTheme', () => {
    it('should throw error when used outside ThemeProvider', () => {
      const TestComponent = () => {
        useTheme();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('should return context object with theme and setTheme properties', () => {
      const TestComponent = () => {
        const context = useTheme();
        return (
          <div data-testid="context-keys">
            {Object.keys(context).sort().join(',')}
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('context-keys')).toHaveTextContent('setTheme,theme');
    });

    it('should allow updating theme via setTheme', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={() => setTheme('custom')} data-testid="update-btn">
              Update
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

      await userEvent.click(screen.getByTestId('update-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('theme-value')).toHaveTextContent('custom');
      });
    });

    it('should return consistent context across multiple calls', () => {
      const TestComponent = () => {
        const context1 = useTheme();
        const context2 = useTheme();

        return (
          <div>
            <div data-testid="theme1">{context1.theme}</div>
            <div data-testid="theme2">{context2.theme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme1')).toHaveTextContent('light');
      expect(screen.getByTestId('theme2')).toHaveTextContent('light');
    });
  });

  describe('Edge cases', () => {
    it('should handle localStorage with null value', () => {
      localStorage.setItem('theme', 'null');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('null');
    });

    it('should handle empty string in localStorage', () => {
      localStorage.setItem('theme', '');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should handle body className with extra spaces', async () => {
      document.body.className = '  custom-class   another-class  ';

      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')} data-testid="toggle">
            Toggle
          </button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.classList.contains('theme-light')).toBe(true);
      });

      await userEvent.click(screen.getByTestId('toggle'));

      await waitFor(() => {
        expect(document.body.classList.contains('theme-dark')).toBe(true);
      });
    });

    it('should handle theme values with special characters', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark-mode')} data-testid="toggle">
            Toggle
          </button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('toggle'));

      await waitFor(() => {
        expect(document.body.classList.contains('theme-dark-mode')).toBe(true);
      });

      expect(localStorage.getItem('theme')).toBe('dark-mode');
    });
  });
});