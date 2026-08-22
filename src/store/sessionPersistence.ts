import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clearStoredToken, writeStoredToken } from "@/lib/auth/session";
import { signedIn, signedOut } from "./sessionSlice";

export const sessionPersistence = createListenerMiddleware();

sessionPersistence.startListening({
  matcher: isAnyOf(signedIn, signedOut),
  effect: (action) => {
    if (signedIn.match(action)) writeStoredToken(action.payload);
    else clearStoredToken();
  },
});
