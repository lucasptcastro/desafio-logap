import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CartContext, ICartContext } from "@/app/menu/_contexts/cart";

import ProductDetails from "./product-details";

const mockProduct = {
  id: "prod-1",
  name: "X-Burger",
  description: "Hambúrguer delicioso",
  imageUrl: "/burger.png",
  price: 25,
  ingredients: ["Pão", "Carne", "Queijo"],
  restaurant: {
    name: "MC LogAp",
    avatarImageUrl: "/logo.png",
  },
};

describe("ProductDetails", () => {
  it("should not allow decreasing the quantity below 1", () => {
    render(
      <CartContext.Provider
        value={{
          isOpen: false,
          products: [],
          total: 0,
          totalQuantity: 0,
          toggleCart: () => {},
          addProduct: () => {},
          decreaseProductQuantity: () => {},
          increaseProductQuantity: () => {},
          removeProduct: () => {},
        }}
      >
        <ProductDetails product={mockProduct} />
      </CartContext.Provider>,
    );

    const decreaseButton = screen.getByText(/adicionar à sacola/i);

    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);

    const quantity = screen.getByText("1");

    expect(quantity).toBeInTheDocument();
  });

  it('calls addProduct in context when clicking "Adicionar à sacola"', () => {
    const addProductMock = vi.fn();
    const toggleCartMock = vi.fn();

    // valor para o CartContext
    const cartContextValue: ICartContext = {
      isOpen: false,
      products: [],
      total: 0,
      totalQuantity: 0,
      toggleCart: toggleCartMock,
      addProduct: addProductMock,
      decreaseProductQuantity: vi.fn(),
      increaseProductQuantity: vi.fn(),
      removeProduct: vi.fn(),
    };

    render(
      <CartContext.Provider value={cartContextValue}>
        <ProductDetails product={mockProduct} />
      </CartContext.Provider>,
    );

    const addButton = screen.getByRole("button", {
      name: /adicionar à sacola/i,
    });

    fireEvent.click(addButton);

    // Verifica se o addProduct está retornando ...mockProduct e a quantidade
    expect(addProductMock).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
    });

    expect(toggleCartMock).toHaveBeenCalled();
  });
});
