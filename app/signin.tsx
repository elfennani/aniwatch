import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import config from "@/config.json";
import { useSession } from "@/ctx/session";

type Props = {};

const SignInPage = (props: Props) => {
  const { isLoading, session } = useSession();

  function handleLogin() {
    const { client_id, redirect_uri } = config;
    router.push(
      `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    );
  }

  if (session) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
        <View style={styles.button}>
          <Text style={styles.buttonLabel}>Login with AniList</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignInPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "flex-end",
    height: "100%",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonLabel: {
    color: "white",
    fontWeight: "600",
  },
});
