import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import CartProductItem from "@/app/menu/_components/cart-product-item";
import { CartContext, ICartContext } from "@/app/menu/_contexts/cart";

const mockProduct = {
  id: "prod-123",
  name: "Produto Teste",
  imageUrl: "/produto.jpg",
  price: 1500,
  quantity: 2,
};

describe("CartProductItem", () => {
  it("calls removeProduct with correct ID when clicking trash button", async () => {
    const user = userEvent.setup();

    const removeProductMock = vi.fn();

    const cartContextValue: ICartContext = {
      isOpen: false,
      products: [mockProduct],
      total: 0,
      totalQuantity: 0,
      toggleCart: vi.fn(),
      addProduct: vi.fn(),
      decreaseProductQuantity: vi.fn(),
      increaseProductQuantity: vi.fn(),
      removeProduct: removeProductMock,
    };

    render(
      <CartContext.Provider value={cartContextValue}>
        <CartProductItem product={mockProduct} />
      </CartContext.Provider>,
    );

    const deleteButton = screen.getByTestId("remove-product-button");
    await user.click(deleteButton);

    expect(removeProductMock).toHaveBeenCalledTimes(1);
    expect(removeProductMock).toHaveBeenCalledWith("prod-123");
  });
});
