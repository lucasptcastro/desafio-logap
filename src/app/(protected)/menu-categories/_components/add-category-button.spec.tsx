import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

import AddMenuCategoryButton from "./add-category-button";

describe("AddMenuCategoryButton", () => {
  it("should display the modal if the button is clicked", async () => {
    const user = userEvent.setup();

    const { getByText, findByText } = render(<AddMenuCategoryButton />, {});

    const openDialogButton = getByText("Adicionar categoria");

    user.click(openDialogButton);

    await findByText(/criar/i);
  });

  it("should show errors when trying to submit without filling all required fields", async () => {
    const user = userEvent.setup();

    const { getByText, findByText } = render(<AddMenuCategoryButton />, {});

    const openDialogButton = getByText("Adicionar categoria");

    user.click(openDialogButton);

    await findByText(/criar/i);

    const submitButton = getByText(/criar/i);

    user.click(submitButton);

    await findByText(/nome é obrigatório/i);
  });
});
