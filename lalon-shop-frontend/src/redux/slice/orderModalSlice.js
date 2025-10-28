const { createSlice } = require("@reduxjs/toolkit");

const orderModalSlice = createSlice({
  name: "orderModal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    changeOrderModal: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { changeOrderModal } = orderModalSlice.actions;
export default orderModalSlice.reducer;
