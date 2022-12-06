import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { RootState } from "../../app/store";
import cartReducer, {
  addToCart,
  CartState,
  checkoutCart,
  getMemoizedNumItems,
  getNumItems,
  getTotalPrice,
} from "./cartSlice";
import products from "../../../public/products.json";
import * as api from "../../app/api";

const mockStore = configureStore([thunk]);

jest.mock("../../app/api", () => {
  return {
    async getProducts() {
      return [];
    },
    async checkout(items: api.CartItems = {}) {
      const empty = Object.keys(items).length === 0;
      if (empty) throw new Error("Must include cart items");
      if (items.badItem > 0) return { success: false };
      return { success: true };
    },
  };
});

test("checkout should work", async () => {
  await api.checkout({ fakseItem: 4 });
});

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

  describe("getTotalPrice", () => {
    test("should return 0 with an empty cart", () => {
      const state: RootState = {
        cart: { checkoutState: "READY", errorMessage: "", items: {} },
        products: { products: {} },
      };
      const result = getTotalPrice(state);
      expect(result).toEqual("0.00");
    });
    test("should add up the totals", () => {
      const state: RootState = {
        cart: {
          checkoutState: "READY",
          errorMessage: "",
          items: {
            [products[0].id]: 3,
            [products[1].id]: 4,
          },
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };
      const result = getTotalPrice(state);
      expect(result).toEqual("43.23");
    });
    test("should not compute again with the same state", () => {
      const state: RootState = {
        cart: {
          checkoutState: "READY",
          errorMessage: "",
          items: {
            [products[0].id]: 3,
            [products[1].id]: 4,
          },
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      const result = getTotalPrice(state);
      expect(result).toEqual("43.23");
      expect(getTotalPrice.recomputations()).toEqual(1);
      getTotalPrice(state);
      expect(getTotalPrice.recomputations()).toEqual(1);
    });
    test("should recompute with new products", () => {
      const state: RootState = {
        cart: {
          checkoutState: "READY",
          errorMessage: "",
          items: {
            [products[0].id]: 3,
            [products[1].id]: 4,
          },
        },
        products: {
          products: {
            [products[0].id]: products[0],
            [products[1].id]: products[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      let result = getTotalPrice(state);
      expect(result).toEqual("43.23");
      expect(getTotalPrice.recomputations()).toEqual(1);
      state.products.products = {
        [products[0].id]: products[0],
        [products[1].id]: products[1],
        [products[2].id]: products[2],
      };
      result = getTotalPrice({ ...state });
      expect(result).toEqual("43.23");
      expect(getTotalPrice.recomputations()).toEqual(2);
    });
    test.todo("should recompute with cart changes");
  });
});

describe("thunks", () => {
  describe("checkoutCart w/mocked dispatch", () => {
    it("should checkout", async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: { checkoutState: "READY", errorMessage: "", items: { abc: 1 } },
      };
      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual("cart/checkout/pending");
      expect(calls[1][0].type).toEqual("cart/checkout/fulfilled");
      expect(calls[1][0].payload).toEqual({ success: true });
    });
    it("should fail with no items", async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        products: { products: {} },
        cart: { checkoutState: "READY", errorMessage: "", items: {} },
      };
      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual("cart/checkout/pending");
      console.log(calls[1]);
      expect(calls[1][0].type).toEqual("cart/checkout/rejected");
      expect(calls[1][0].payload).toEqual(undefined);
      expect(calls[1][0].error.message).toEqual("Must include cart items");
    });
  });

  describe("checkoutCart w/mock redux store", () => {
    it("should checkout", async () => {
      const store = mockStore({ cart: { items: { testItem: 3 } } });
      await store.dispatch(checkoutCart() as any);
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual("cart/checkout/pending");
      expect(actions[1].type).toEqual("cart/checkout/fulfilled");
      expect(actions[1].payload).toEqual({ success: true });
    });
    it("should fail with no items", async () => {
      const store = mockStore({ cart: { items: {} } });
      await store.dispatch(checkoutCart() as any);
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual("cart/checkout/pending");
      expect(actions[1].type).toEqual("cart/checkout/rejected");
      expect(actions[1].payload).toEqual(undefined);
      expect(actions[1].error.message).toEqual("Must include cart items");
    });
  });
});
