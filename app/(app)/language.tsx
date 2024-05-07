import {
  Button,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import Language from "@/interfaces/Language";
import { useMMKVObject } from "react-native-mmkv";
import { router } from "expo-router";
import Heading from "@/components/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ctx/theme-provider";
import Text from "@/components/text";

export default function LanguageScreen() {
  const {
    spacing,
    colors: { card },
  } = useTheme();
  const [_, setLanguage] = useMMKVObject<Language>("language");
  const langs = [
    "JAPANESE",
    "ENGLISH",
    "KOREAN",
    "ITALIAN",
    "SPANISH",
    "PORTUGUESE",
    "FRENCH",
    "GERMAN",
    "HEBREW",
    "HUNGARIAN",
  ] as const;

  function handleLang(lang: Language) {
    setLanguage(lang);
    router.back();
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: spacing["lg"] }}>
        <Heading name="Set Language" back />
        {langs.map((lang) => (
          <TouchableHighlight
            key={lang}
            onPress={() => handleLang(lang)}
            style={{ padding: spacing["md"], borderRadius: spacing["xs"] }}
            underlayColor={card}
          >
            <Text>{lang}</Text>
          </TouchableHighlight>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
