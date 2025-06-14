import { useRouter } from "expo-router";

// ---------------------
// CONSTS
// ---------------------
const router = useRouter();
const today = new Date();

// ---------------------
// FUNCTIONS
// ---------------------
export const uncapitalise = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

export const getLocalTime = (
  dateTime: string | Date,
  timeframe: "time" | "date" | "both" = "time",
  outputType: "string" | "date" = "string"
) => {
  // const gmtTime =
  //   typeof dateTime === typeof "" ? new Date(dateTime) : (dateTime as Date);
  const gmtTime = new Date(dateTime);

  if (timeframe === "both") {
    const dateArray = gmtTime.toLocaleDateString().split("/");
    return `${dateArray[2]}-${dateArray[1]}-${
      dateArray[0]
    }T${gmtTime.toLocaleTimeString()}Z`;
  }

  const localTimeZoneOffset = new Date().getTimezoneOffset();
  gmtTime.setMinutes(gmtTime.getMinutes() - localTimeZoneOffset);

  if (timeframe === "time") {
    return gmtTime.toLocaleTimeString().slice(0, 5);
  } else {
    return outputType === "date"
      ? gmtTime
      : gmtTime.toLocaleDateString().slice(0, 10);
  }
};

export const openLogModal = (log: LogType, date: string, time: string) => {
  const params = Object.assign(log);
  params["date"] = date;
  params["time"] = time;
  router.push({
    pathname: "/logModal",
    params: params,
  });
};

export const prettifyDate = (date: string) => {
  let prettyDate = "";
  let dateFormat = new Date(date);
  // Year
  const yearString = String(dateFormat.getFullYear());
  const currentYearString = String(today.getFullYear());
  const isItCurrentYear = yearString == currentYearString ? true : false;
  // Month
  const monthString = String(
    dateFormat.toLocaleDateString("default", { month: "long" })
  );
  const currentMonth = String(
    today.toLocaleDateString("default", { month: "long" })
  );
  const isItCurrentMoth = monthString == currentMonth ? true : false;

  // If log is of this year and month, check if it's in this week, else don't bother lol
  const inWeek =
    isItCurrentYear && isItCurrentMoth ? isInWeek(dateFormat) : false;

  // FORMAT DATE
  if (inWeek) {
    prettyDate = inWeek;
  } else {
    const dayString = String(
        dateFormat.toLocaleDateString("default", { weekday: "long" })
      ),
      dateString = String(dateFormat.getDate());

    // If year == current year, display weekday name, but not year. Otherwise, don't display weekday name, but display year.
    prettyDate = isItCurrentYear
      ? `${dayString}, ${dateString} ${monthString}`
      : `${dateString} ${monthString} ${yearString}`;
  }
  return prettyDate;
};

export const isInWeek = (date: Date) => {
  // Reduce day difference between the given date and today's date
  for (let i = 6; i >= 0; i--) {
    const givenDate = new Date(date);
    givenDate.setDate(date.getDate() + i);

    if (String(givenDate).slice(0, 10) == String(today).slice(0, 10)) {
      if (i > 1) {
        return date.toLocaleDateString("default", { weekday: "long" });
      } else if (i == 1) {
        return "Yesterday";
      }
      return "Today";
    }
  }
  return false;
};

export const keyExtractor = (item: any, index: number) =>
  "key-" + index.toString();

export const sortDiaryData = (
  field: "root" | "need" | "extra",
  newData: string,
  existingData: DiaryType | undefined
) => {
  switch (field) {
    case "root":
      return {
        root: newData,
        need: existingData?.need,
        extra: existingData?.extra,
      };
    case "need":
      return {
        root: existingData?.root,
        need: newData,
        extra: existingData?.extra,
      };
    case "extra":
      return {
        root: existingData?.root,
        need: existingData?.need,
        extra: newData,
      };
    default:
      return {
        root: existingData?.root,
        need: existingData?.need,
        extra: existingData?.extra,
      };
  }
};
