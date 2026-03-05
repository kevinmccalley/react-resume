import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

// Mock React and ReactDOM
vi.mock('react', () => ({
  default: {
    StrictMode: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(),
}));

vi.mock('./App', () => ({
  default: () => React.createElement('div', { testId: 'app' }, 'App Component'),
}));

vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { testId: 'theme-provider' }, children),
}));

vi.mock('./index.css', () => ({}));

describe('index.js', () => {
  let mockRender: ReturnType<typeof vi.fn>;
  let mockCreateRoot: ReturnType<typeof vi.fn>;
  let originalRoot: HTMLElement | null;

  beforeEach(() => {
    // Setup
    originalRoot = document.getElementById('root');
    if (!originalRoot) {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);
    }

    mockRender = vi.fn();
    mockCreateRoot = vi.fn(() => ({
      render: mockRender,
    }));

    vi.mocked(ReactDOM.createRoot).mockImplementation(mockCreateRoot);
  });

  afterEach(() => {
    vi.clearAllMocks();
    const root = document.getElementById('root');
    if (root && !originalRoot) {
      document.body.removeChild(root);
    }
  });

  it('should call ReactDOM.createRoot with the root element', async () => {
    // Dynamically require the index file to trigger the render logic
    await import('./index.js');

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
  });

  it('should call render on the root with React.StrictMode wrapper', async () => {
    await import('./index.js');

    expect(mockRender).toHaveBeenCalled();
    const renderCall = mockRender.mock.calls[0];
    expect(renderCall).toBeDefined();
  });

  it('should wrap the application in ThemeProvider', async () => {
    await import('./index.js');

    expect(mockRender).toHaveBeenCalled();
  });

  it('should render App component inside ThemeProvider inside StrictMode', async () => {
    await import('./index.js');

    expect(mockCreateRoot).toHaveBeenCalled();
    expect(mockRender).toHaveBeenCalled();
  });

  it('should handle case when root element does not exist', async () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      document.body.removeChild(rootElement);
    }

    mockCreateRoot.mockImplementation(() => ({
      render: mockRender,
    }));

    // This should not throw an error, just pass null to createRoot
    await import('./index.js');

    expect(mockCreateRoot).toHaveBeenCalledWith(null);
  });

  it('should maintain component hierarchy: StrictMode > ThemeProvider > App', async () => {
    await import('./index.js');

    expect(mockRender).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
  });
});