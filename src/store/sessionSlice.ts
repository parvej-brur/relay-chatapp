import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Client state only: the raw JWT and whether localStorage has been read yet.
export type SessionState = {
  token: string | null;
  hydrated: boolean;
};

const initialState: SessionState = {
  token: null,
  hydrated: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionHydrated: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.hydrated = true;
    },
    signedIn: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.hydrated = true;
    },
    signedOut: (state) => {
      state.token = null;
      state.hydrated = true;
    },
  },
});

export const { sessionHydrated, signedIn, signedOut } = sessionSlice.actions;

export default sessionSlice.reducer;
