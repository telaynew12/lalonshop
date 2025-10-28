import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {},
  loading: true,
  showCartSideBar: false,
};

const cartSideBarSlice = createSlice({
  name: "cartSideBar",
  initialState: initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearCart: (state) => {
      state.cart = {};
    },
    changeShowCartSideBar: (state, action) => {
      state.showCartSideBar = action.payload;
    },
  },
});

export const { setCart, setLoading, clearCart, changeShowCartSideBar } = cartSideBarSlice.actions;
export default cartSideBarSlice.reducer;
