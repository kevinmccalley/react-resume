import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeContext, ThemeProvider, useTheme } from '../src/ThemeContext';

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
          <div data-testid="child-element">Child Content</div>
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should initialize with light theme when localStorage is empty', () => {
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

    it('should initialize with theme from localStorage', () => {
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

    it('should add theme class to document.body', async () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.className).toContain('theme-light');
      });
    });

    it('should update localStorage when theme changes', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-display">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="toggle-button">
              Toggle Theme
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = getByTestId('toggle-button');
      toggleButton.click();

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark');
      });
    });

    it('should update document.body class when theme changes', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-display">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="toggle-button">
              Toggle Theme
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.className).toContain('theme-light');
      });

      const toggleButton = getByTestId('toggle-button');
      toggleButton.click();

      await waitFor(() => {
        expect(document.body.className).toContain('theme-dark');
        expect(document.body.className).not.toContain('theme-light');
      });
    });

    it('should remove old theme classes before adding new ones', async () => {
      document.body.className = 'theme-light other-class';

      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')} data-testid="toggle-button">
            Toggle
          </button>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.className).toContain('other-class');
      });

      const toggleButton = getByTestId('toggle-button');
      toggleButton.click();

      await waitFor(() => {
        expect(document.body.className).toContain('theme-dark');
        expect(document.body.className).toContain('other-class');
        expect(document.body.className).not.toContain('theme-light');
      });
    });

    it('should preserve non-theme classes when updating theme', async () => {
      document.body.className = 'my-class other-class';

      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')} data-testid="toggle-button">
            Toggle
          </button>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.body.className).toContain('my-class');
        expect(document.body.className).toContain('other-class');
      });

      const toggleButton = getByTestId('toggle-button');
      toggleButton.click();

      await waitFor(() => {
        expect(document.body.className).toContain('my-class');
        expect(document.body.className).toContain('other-class');
        expect(document.body.className).toContain('theme-dark');
      });
    });

    it('should provide theme and setTheme in context value', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-display">{theme}</div>
            <button onClick={() => setTheme('custom')} data-testid="set-custom">
              Set Custom
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-display')).toHaveTextContent('light');
      
      getByTestId('set-custom').click();

      expect(getByTestId('theme-display')).toHaveTextContent('custom');
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

    it('should return theme and setTheme from context', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={() => setTheme('dark')} data-testid="button">
              Change
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should allow multiple components to consume the same theme context', () => {
      const Component1 = () => {
        const { theme } = useTheme();
        return <div data-testid="component1">{theme}</div>;
      };

      const Component2 = () => {
        const { theme } = useTheme();
        return <div data-testid="component2">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <Component1 />
          <Component2 />
        </ThemeProvider>
      );

      expect(screen.getByTestId('component1')).toHaveTextContent('light');
      expect(screen.getByTestId('component2')).toHaveTextContent('light');
    });

    it('should error with correct message when not in provider', () => {
      const TestComponent = () => {
        try {
          useTheme();
          return <div>Should not render</div>;
        } catch (error) {
          return <div>{error.message}</div>;
        }
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useTheme must be used within a ThemeProvider'
      );
    });
  });

  describe('Theme persistence and synchronization', () => {
    it('should handle multiple theme changes sequentially', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={() => setTheme('dark')} data-testid="dark-btn">
              Dark
            </button>
            <button onClick={() => setTheme('light')} data-testid="light-btn">
              Light
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme')).toHaveTextContent('light');

      getByTestId('dark-btn').click();
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark');
      });

      getByTestId('light-btn').click();
      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('light');
      });
    });

    it('should maintain theme consistency across re-renders', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        const [counter, setCounter] = useState(0);

        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="counter">{counter}</div>
            <button onClick={() => setTheme('dark')} data-testid="toggle-theme">
              Toggle Theme
            </button>
            <button onClick={() => setCounter(counter + 1)} data-testid="increment">
              Increment
            </button>
          </div>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      getByTestId('toggle-theme').click();
      await waitFor(() => {
        expect(getByTestId('theme')).toHaveTextContent('dark');
      });

      getByTestId('increment').click();
      expect(getByTestId('theme')).toHaveTextContent('dark');
      expect(getByTestId('counter')).toHaveTextContent('1');
    });
  });
});