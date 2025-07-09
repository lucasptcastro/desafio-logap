import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { LoginForm } from "./login-form";

// Mock do redirect
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock do authClient
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
  },
}));

import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

describe("LoginForm", () => {
  it("displays error messages when submitting with invalid fields", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/a senha deve conter pelo menos 8 caracteres/i),
    ).toBeInTheDocument();
  });

  it("sends valid data and redirects on success", async () => {
    const user = userEvent.setup();

    // Mock da função authClient.signIn.email
    const signInMock = authClient.signIn.email as jest.Mock;
    signInMock.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText(/informe seu email/i),
      "user@example.com",
    );
    await user.type(
      screen.getByPlaceholderText(/informe sua senha/i),
      "1234567890",
    );

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    // Espera o redirect ser chamado
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });
  });
});
