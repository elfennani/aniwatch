import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Session {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

const SessionContext = createContext({
  session: null as Session | null | undefined,
  isLoading: true,
});

export const SessionProvider = ({ children }: { children: any }) => {
  const requestSession = async () => {
    const sessionData = await AsyncStorage.getItem("session");
    if (!sessionData) return null;
    const session: Session = JSON.parse(sessionData);

    return session;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: requestSession,
  });

  return (
    <SessionContext.Provider value={{ session: data, isLoading: isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSaveSession = () => {
  const client = useQueryClient();

  return async (session: Session) => {
    await AsyncStorage.setItem("session", JSON.stringify(session));
    await client.invalidateQueries({ queryKey: ["session"], exact: true });
  };
};

export const useSession = () => useContext(SessionContext);
