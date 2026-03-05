import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('should render a link element', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should have href attribute pointing to #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should have the skip-link class', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('skip-link');
  });

  it('should display the correct text content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
  });

  it('should render with exact text "Skip to Main Content"', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to Main Content');
    expect(link).toBeInTheDocument();
  });

  it('should be an anchor element', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
  });

  it('should have only the required attributes', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('#main-content');
    expect(link.getAttribute('class')).toBe('skip-link');
  });
});