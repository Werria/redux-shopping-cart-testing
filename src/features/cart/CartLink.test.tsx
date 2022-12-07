import React from "react";
import { screen } from "@testing-library/react";
import { CartLink } from "./CartLink";
import { addToCart, updateQuantity, removeFromCart } from "./cartSlice";
import { getStateWithItems, renderWithContext } from "../../test-utils";

test("should contain a link", () => {
  renderWithContext(<CartLink />);
  expect(screen.getByRole("link")).toBeInTheDocument();
});

test("should show test when there are no items", () => {
  renderWithContext(<CartLink />);
  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("Cart");
  expect(link).not.toHaveTextContent("0");
  expect(link).not.toHaveTextContent("1");
});

test("ahould show the correct number of items", () => {
  const state = getStateWithItems({ testItem: 1 }, {});
  const { store } = renderWithContext(<CartLink />, state);
  // store.dispatch(addToCart("testItem"));
  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("1");
  store.dispatch(updateQuantity({ id: "testItem", quantity: 5 }));
  expect(link).toHaveTextContent("5");
  store.dispatch(addToCart("anotherItem"));
  expect(link).toHaveTextContent("6");
  store.dispatch(removeFromCart("testItem"));
  store.dispatch(removeFromCart("anotherItem"));
  expect(link).toHaveTextContent("Cart");
});
