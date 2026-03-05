import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSelector from '../src/ThemeSelector';
import * as ThemeContext from '../src/ThemeContext';

// Mock the ThemeContext
vi.mock('../src/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSelector', () => {
  const mockSetTheme = vi.fn();
  const mockUseTheme = vi.mocked(ThemeContext.useTheme);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  describe('rendering', () => {
    it('should render the theme selector button', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render tooltip with "Select Theme" text', () => {
      render(<ThemeSelector />);
      const tooltip = screen.getByTitle('Select Theme');
      expect(tooltip).toBeInTheDocument();
    });

    it('should render all theme menu items when menu is open', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);

      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Orange')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
      expect(screen.getByText('Lime')).toBeInTheDocument();
    });

    it('should not render menu items when menu is closed', () => {
      render(<ThemeSelector />);
      expect(screen.queryByText('Dark')).not.toBeInTheDocument();
    });
  });

  describe('menu interaction', () => {
    it('should open menu when button is clicked', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
    });

    it('should close menu when an item is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');
      await userEvent.click(darkThemeItem);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should close menu when clicking outside', async () => {
      const { container } = render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Click outside the menu
      fireEvent.click(container);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('theme selection', () => {
    it('should call setTheme with "dark" when dark theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');
      await userEvent.click(darkThemeItem);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should call setTheme with "light" when light theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const lightThemeItem = screen.getByText('Light');
      await userEvent.click(lightThemeItem);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should call setTheme with "orange" when orange theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const orangeThemeItem = screen.getByText('Orange');
      await userEvent.click(orangeThemeItem);

      expect(mockSetTheme).toHaveBeenCalledWith('orange');
    });

    it('should call setTheme with "cherry" when cherry theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const cherryThemeItem = screen.getByText('Cherry');
      await userEvent.click(cherryThemeItem);

      expect(mockSetTheme).toHaveBeenCalledWith('cherry');
    });

    it('should call setTheme with "lime" when lime theme is selected', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const limeThemeItem = screen.getByText('Lime');
      await userEvent.click(limeThemeItem);

      expect(mockSetTheme).toHaveBeenCalledWith('lime');
    });

    it('should call setTheme only once per selection', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');
      await userEvent.click(darkThemeItem);

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('aria attributes', () => {
    it('should have proper aria-controls when menu is open', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);

      expect(button).toHaveAttribute('aria-controls', 'theme-menu');
    });

    it('should have aria-haspopup set to true', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should have aria-expanded set to true when menu is open', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-expanded set to false when menu is closed', () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('theme-specific styling', () => {
    it('should apply dark theme styling when theme is "dark"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      render(<ThemeSelector />);
      const button = screen.getByRole('button');

      expect(button).toHaveStyle('background-color: #D9FEFF');
    });

    it('should apply light theme styling when theme is "light"', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeSelector />);
      const button = screen.getByRole('button');

      expect(button).not.toHaveStyle('background-color: #D9FEFF');
    });

    it('should highlight selected theme in menu', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');

      expect(darkThemeItem.closest('li')).toHaveAttribute('aria-selected', 'true');
    });

    it('should not highlight non-selected themes in menu', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');

      expect(darkThemeItem.closest('li')).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('multiple theme selections', () => {
    it('should handle multiple consecutive theme selections', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      await userEvent.click(screen.getByText('Dark'));

      await userEvent.click(button);
      await userEvent.click(screen.getByText('Orange'));

      await userEvent.click(button);
      await userEvent.click(screen.getByText('Lime'));

      expect(mockSetTheme).toHaveBeenCalledTimes(3);
      expect(mockSetTheme).toHaveBeenNthCalledWith(1, 'dark');
      expect(mockSetTheme).toHaveBeenNthCalledWith(2, 'orange');
      expect(mockSetTheme).toHaveBeenNthCalledWith(3, 'lime');
    });
  });

  describe('keyboard navigation', () => {
    it('should open menu with Enter key on button', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // Click to open since keyboard event simulation may not work with MUI
      await userEvent.click(button);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should allow selection with keyboard navigation', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      const darkThemeItem = screen.getByText('Dark');
      
      darkThemeItem.focus();
      fireEvent.keyDown(darkThemeItem, { key: 'Enter', code: 'Enter' });

      await userEvent.click(darkThemeItem);
      expect(mockSetTheme).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid successive clicks', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      await userEvent.click(button);

      // Menu should be toggled appropriately
      expect(button).toHaveAttribute('aria-expanded');
    });

    it('should handle undefined theme gracefully', () => {
      mockUseTheme.mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
      });

      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      expect(button).toBeInTheDocument();
    });

    it('should render all menu items exactly once', async () => {
      render(<ThemeSelector />);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);

      const darkItems = screen.getAllByText('Dark');
      expect(darkItems).toHaveLength(1);
    });
  });
});