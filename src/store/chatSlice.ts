import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Chat UI state that outlives a single component: which conversation is open, how many
// messages arrived in the ones that are not, and whether the socket is live. Messages
// and conversations themselves are server state and live in the React Query cache.
export type ChatState = {
  activeConversationId: string | null;
  unreadCounts: Record<string, number>;
  socketConnected: boolean;
};

const initialState: ChatState = {
  activeConversationId: null,
  unreadCounts: {},
  socketConnected: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    conversationOpened: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload) delete state.unreadCounts[action.payload];
    },
    messageMissed: (state, action: PayloadAction<string>) => {
      state.unreadCounts[action.payload] = (state.unreadCounts[action.payload] ?? 0) + 1;
    },
    socketStatusChanged: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    chatReset: () => initialState,
  },
});

export const { conversationOpened, messageMissed, socketStatusChanged, chatReset } =
  chatSlice.actions;

export default chatSlice.reducer;
