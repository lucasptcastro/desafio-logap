import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";

import CpfForm from "./cpf-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/orders",
}));

describe("CpfForm", () => {
  it("should show errors when trying to submit without filling all required fields", async () => {
    const user = userEvent.setup();

    const { getByText, findByText } = render(<CpfForm />, {});

    const submitButton = getByText("Confirmar");

    user.click(submitButton);

    await findByText(/required/i);
  });
});
