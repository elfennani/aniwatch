import MediaStatus from "@/interfaces/MediaStatus";

const statusToString = (status: MediaStatus) => {
  if (status == "CURRENT") return "watching"
  if (status == "PLANNING") return "planning"
  if (status == "COMPLETED") return "completed"
  if (status == "DROPPED") return "dropped"
  if (status == "PAUSED") return "paused"
  if (status == "REPEATING") return "repeating"
}

export default statusToString