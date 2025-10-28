import { createSlice } from "@reduxjs/toolkit";

const socket = createSlice({
    name: "socket",
    initialState: null,
    reducers: {
        setSocket: (state, action) => {
            state = action.payload;
        },
    },
});


export const { setSocket } = socket.actions;
export default socket.reducer;