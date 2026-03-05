import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('should render a link element', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should have href pointing to main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should have skip-link class', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('skip-link');
  });

  it('should display correct text content', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to Main Content')).toBeInTheDocument();
  });

  it('should render exactly one link', () => {
    render(<SkipLink />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
  });

  it('should have correct link text', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Skip to Main Content' });
    expect(link).toBeTruthy();
  });
});