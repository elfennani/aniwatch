import { View } from "react-native";
import React, { memo } from "react";
import Stats from "./stats";

type Props = {
  score?: number;
  season?: string;
  year?: number;
};

function capitalizeWord(word: string): string {
  if (!word) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const MediaStats = memo(({ score, season, year }: Props) => {
  return (
    <View className="px-6">
      <Stats>
        <Stats.Stat label="year" value={!year ? "N/A" : year} />
        <Stats.Stat
          label="score"
          value={typeof score == "undefined" ? "N/A" : score}
        />
        <Stats.Stat
          label="season"
          value={season ? capitalizeWord(season) : "N/A"}
        />
      </Stats>
    </View>
  );
});

export default MediaStats;
