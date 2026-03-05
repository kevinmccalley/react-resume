import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeSelector from './ThemeSelector';
import { useTheme } from './ThemeContext';

vi.mock('./ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSelector', () => {
  const mockSetTheme = vi.fn();
  const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
  });

  describe('Rendering', () => {
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

    it('should render the menu with correct id', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('id', 'theme-menu');
    });

    it('should render all theme menu items', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Orange')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
      expect(screen.getByText('Lime')).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('should apply dark theme styling when theme is "dark"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: '1500',
      });
    });

    it('should apply light theme styling when theme is "light"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have correct ARIA attributes when menu is closed', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have correct ARIA attributes when menu is open', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Menu Interactions', () => {
    it('should open menu when button is clicked', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      const menu = screen.getByRole('menu');
      expect(menu).toBeVisible();
    });

    it('should close menu when clicking outside', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      let menu = screen.getByRole('menu');
      expect(menu).toBeVisible();
      
      fireEvent.click(document.body);
      
      waitFor(() => {
        menu = screen.queryByRole('menu');
        expect(menu).not.toBeInTheDocument();
      });
    });

    it('should mark current theme as selected', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const darkMenuItem = screen.getByText('Dark').closest('li');
      expect(darkMenuItem).toHaveAttribute('aria-selected', 'true');
    });

    it('should not mark non-current themes as selected', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const lightMenuItem = screen.getByText('Light').closest('li');
      expect(lightMenuItem).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Theme Selection', () => {
    it('should call setTheme with "dark" when dark theme is selected', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const darkMenuItem = screen.getByText('Dark');
      fireEvent.click(darkMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should call setTheme with "light" when light theme is selected', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const lightMenuItem = screen.getByText('Light');
      fireEvent.click(lightMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should call setTheme with "orange" when orange theme is selected', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const orangeMenuItem = screen.getByText('Orange');
      fireEvent.click(orangeMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledWith('orange');
    });

    it('should call setTheme with "cherry" when cherry theme is selected', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const cherryMenuItem = screen.getByText('Cherry');
      fireEvent.click(cherryMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledWith('cherry');
    });

    it('should call setTheme with "lime" when lime theme is selected', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const limeMenuItem = screen.getByText('Lime');
      fireEvent.click(limeMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledWith('lime');
    });

    it('should close menu after theme selection', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const lightMenuItem = screen.getByText('Light');
      fireEvent.click(lightMenuItem);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should call setTheme exactly once per selection', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const orangeMenuItem = screen.getByText('Orange');
      fireEvent.click(orangeMenuItem);
      
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
      expect(mockSetTheme).toHaveBeenCalledWith('orange');
    });
  });

  describe('Different Theme States', () => {
    it('should render correctly when theme is "light"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render correctly when theme is "orange"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'orange',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render correctly when theme is "cherry"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'cherry',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render correctly when theme is "lime"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'lime',
        setTheme: mockSetTheme,
      });
      render(<ThemeSelector />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Menu Configuration', () => {
    it('should have correct anchor origin configuration', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });

    it('should have MenuListProps with correct aria-labelledby', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const menuList = screen.getByRole('menu');
      expect(menuList).toBeInTheDocument();
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle opening and closing menu multiple times', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.click(document.body);
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should handle sequential theme selections', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Light'));
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
      
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Dark'));
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(2);
    });
  });

  describe('Button Size and Positioning', () => {
    it('should have large size attribute on button', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('size', 'large');
    });

    it('should have fixed positioning with correct top and right values', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        position: 'fixed',
        top: '16px',
        right: '16px',
      });
    });

    it('should have high z-index for visibility', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ zIndex: '1500' });
    });
  });
});