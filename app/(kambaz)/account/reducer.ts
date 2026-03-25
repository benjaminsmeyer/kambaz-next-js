import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AccountUser = {
  _id?: string;
  role?: string;
  [key: string]: unknown;
};

type AccountState = {
  currentUser: AccountUser | null;
};

const initialState: AccountState = {
  currentUser: null,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AccountUser | null>) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
