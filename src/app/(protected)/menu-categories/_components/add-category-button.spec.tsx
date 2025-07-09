import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import AddMenuCategoryButton from "@/app/(protected)/menu-categories/_components/add-category-button";

// Mock do formulário que aparece no modal
vi.mock(
  "@/app/(protected)/menu-categories/_components/upsert-category-form",
  () => ({
    UpsertMenuCategoryForm: ({ onSuccess }: { onSuccess: () => void }) => (
      <div>
        <p>Formulário de categoria</p>
        <button onClick={onSuccess}>Salvar</button>
      </div>
    ),
  }),
);

describe("AddMenuCategoryButton", () => {
  it("opens the modal when clicking the button and closes it when calling onSuccess", async () => {
    const user = userEvent.setup();

    render(<AddMenuCategoryButton />);

    expect(screen.queryByText(/adicionar categoria/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /adicionar categoria/i }),
    );

    expect(screen.getByText(/adicionar categoria/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      screen.queryByText(/adicione uma nova categoria /i),
    ).not.toBeInTheDocument();
  });
});
