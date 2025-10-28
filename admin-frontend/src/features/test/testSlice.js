import { createSlice } from "@reduxjs/toolkit"

const initialState = []

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        addTest: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { addTest } = testSlice.actions
export default testSlice.reducer