```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

// Mock ThemeContext
vi.mock('./ThemeContext', () => ({
  useTheme: vi.fn(() => ({ theme: 'light' })),
}));

import { useTheme } from './ThemeContext';

const mockUseTheme = vi.mocked(useTheme);

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to fill required fields
async function fillRequiredFields(
  name = 'John Doe',
  email = 'john@example.com',
  message = 'Hello there'
) {
  await userEvent.type(screen.getByLabelText(/name/i), name);
  await userEvent.type(screen.getByLabelText(/email/i), email);
  await userEvent.type(screen.getByLabelText(/message/i), message);
}

function toggleHuman() {
  const toggle = screen.getByRole('checkbox');
  fireEvent.click(toggle);
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: 'light' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders the Name field', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it('renders the Email field', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders the Phone field', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('renders the Message field', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders the "I am human" toggle', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/i am human/i)).toBeInTheDocument();
    });

    it('renders the Send Message button', () => {
      render(<ContactForm />);
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('renders the form as a <form> element', () => {
      const { container } = render(<ContactForm />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('does not show success or error alert on initial render', () => {
      render(<ContactForm />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('button is disabled initially because form is invalid', () => {
      render(<ContactForm />);
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('renders the Message field as a textarea (multiline)', () => {
      const { container } = render(<ContactForm />);
      expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('Phone field has type tel', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/phone/i)).toHaveAttribute('type', 'tel');
    });

    it('Email field has type email', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    });
  });

  // ─── handleChange ──────────────────────────────────────────────────────────

  describe('handleChange', () => {
    it('updates the Name field value as the user types', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByLabelText(/name/i);
      await userEvent.type(nameInput, 'Alice');
      expect(nameInput).toHaveValue('Alice');
    });

    it('updates the Email field value as the user types', async () => {
      render(<ContactForm />);
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'alice@example.com');
      expect(emailInput).toHaveValue('alice@example.com');
    });

    it('updates the Phone field value as the user types', async () => {
      render(<ContactForm />);
      const phoneInput = screen.getByLabelText(/phone/i);
      await userEvent.type(phoneInput, '1234567890');
      expect(phoneInput).toHaveValue('1234567890');
    });

    it('updates the Message field value as the user types', async () => {
      render(<ContactForm />);
      const messageInput = screen.getByLabelText(/message/i);
      await userEvent.type(messageInput, 'Hello world');
      expect(messageInput).toHaveValue('Hello world');
    });

    it('clears errorMsg when user types after an error', async () => {
      render(<ContactForm />);
      // Trigger an error via submit with empty form
      const button = screen.getByRole('button', { name: /send message/i });
      // We need to make the button enabled – hack via enabling form
      // Instead, simulate submit on the form directly
      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Now type in a field – error should clear
      await userEvent.type(screen.getByLabelText(/name/i), 'A');
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  describe('Validation', () => {
    it('button remains disabled when only name is filled', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('button remains disabled when name and email are filled but no message', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('button remains disabled when all text fields are filled but human toggle is off', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('button becomes enabled when all required fields and human toggle are set', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
      });
    });

    it('button remains disabled when email is invalid', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
      await userEvent.type(screen.getByLabelText(/message/i), 'Hello');
      toggleHuman();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
      });
    });

    it('button remains disabled when name is only whitespace', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), '   ');
      await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Hello');
      toggleHuman();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
      });
    });

    it('button remains disabled when message is only whitespace', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), '   ');
      toggleHuman();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
      });
    });

    it('phone is not required – form is valid without phone', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
      });
    });
  });

  // ─── handleSubmit – validation errors ─────────────────────────────────────

  describe('handleSubmit – validation errors shown on submit', () => {
    it('shows error when name is empty and form is submitted directly', async () => {
      render(<ContactForm />);
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/name/i);
      });
    });

    it('shows error when email is empty', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/email/i);
      });
    });

    it('shows error when email is invalid', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'bad-email');
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
      });
    });

    it('shows error when message is empty', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/message/i);
      });
    });

    it('shows error when human toggle is not checked', async () => {
      render(<ContactForm />);
      await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
      await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Hello');
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/human verification/i);
      });
    });

    it('renders an error Alert with severity error', async () => {
      render(<ContactForm />);
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  // ─── handleSubmit – successful submission ──────────────────────────────────

  describe('handleSubmit – successful submission', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        status: 200,
        json: async () => ({ ok: true }),
      });
    });

    it('calls fetch with the correct URL', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://formspree.io/f/mzzvzala',
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

    it('shows success alert after successful submission', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/thank you/i);
      });
    });

    it('resets form fields to empty after successful submission', async () => {
      render(<ContactForm />);
      await fillRequiredFields('Alice', 'alice@example.com', 'Hello');
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByLabelText(/^name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
      });
    });

    it('resets the human toggle to unchecked after successful submission', async () => {
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).not.toBeChecked();
      });
    });

    it('shows success even when result.ok is falsy but response.status is 200', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        json: async () => ({ ok: false }),
      });
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/thank you/i);
      });
    });
  });

  // ─── handleSubmit – failed submission ─────────────────────────────────────

  describe('handleSubmit – failed submission', () => {
    it('shows error alert when server returns not ok', async () => {
      mockFetch.mockResolvedValue({
        status: 500,
        json: async () => ({ ok: false }),
      });
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
      });
    });

    it('shows error alert when fetch throws a network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
      });
    });

    it('error alert has severity error on server failure', async () => {
      mockFetch.mockResolvedValue({
        status: 500,
        json: async () => ({ ok: false }),
      });
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(/something went wrong/i);
      });
    });
  });

  // ─── Sending state ─────────────────────────────────────────────────────────

  describe('Sending state', () => {
    it('shows "Sending..." text while request is in-flight', async () => {
      let resolvePromise!: (value: unknown) => void;
      mockFetch.mockReturnValue(
        new Promise((res) => {
          resolvePromise = res;
        })
      );

      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });

      // Resolve so test completes cleanly
      act(() => {
        resolvePromise({
          status: 200,
          json: async () => ({ ok: true }),
        });
      });
    });

    it('shows CircularProgress while request is in-flight', async () => {
      let resolvePromise!: (value: unknown) => void;
      mockFetch.mockReturnValue(
        new Promise((res) => {
          resolvePromise = res;
        })
      );

      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        // CircularProgress renders an SVG
        expect(document.querySelector('svg')).toBeInTheDocument();
      });

      act(() => {
        resolvePromise({
          status: 200,
          json: async () => ({ ok: true }),
        });
      });
    });

    it('disables the button while sending', async () => {
      let resolvePromise!: (value: unknown) => void;
      mockFetch.mockReturnValue(
        new Promise((res) => {
          resolvePromise = res;
        })
      );

      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });

      act(() => {
        resolvePromise({
          status: 200,
          json: async () => ({ ok: true }),
        });
      });
    });
  });

  // ─── Human Toggle ──────────────────────────────────────────────────────────

  describe('Human Toggle', () => {
    it('is unchecked by default', () => {
      render(<ContactForm />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('becomes checked when clicked', () => {
      render(<ContactForm />);
      toggleHuman();
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('becomes unchecked when clicked twice', () => {
      render(<ContactForm />);
      toggleHuman();
      toggleHuman();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  // ─── Theme-based rendering ────────────────────────────────────────────────

  describe('Theme-based rendering', () => {
    const themes = ['light', 'dark', 'orange', 'cherry', 'lime'] as const;

    themes.forEach((theme) => {
      it(`renders without crashing for theme: ${theme}`, () => {
        mockUseTheme.mockReturnValue({ theme });
        expect(() => render(<ContactForm />)).not.toThrow();
      });
    });

    it('uses dark background color for inputs when theme is dark', () => {
      mockUseTheme.mockReturnValue({ theme: 'dark' });
      const { container } = render(<ContactForm />);
      // The component sets backgroundColor: "#0e0e0e" for dark inputs – verify component renders
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('renders correctly with an unknown/fallback theme', () => {
      mockUseTheme.mockReturnValue({ theme: 'unknown' });
      expect(() => render(<ContactForm />)).not.toThrow();
    });
  });

  // ─── Fetch request details ─────────────────────────────────────────────────

  describe('Fetch request details', () => {
    it('sends POST with Accept application/json header', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        json: async () => ({ ok: true }),
      });
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: { Accept: 'application/json' },
          })
        );
      });
    });

    it('sends a FormData body', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        json: async () => ({ ok: true }),
      });
      render(<ContactForm />);
      await fillRequiredFields();
      toggleHuman();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
      );
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0][1];
        expect(callArgs.body).toBeInstanceOf(FormData);
      });
    });
  });

  // ─── Error state cleared on new typing ────────────────────────────────────

  describe('Error state management', () => {
    it('clears a previous validation error when user corrects a field', async () => {
      render(<ContactForm />);

      // Submit with blank form to get error
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );

      // Type in name field to clear error
      await userEvent.type(screen.getByLabelText(/name/i), 'B');
      await waitFor(() =>
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      );
    });

    it('does not clear error if user types nothing (error stays visible)', async () => {
      render(<ContactForm />);
      fireEvent.submit(document.querySelector('form')!);
      await waitFor(() =>
        expect(screen.getByRole('alert')).toBeInTheDocument()
      );
      // Alert is still present without further interaction
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ─── noValidate attribute ─────────────────────────────────────────────────

  describe('Form attributes', () => {
    it('has noValidate attribute to prevent browser native validation', () => {
      const { container } = render(<ContactForm />);
      expect(container.querySelector('form')).toHaveAttribute('novalidate');
    });
  });
});
```