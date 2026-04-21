import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatUpdatedAt = (updatedAt?: string) => {
  if (!updatedAt) return "-";

  const parsed = dayjs.utc(updatedAt).tz("Asia/Seoul");
  return parsed.isValid() ? parsed.format("YYYY-MM-DD HH:mm") : updatedAt;
};
