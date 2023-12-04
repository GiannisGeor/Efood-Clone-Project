import { createSlice } from "@reduxjs/toolkit";

function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const productString = JSON.stringify(action.payload);
      const cartProductId = hashCode(productString);

      console.log("cartProductId", cartProductId);

      const productInCart = state.cart.find(
        (product) => product.cartProductId == cartProductId
      );

      if (productInCart) {
        productInCart.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1, cartProductId });
      }
    },

    removeFromCart: (state, action) => {
      const removeFromCart = state.cart.filter(
        (product) => product.cartProductId !== action.payload.cartProductId
      );
      state.cart = removeFromCart;
    },

    incrementQuantity: (state, action) => {
      const productInCart = state.cart.find(
        (product) => product.cartProductId == action.payload.cartProductId
      );
      productInCart.quantity++;
    },

    decrementQuantity: (state, action) => {
      const productInCart = state.cart.find(
        (product) => product.cartProductId == action.payload.cartProductId
      );
      if (productInCart.quantity == 1) {
        const removeFromCart = state.cart.filter(
          (product) => product.cartProductId !== action.payload.cartProductId
        );
        state.cart = removeFromCart;
      } else {
        productInCart.quantity--;
      }
    },

    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
