import { createContext, useContext } from "react";
import { useMMKVObject } from "react-native-mmkv";

export interface Session {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

const SessionContext = createContext({
  session: undefined as Session | undefined,
});

const useSessionStorage = () => useMMKVObject<Session>("session");

export const SessionProvider = ({ children }: { children: any }) => {
  const [session] = useSessionStorage();

  return (
    <SessionContext.Provider value={{ session: session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSaveSession = () => {
  const [_, setSession] = useSessionStorage();

  return async (session: Session) => {
    setSession(session);
  };
};

export const useSession = () => useContext(SessionContext);
