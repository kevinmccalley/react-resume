import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

vi.mock('react');
vi.mock('react-dom/client');
vi.mock('./App', () => ({
  default: () => React.createElement('div', null, 'App'),
}));
vi.mock('./index.css');
vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }) => React.createElement('div', null, children),
}));

describe('index.js', () => {
  let mockRoot;
  let mockCreateRoot;
  let mockGetElementById;

  beforeEach(() => {
    mockRoot = {
      render: vi.fn(),
    };
    mockCreateRoot = vi.fn(() => mockRoot);
    mockGetElementById = vi.fn(() => document.createElement('div'));

    (ReactDOM.createRoot as any) = mockCreateRoot;
    (document.getElementById as any) = mockGetElementById;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call document.getElementById with "root"', () => {
    require('./index.js');
    expect(mockGetElementById).toHaveBeenCalledWith('root');
  });

  it('should call ReactDOM.createRoot with the root element', () => {
    require('./index.js');
    expect(mockCreateRoot).toHaveBeenCalled();
  });

  it('should render React.StrictMode as the root component', () => {
    require('./index.js');
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
  });

  it('should render ThemeProvider inside StrictMode', () => {
    require('./index.js');
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    expect(strictModeChildren.type.name).toContain('ThemeProvider');
  });

  it('should render App component inside ThemeProvider', () => {
    require('./index.js');
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    const appComponent = strictModeChildren.props.children;
    expect(appComponent).toBeDefined();
  });

  it('should mount the application to the DOM', () => {
    require('./index.js');
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRoot.render).toHaveBeenCalledTimes(1);
  });

  it('should handle missing root element gracefully', () => {
    mockGetElementById.mockReturnValue(null);
    expect(() => {
      require('./index.js');
    }).not.toThrow();
  });

  it('should call render with a valid React element', () => {
    require('./index.js');
    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall).toBeDefined();
    expect(renderCall.$$typeof).toBeDefined();
  });
});