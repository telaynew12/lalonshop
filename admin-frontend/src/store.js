import { configureStore } from "@reduxjs/toolkit";
import test from "./features/test/testSlice";
import auth from "./features/auth/authSlice";
import socket from "./features/socket/socketSlice";

const store = configureStore({
    reducer: {
        // test: testSlice.reducer
        test: test,
        auth: auth,
        socket : socket
    }
});


export default store;