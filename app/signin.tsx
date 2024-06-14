import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Link, Redirect, router } from "expo-router";
import config from "@/config";
import { useSession } from "@/ctx/session";

type Props = {};

const SignInPage = (props: Props) => {
  const { session } = useSession();
  let { client_id, redirect_uri } = config;

  if (session) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <Link
        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`}
        asChild
      >
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Login with AniList</Text>
          </View>
        </TouchableOpacity>
      </Link>
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
