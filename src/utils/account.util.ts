export const sortDataByTimeline = (data: any) => {
  const result: any = {};
  data.map((item: any) => {
    const date = new Date(item?.created_at);
    const key = isTodayOrYesterday(date);
    result[key] = [...(result[key] || []), item];
  });
  return result;
};

export const checkClassNameAccountItem = (
  itemIdx: number,
  data: Array<any>,
  dataIdx: number,
  userData: any
) => {
  return dataIdx + 1 !== Object.entries(userData).length
    ? "h-16"
    : itemIdx + 1 === data.length
    ? ""
    : "h-9";
};

export const getTime = (date: string) => {
  const time = new Date(date);
  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const getScore = (data: any) => {
  if (data.type === "drop") {
    return calculateScore(data?.reaction_counts);
  } else {
    return calculateScore(data?.drop?.reaction_counts);
  }
};

const calculateScore = (data: any) => {
  let total = 0;
  let totalScore = 0;
  Object.entries(data).map(([key, item]: any) => {
    total += Number(item);
    switch (key) {
      case "0":
        totalScore += 5 * Number(item);
        break;
      case "1":
        totalScore += 4 * Number(item);
        break;
      case "2":
        totalScore += 3 * Number(item);
        break;
      case "3":
        totalScore += 2 * Number(item);
        break;
      default:
        totalScore += 1 * Number(item);
    }
  });
  return `${total === 0 ? 0 : totalScore / total} (${total})`;
};

const isTodayOrYesterday = (date: any) => {
  const today = new Date();
  const target = new Date(date);
  const diff = today.getTime() - target.getTime();
  const dayDiff = diff / (1000 * 3600 * 24);
  if (dayDiff < 1) {
    return "Today";
  } else if (dayDiff < 2) {
    return "Yesterday";
  } else {
    return `${target.getDate()}-${
      target.getMonth() + 1
    }-${target.getFullYear()}`;
  }
};
