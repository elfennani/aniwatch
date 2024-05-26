import useWatchedMutation from "@/api/use-watched-mutation";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useRef } from "react";

const useUpdateEntry = (episode: number, id: number, media: ShowDetails) => {
  const updatedEntry = useRef(false);
  const { mutate, isPending, isSuccess } = useWatchedMutation(
    { episode, showId: id },
    media.status != "COMPLETED",
    () => updatedEntry.current == true
  );

  function update() {
    if (
      updatedEntry.current ||
      media.status == "COMPLETED" ||
      (media.progress ?? 0) >= episode ||
      isPending ||
      isSuccess
    )
      return;
    mutate();
  }

  return update;
};

export default useUpdateEntry