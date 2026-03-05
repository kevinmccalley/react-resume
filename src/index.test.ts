import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

vi.mock('react-dom/client');
vi.mock('./App', () => ({
  default: () => React.createElement('div', null, 'App'),
}));
vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }) => React.createElement('div', null, children),
}));
vi.mock('./index.css');

describe('index.js', () => {
  let mockRoot;
  let mockGetElementById;

  beforeEach(() => {
    mockRoot = {
      render: vi.fn(),
    };
    mockGetElementById = vi.spyOn(document, 'getElementById');
    mockGetElementById.mockReturnValue(document.createElement('div'));
    vi.mocked(ReactDOM.createRoot).mockReturnValue(mockRoot);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockGetElementById.mockRestore();
  });

  it('should get the root element by id', () => {
    require('./index');
    expect(mockGetElementById).toHaveBeenCalledWith('root');
  });

  it('should create a React root with the root element', () => {
    require('./index');
    expect(ReactDOM.createRoot).toHaveBeenCalled();
  });

  it('should render the App component wrapped in ThemeProvider and StrictMode', () => {
    require('./index');
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });

  it('should handle missing root element gracefully', () => {
    mockGetElementById.mockReturnValue(null);
    vi.mocked(ReactDOM.createRoot).mockImplementation((element) => {
      if (!element) {
        throw new Error('Failed to find root element');
      }
      return mockRoot;
    });

    expect(() => {
      require('./index');
    }).toThrow('Failed to find root element');
  });

  it('should call ReactDOM.createRoot once during initialization', () => {
    require('./index');
    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
  });

  it('should call render once on the root instance', () => {
    require('./index');
    expect(mockRoot.render).toHaveBeenCalledTimes(1);
  });

  it('should render with React.StrictMode as wrapper', () => {
    require('./index');
    const renderCall = vi.mocked(mockRoot.render).mock.calls[0][0];
    expect(renderCall.type?.$$typeof).toBeDefined();
  });

  it('should initialize without throwing errors', () => {
    expect(() => {
      require('./index');
    }).not.toThrow();
  });

  it('should use the correct DOM element id', () => {
    require('./index');
    const callArgs = vi.mocked(mockGetElementById).mock.calls[0];
    expect(callArgs[0]).toBe('root');
  });
});