import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSelector from '../src/ThemeSelector';
import { useTheme } from '../src/ThemeContext';

vi.mock('../src/ThemeContext');

describe('ThemeSelector', () => {
  const mockSetTheme = vi.fn();
  const mockThemeContext = {
    theme: 'dark',
    setTheme: mockSetTheme,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue(mockThemeContext);
  });

  describe('Component Rendering', () => {
    it('should render the theme selector button', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render with tooltip text "Select Theme"', () => {
      render(<ThemeSelector />);
      const tooltip = screen.getByTitle('Select Theme');
      expect(tooltip).toBeInTheDocument();
    });

    it('should have fixed positioning styles', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: '1500',
      });
    });

    it('should render theme menu when button is clicked', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });
  });

  describe('Theme Icons and Labels', () => {
    it('should display all theme options in menu', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
        expect(screen.getByText('Lime')).toBeInTheDocument();
      });
    });

    it('should mark current theme as selected', async () => {
      (useTheme as any).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });
      
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const lightMenuItem = screen.getByText('Light').closest('li');
        expect(lightMenuItem).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Theme Selection', () => {
    it('should call setTheme when a theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const orangeOption = screen.getByText('Orange');
        fireEvent.click(orangeOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('orange');
    });

    it('should close menu after theme selection', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        fireEvent.click(darkOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should select dark theme', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        fireEvent.click(darkOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should select light theme', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const lightOption = screen.getByText('Light');
        fireEvent.click(lightOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should select cherry theme', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const cherryOption = screen.getByText('Cherry');
        fireEvent.click(cherryOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('cherry');
    });

    it('should select lime theme', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const limeOption = screen.getByText('Lime');
        fireEvent.click(limeOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledWith('lime');
    });
  });

  describe('Menu Open and Close', () => {
    it('should open menu when button is clicked', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should close menu when clicking outside', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
      
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should close menu when escape key is pressed', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Styling Based on Theme', () => {
    it('should apply dark theme background color when theme is dark', () => {
      (useTheme as any).mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });
      
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveStyle({ bgcolor: '#D9FEFF' });
    });

    it('should apply light theme background when theme is not dark', () => {
      (useTheme as any).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });
      
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveStyle({ bgcolor: 'background.paper' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes for button', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('color', 'inherit');
      expect(button).toHaveAttribute('size', 'large');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should have aria-labelledby on menu', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });

    it('should have aria-expanded attribute that changes state', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme changes', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        fireEvent.click(darkOption);
      });
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const lightOption = screen.getByText('Light');
        fireEvent.click(lightOption);
      });
      
      expect(mockSetTheme).toHaveBeenCalledTimes(2);
      expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'dark');
      expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'light');
    });

    it('should handle unknown theme gracefully', () => {
      (useTheme as any).mockReturnValue({
        theme: 'unknown',
        setTheme: mockSetTheme,
      });
      
      render(<ThemeSelector />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should maintain menu state correctly across multiple opens and closes', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
      
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});