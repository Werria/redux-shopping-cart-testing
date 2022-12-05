import { RootState } from "../../app/store";
import cartReducer, {
  addToCart,
  CartState,
  getMemoizedNumItems,
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

  describe("getMemoizedNumItems", () => {
    it("should return 0 with no items", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: {},
      };
      const result = getMemoizedNumItems({ cart } as RootState);
      expect(result).toEqual(0);
    });
    it("should add up the total", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: { abc: 3, def: 3 },
      };
      const result = getMemoizedNumItems({ cart } as RootState);
      expect(result).toEqual(6);
    });
    test("should not compute again with same state", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: { abc: 3, def: 3 },
      };
      getMemoizedNumItems.resetRecomputations();
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toEqual(1);
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toEqual(1);
      getMemoizedNumItems({ cart } as RootState);
      getMemoizedNumItems({ cart } as RootState);
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toEqual(1);
    });
    test("should recompute with new state", () => {
      const cart: CartState = {
        checkoutState: "READY",
        errorMessage: "",
        items: { abc: 3, def: 3 },
      };
      getMemoizedNumItems.resetRecomputations();
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toEqual(1);
      cart.items = { abc: 2 };
      getMemoizedNumItems({ cart } as RootState);
      expect(getMemoizedNumItems.recomputations()).toEqual(2);
    });
  });
});
