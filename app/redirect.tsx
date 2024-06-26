import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect } from "react";
import {
  router,
  useLocalSearchParams,
  useUnstableGlobalHref,
  usePathname,
  useGlobalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useMutation } from "@tanstack/react-query";
import config from "@/config";
import { Session, useSaveSession } from "@/ctx/session";

const Redirect = () => {
  const { code, ...params } = useLocalSearchParams<{ code: string }>();
  const saveSession = useSaveSession();
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (Platform.OS == "web") {
        const session = new URLSearchParams(
          window.location.hash.replace("#", "")
        );

        const paramsObject: Record<string, string | number> = {};
        session.forEach((value, key) => {
          if (!isNaN(Number(value))) {
            paramsObject[key] = Number(value);
            return;
          }
          paramsObject[key] = value;
        });

        return paramsObject as unknown as Session;
      }

      const { client_id, client_secret, redirect_uri } = config;

      const url = "https://anilist.co/api/v2/oauth/token";
      const body = {
        grant_type: "authorization_code",
        client_id,
        client_secret,
        redirect_uri,
        code,
      };

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status != 200) {
        throw new Error(res.status.toString());
      }

      return (await res.json()) as Session;
    },
    onError: (error) => {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      router.replace("/");
    },
    onSuccess: async (data) => {
      await saveSession(data);
      router.replace("/");
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Redirect;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
