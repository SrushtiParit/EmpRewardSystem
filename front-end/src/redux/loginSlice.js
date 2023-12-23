import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name: "user",  // store name 
    initialState: { // initial state of a store
        name: "",
        role: "",
        image: "", // add image to the initial state
    },
    reducers: {
        userData: (state, action) => {
            state.name = action.payload.username;
            state.role = action.payload.role;
            state.image = action.payload.photo; // set image in the reducer
        },
    },
});

export const { userData } = loginSlice.actions;
export default loginSlice.reducer;
