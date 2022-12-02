import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "./cartSlice";

describe("cart reducer", () => {
  test("an empty action", () => {
    const initialState = undefined;
    const action = { type: "" };
    const result = cartReducer(initialState, action);
    expect(result).toEqual({
      items: {},
      checkoutState: "READY",
      errorMessage: "",
    });
  });
  test("addToCart", () => {
    const initialState = undefined;
    const action = addToCart("abc");
    let result = cartReducer(initialState, action);
    result = cartReducer(result, action);
    result = cartReducer(result, action);
    expect(result).toEqual({
      items: { abc: 3 },
      checkoutState: "READY",
      errorMessage: "",
    });
  });
  test.todo("removeFromCart");
  test.todo("updateQuantity");
});
