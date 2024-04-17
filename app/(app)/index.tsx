import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { graphql } from "gql.tada";
import useGraphQLClient from "@/hooks/useGraphQLClient";
import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import CurrentlyWatching from "@/components/CurrentlyWatching";

type Props = {};

const GET_USER = graphql(`
  query Home {
    Viewer {
      id
      name
      avatar {
        large
      }
    }
  }
`);

const HomePage = (props: Props) => {
  const { top: paddingTop } = useSafeAreaInsets();
  const client = useGraphQLClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["query"],
    queryFn: async () => client.request(GET_USER),
  });

  if (isLoading)
    return (
      <View style={{ paddingTop }}>
        <View style={styles.heading}>
          <Loader width={220} height={24} style={{ flex: 1 }} />
          <Loader width={32} height={32} style={{ borderRadius: 1000 }} />
          <Loader width={32} height={32} style={{ borderRadius: 1000 }} />
        </View>
      </View>
    );

  return (
    <View style={[{ paddingTop }]}>
      <View style={styles.heading}>
        <Text style={styles.welcome}>Welcome {data?.Viewer?.name}!</Text>
        <TouchableOpacity style={styles.iconbutton}>
          <Ionicons name="notifications-outline" size={16} color="#27272a" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{ uri: data?.Viewer?.avatar?.large! }}
            style={styles.iconbutton}
          />
        </TouchableOpacity>
      </View>
      <CurrentlyWatching userId={data?.Viewer?.id!} />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  heading: {
    padding: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  welcome: {
    fontSize: 18,
    fontWeight: "800",
    color: "#27272a",
    flex: 1,
  },
  iconbutton: {
    backgroundColor: "#fafafa",
    borderRadius: 1000,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
