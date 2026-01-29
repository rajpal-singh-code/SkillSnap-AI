import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user");

const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
