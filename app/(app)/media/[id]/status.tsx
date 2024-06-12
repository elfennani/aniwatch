import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { ReactNode, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useShowQuery from "@/api/use-show-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@/components/text";
import Box from "@/components/box";
import { useTheme } from "@/ctx/theme-provider";
import { Iconify } from "react-native-iconify";
import { POSSIBLE_STATUS } from "@/constants/values";
import StatusSelectBottomSheet from "@/components/status-select-bottom-sheet";
import useFormData from "@/hooks/use-form-data";
import NumberBottomSheet from "@/components/number-bottom-sheet";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import MediaDate from "@/interfaces/MediaDate";
import Heading from "@/components/heading";
import useStatusMutation from "@/api/use-status-mutation";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";

type Props = {};

enum ModalScreen {
  STATUS,
  SCORE,
  PROGRESS,
}

const Status = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [modal, setModal] = useState<ModalScreen>();
  const { colors, textVariants, spacing } = useTheme();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });
  const initialData = useMemo(
    () => ({
      status: media?.status,
      score: media?.score,
      progress: media?.progress,
      start: media?.startDate,
      end: media?.endDate,
    }),
    [media]
  );
  const [state, modify] = useFormData(initialData);
  const statusMutation = useStatusMutation(media?.id!);
  const saveDisabled = useMemo(
    () =>
      statusMutation.isPending ||
      isRefetching ||
      JSON.stringify(initialData) == JSON.stringify(state),
    [state, initialData, statusMutation.isPending, isRefetching]
  );

  let statusText = "Set Status";
  if (state.status) statusText = POSSIBLE_STATUS[state.status];

  function unsetModal() {
    setModal(undefined);
  }

  const dropdown = (
    <Iconify
      icon="material-symbols-light:keyboard-arrow-down"
      size={18}
      color={colors.secondary}
    />
  );
  const number = (
    <Iconify
      icon="material-symbols-light:numbers"
      size={18}
      color={colors.secondary}
    />
  );
  const date = (
    <Iconify
      icon="material-symbols-light:calendar-today-outline"
      size={18}
      color={colors.secondary}
    />
  );

  function mediaDateToString(date: MediaDate | undefined) {
    if (date?.year! && date?.month! && date?.day) {
      const { year, month, day } = date;
      return `${day}-${month}-${year}`;
    }

    return "";
  }

  function mediaDateToJsDate(field: keyof typeof state) {
    const date = state[field] as MediaDate | undefined;
    if (date?.year! && date?.month! && date?.day)
      return new Date(date?.year!, date?.month! - 1, date?.day);
  }

  const showDatePicker = (field: keyof typeof state) => {
    const startDate = mediaDateToJsDate("start");
    const endDate = mediaDateToJsDate("end");
    let value = mediaDateToJsDate(field) ?? new Date();

    DateTimePickerAndroid.open({
      value,
      onChange: ({ type }, date) => {
        if (type == "dismissed") return;
        if (!date || type == "neutralButtonPressed") {
          modify(field, { day: undefined, month: undefined, year: undefined });
          return;
        }
        modify(field, {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      },
      mode: "date",
      neutralButton: { label: "Clear", textColor: colors.failure },
      minimumDate: field == "end" ? startDate : undefined,
      maximumDate: field == "start" ? endDate : undefined,
    });
  };

  function save() {
    if (statusMutation.isPending) return;
    statusMutation.mutate(state);
  }

  if (isPending || isError) return;

  const refreshControl = (
    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
  );

  return (
    <View>
      <Box>
        <StatusSelectBottomSheet
          status={state.status}
          visible={modal == ModalScreen.STATUS}
          onClose={unsetModal}
          onChange={(status) => modify("status", status)}
        />
        <NumberBottomSheet
          name="Score"
          visible={modal == ModalScreen.SCORE}
          onClose={unsetModal}
          value={state.score ?? 0}
          onChange={(val) => modify("score", val)}
        />
        <NumberBottomSheet
          name="Progress"
          visible={modal == ModalScreen.PROGRESS}
          onClose={unsetModal}
          value={state.progress ?? 0}
          onChange={(val) => modify("progress", val)}
          max={media.episodesCount}
        />
      </Box>
      <ScrollView refreshControl={refreshControl}>
        <SafeAreaView>
          <Box padding="xl" gap="xl">
            <Heading name={media.status ? "Edit Status" : "Set Status"} />

            <Field
              label="Status"
              content={statusText}
              onPress={() => setModal(ModalScreen.STATUS)}
              tailing={dropdown}
            />
            <Field
              label="Score"
              content={state.score ?? 0}
              onPress={() => setModal(ModalScreen.SCORE)}
              tailing={number}
            />
            <Field
              label="Progress"
              content={state.progress ?? 0}
              onPress={() => setModal(ModalScreen.PROGRESS)}
              tailing={number}
            />
            <Field
              label="Start Date"
              onPress={() => showDatePicker("start")}
              content={mediaDateToString(state.start)}
              tailing={date}
            />
            <Field
              label="Finish Date"
              onPress={() => showDatePicker("end")}
              content={mediaDateToString(state.end)}
              tailing={date}
            />
          </Box>
        </SafeAreaView>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={save}
        disabled={saveDisabled}
      >
        <Box padding="lg">
          <Box
            style={{ justifyContent: "center", alignItems: "center" }}
            row
            rounding="xs"
            height="3xl"
            gap="sm"
            background={saveDisabled ? "secondary" : "primary"}
          >
            <Text style={{ textTransform: "capitalize" }}>
              {statusMutation.isPending ? "Saving" : "Save"}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    </View>
  );
};

interface FieldProps extends TouchableOpacityProps {
  content: string | number;
  tailing: ReactNode;
  label: string;
}

const Field = ({ content, tailing, label, ...props }: FieldProps) => (
  <Box gap="xs">
    <Text>{label}</Text>
    <TouchableOpacity activeOpacity={0.8} {...props}>
      <Box
        row
        paddingHorizontal="lg"
        gap="md"
        rounding="xs"
        background="card"
        style={{ alignItems: "center", height: 40 }}
      >
        <Text style={{ flex: 1 }}>{content}</Text>
        {tailing}
      </Box>
    </TouchableOpacity>
  </Box>
);

export default Status;

const styles = StyleSheet.create({});
