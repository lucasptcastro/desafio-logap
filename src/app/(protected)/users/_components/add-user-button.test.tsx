import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import AddUserButton from "./add-user-button";

// Mock do formulário de adicionar usuário
vi.mock("./upsert-user-form", () => ({
  UpsertUserForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div>
      <p>Formulário de usuário</p>
      <button onClick={onSuccess}>Salvar</button>
    </div>
  ),
}));

describe("AddUserButton", () => {
  it("opens the modal when clicking the button and closes it when calling onSuccess", async () => {
    const user = userEvent.setup();

    const fakeRoles = [
      {
        id: "admin",
        name: "Administrador",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sales",
        name: "Vendedor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<AddUserButton roles={fakeRoles} />);

    await user.click(
      screen.getByRole("button", { name: /adicionar usuário/i }),
    );

    expect(screen.getByText(/formulário de usuário/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /salvar/i }));
  });
});
