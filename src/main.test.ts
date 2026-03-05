import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ReactDOM from 'react-dom/client';

vi.mock('react-dom/client');
vi.mock('./ReactResume', () => ({
  default: () => React.createElement('div', null, 'ReactResume')
}));
vi.mock('./ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children)
}));
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', null, children)
}));

describe('main.jsx', () => {
  let mockRoot: { render: ReturnType<typeof vi.fn> };
  let mockCreateRoot: ReturnType<typeof vi.fn>;
  let getElementByIdSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoot = { render: vi.fn() };
    mockCreateRoot = vi.fn(() => mockRoot);
    (ReactDOM.createRoot as ReturnType<typeof vi.fn>) = mockCreateRoot;
    
    getElementByIdSpy = vi.spyOn(document, 'getElementById');
    getElementByIdSpy.mockReturnValue(document.createElement('div'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call ReactDOM.createRoot with root element', () => {
    require('./main.jsx');
    
    expect(getElementByIdSpy).toHaveBeenCalledWith('root');
  });

  it('should create a root element when root id exists', () => {
    require('./main.jsx');
    
    expect(mockCreateRoot).toHaveBeenCalled();
  });

  it('should render the application with StrictMode enabled', () => {
    require('./main.jsx');
    
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
  });

  it('should render with QueryClientProvider as a child of StrictMode', () => {
    require('./main.jsx');
    
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    expect(strictModeChildren.type.name).toContain('QueryClientProvider');
  });

  it('should render with ThemeProvider inside QueryClientProvider', () => {
    require('./main.jsx');
    
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    const queryClientProviderChildren = strictModeChildren.props.children;
    expect(queryClientProviderChildren.type.name).toContain('ThemeProvider');
  });

  it('should render ReactResume component inside the provider chain', () => {
    require('./main.jsx');
    
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    const queryClientProviderChildren = strictModeChildren.props.children;
    const themeProviderChildren = queryClientProviderChildren.props.children;
    const divElement = themeProviderChildren;
    
    expect(divElement.type).toBe('div');
    expect(divElement.props.children.type.name).toContain('ReactResume');
  });

  it('should pass queryClient to QueryClientProvider', () => {
    require('./main.jsx');
    
    const renderCall = mockRoot.render.mock.calls[0][0];
    const strictModeChildren = renderCall.props.children;
    
    expect(strictModeChildren.props.client).toBeDefined();
  });

  it('should handle case when root element does not exist', () => {
    getElementByIdSpy.mockReturnValue(null);
    
    expect(() => {
      require('./main.jsx');
    }).toThrow();
  });

  it('should render ReactDOM.createRoot only once', () => {
    require('./main.jsx');
    
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
  });

  it('should render root.render only once', () => {
    require('./main.jsx');
    
    expect(mockRoot.render).toHaveBeenCalledTimes(1);
  });
});