import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as MainModule from './main.jsx';

vi.mock('react-dom/client');
vi.mock('./ReactResume', () => ({
  default: () => React.createElement('div', null, 'ReactResume'),
}));
vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'theme-provider' }, children),
}));
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'query-client-provider' }, children),
}));

describe('main.jsx', () => {
  let mockRoot: {
    render: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRoot = {
      render: vi.fn(),
    };
    vi.mocked(ReactDOM.createRoot).mockReturnValue(mockRoot as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call ReactDOM.createRoot with root element', () => {
    const rootElement = document.getElementById('root');
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('should render with React.StrictMode wrapper', () => {
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
  });

  it('should render with QueryClientProvider', () => {
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    expect(strictModeChildren.type.name).toContain('QueryClientProvider');
  });

  it('should render with ThemeProvider', () => {
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    const queryClientProviderChildren = strictModeChildren.props.children;
    expect(queryClientProviderChildren.type.name).toContain('ThemeProvider');
  });

  it('should render ReactResume component', () => {
    expect(mockRoot.render).toHaveBeenCalled();
  });

  it('should create QueryClient instance', () => {
    const { QueryClient } = require('@tanstack/react-query');
    expect(QueryClient).toHaveBeenCalled();
  });

  it('should pass queryClient to QueryClientProvider', () => {
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    expect(strictModeChildren.props.client).toBeDefined();
  });

  it('should render without crashing when root element exists', () => {
    expect(() => {
      require('./main.jsx');
    }).not.toThrow();
  });

  it('should have correct component nesting structure', () => {
    expect(mockRoot.render).toHaveBeenCalledTimes(1);
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];

    expect(renderCall).toBeDefined();
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children).toBeDefined();
  });

  it('should render div wrapper around ReactResume', () => {
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    const queryClientProviderChildren = strictModeChildren.props.children;
    const themeProviderChildren = queryClientProviderChildren.props.children;

    expect(themeProviderChildren.type).toBe('div');
    expect(themeProviderChildren.props.children).toBeDefined();
  });
});