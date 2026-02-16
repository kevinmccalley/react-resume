import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { ThemeProvider } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all form fields", () => {
    renderWithTheme(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders the 'I am human' toggle", () => {
    renderWithTheme(<ContactForm />);
    expect(screen.getByLabelText(/i am human/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithTheme(<ContactForm />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("submit button is disabled initially", () => {
    renderWithTheme(<ContactForm />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("enables submit button when all required fields are filled and human toggle is on", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });
  });

  it("keeps button disabled when name is empty", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("keeps button disabled when email is empty", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("keeps button disabled when email is invalid", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("keeps button disabled when message is empty", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.click(screen.getByLabelText(/i am human/i));

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("keeps button disabled when human toggle is off", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("phone field is optional (not required for form validity)", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });
  });

  it("shows success message on successful submit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    });

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent/i)).toBeInTheDocument();
    });
  });

  it("clears the form after successful submit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    });

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue("");
      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/message/i)).toHaveValue("");
    });
  });

  it("shows error message on failed submit", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      json: () => Promise.resolve({ ok: false }),
    });

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows error message on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows 'Sending...' while submitting", async () => {
    let resolvePromise;
    global.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });

    // Resolve to clean up
    await act(async () => {
      resolvePromise({ status: 200, json: () => Promise.resolve({ ok: true }) });
    });
  });

  it("sends form data to formspree endpoint", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    });

    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByLabelText(/i am human/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://formspree.io/f/mzzvzala",
        expect.objectContaining({
          method: "POST",
          headers: { Accept: "application/json" },
        })
      );
    });
  });

  it("updates input values as user types", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithTheme(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Jane");
    expect(nameInput).toHaveValue("Jane");

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "jane@test.com");
    expect(emailInput).toHaveValue("jane@test.com");

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "555-1234");
    expect(phoneInput).toHaveValue("555-1234");

    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, "Test message");
    expect(messageInput).toHaveValue("Test message");
  });

  it("message field is multiline (textarea)", () => {
    renderWithTheme(<ContactForm />);
    const messageField = screen.getByLabelText(/message/i);
    expect(messageField.tagName).toBe("TEXTAREA");
  });

  it("email field has email type", () => {
    renderWithTheme(<ContactForm />);
    const emailField = screen.getByLabelText(/email/i);
    expect(emailField).toHaveAttribute("type", "email");
  });

  it("phone field has tel type", () => {
    renderWithTheme(<ContactForm />);
    const phoneField = screen.getByLabelText(/phone/i);
    expect(phoneField).toHaveAttribute("type", "tel");
  });
});
