/*
 * @copyRight by md sarwar hoshen.
 */
import { createSlice } from "@reduxjs/toolkit";
//
const initialState = {
  apat: null,
  user_id: null,
  user_type: null,
  isVerified: null,
  pass_cng: null,
  isAuthenticated: false,
};
//
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeAat(state, action) {
      const { apat } = action.payload;
      state.apat = apat;
    },
    setUser(state, action) {
      const { user_id, user_type, isVerified, pass_cng, isAuthenticated,apat  } = action.payload;
      state.user_id = user_id;
      state.user_type = user_type;
      state.isVerified = isVerified;
      state.pass_cng = pass_cng;
      state.isAuthenticated = isAuthenticated;
      state.apat = apat;
    },
    clearAat: (state) => {
      state.apat = null;
      state.user_id = null;
      state.user_type = false;
      state.isVerified = null;
      state.pass_cng = null;
      state.isAuthenticated = false;
    },
  },
});
//
export const { storeAat, setUser, clearAat } = authSlice.actions;
export default authSlice;
