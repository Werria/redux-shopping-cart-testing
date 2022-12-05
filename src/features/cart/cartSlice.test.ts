import { RootState } from "../../app/store";
import cartReducer, {
  addToCart,
  CartState,
  getNumItems,
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

describe("selectors", () => {
  describe("getNumItems", () => {
    it("should return 0 with no items", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: {},
      };
      const result = getNumItems({ cart } as RootState);
      expect(result).toEqual(0);
    });
    it("should add up the total", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: { abc: 3, def: 3 },
      };
      const result = getNumItems({ cart } as RootState);
      expect(result).toEqual(6);
    });
  });
});
