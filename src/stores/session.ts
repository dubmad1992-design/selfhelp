import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

type SessionState = {
  session: Session | null;
  /** False until the initial getSession() resolves — gate navigation on this. */
  initialized: boolean;
  setSession: (session: Session | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  initialized: false,
  setSession: (session) => set({ session, initialized: true })
}));

let started = false;

/** Idempotent: load the current session and subscribe to auth changes. */
export function startSessionListener() {
  if (started) return;
  started = true;

  void supabase.auth.getSession().then(({ data }) => {
    useSessionStore.getState().setSession(data.session);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useSessionStore.getState().setSession(session);
  });
}
