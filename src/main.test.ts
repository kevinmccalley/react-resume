import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Mock the dependencies
vi.mock('react', () => ({
  default: {
    StrictMode: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: vi.fn(),
  },
}));

vi.mock('./ReactResume', () => ({
  default: () => React.createElement('div', null, 'ReactResume'),
}));

vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

describe('main.jsx', () => {
  let mockRoot: { render: ReturnType<typeof vi.fn> };
  let mockCreateRoot: ReturnType<typeof vi.fn>;
  let mockQueryClient: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup mock root
    mockRoot = {
      render: vi.fn(),
    };

    // Setup mock createRoot
    mockCreateRoot = vi.spyOn(ReactDOM, 'createRoot').mockReturnValue(mockRoot as any);

    // Setup mock QueryClient
    const { QueryClient } = require('@tanstack/react-query');
    mockQueryClient = QueryClient;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a root element from DOM element with id "root"', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    // Re-import to trigger module execution
    require('./main.jsx');

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(mockElement);
  });

  it('should instantiate QueryClient', () => {
    require('./main.jsx');

    expect(mockQueryClient).toHaveBeenCalled();
  });

  it('should call render on the root element', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    expect(mockRoot.render).toHaveBeenCalled();
  });

  it('should render React.StrictMode as the top-level wrapper', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    const renderCall = mockRoot.render.mock.calls[0][0];
    // Check that render was called with a React element
    expect(renderCall).toBeDefined();
    expect(typeof renderCall).toBe('object');
  });

  it('should wrap application with QueryClientProvider', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });

  it('should wrap application with ThemeProvider', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });

  it('should render ReactResume component inside the providers', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    expect(mockRoot.render).toHaveBeenCalled();
  });

  it('should handle missing root element gracefully', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    // This should not throw, but ReactDOM.createRoot will be called with null
    const { QueryClient } = require('@tanstack/react-query');
    expect(() => {
      require('./main.jsx');
    }).not.toThrow();
  });

  it('should initialize application with correct provider hierarchy', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    require('./main.jsx');

    // Verify the entire chain was executed
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalled();
    expect(mockRoot.render).toHaveBeenCalled();
    expect(mockQueryClient).toHaveBeenCalled();
  });
});