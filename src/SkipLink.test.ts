import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('should render a skip link element', () => {
    render(<SkipLink />);
    const skipLink = screen.getByRole('link');
    expect(skipLink).toBeInTheDocument();
  });

  it('should have correct href attribute pointing to main-content', () => {
    render(<SkipLink />);
    const skipLink = screen.getByRole('link');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should have skip-link className', () => {
    render(<SkipLink />);
    const skipLink = screen.getByRole('link');
    expect(skipLink).toHaveClass('skip-link');
  });

  it('should display correct text content', () => {
    render(<SkipLink />);
    const skipLink = screen.getByRole('link');
    expect(skipLink).toHaveTextContent('Skip to Main Content');
  });

  it('should render text exactly as specified', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to Main Content')).toBeInTheDocument();
  });

  it('should have exactly one link element', () => {
    render(<SkipLink />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
  });

  it('should render without additional attributes', () => {
    render(<SkipLink />);
    const skipLink = screen.getByRole('link');
    expect(skipLink.attributes.length).toBe(2);
    expect(skipLink).toHaveAttribute('href');
    expect(skipLink).toHaveAttribute('class');
  });
});