import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

import { LoginForm } from "./login-form";

describe("LoginForm", () => {
  it("should show errors when trying to submit without filling all required fields", async () => {
    const { getByText, findByText } = render(<LoginForm />, {});

    const submitButton = getByText("Entrar");

    userEvent.click(submitButton);

    await findByText(/email é obrigatório/i);
  });

  it("should show error if email is invalid", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(
      <LoginForm />,
      {},
    );

    const emailInput = getByPlaceholderText(/informe seu email/i);

    userEvent.type(emailInput, "invalid_mail");

    const submitButton = getByText("Entrar");

    userEvent.click(submitButton);

    await findByText(/email inválido/i);
  });
});
