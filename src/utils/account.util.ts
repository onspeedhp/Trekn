import moment from "moment";

export const sortDataByTimeline = (data: any) => {
  const result: any = {};
  data.sort((a: any,b: any) => {
    const dateA = new Date(a?.created_at);
    const dateB = new Date(b?.created_at);

    if (dateA < dateB) {
        return -1;
    }
    if (dateA < dateB) {
        return 1;
    }
    return 0;
  }).reverse();

  data.map((item: any) => {
    const date = new Date(item?.created_at);
    const key = isTodayOrYesterday(date);
    result[key] = [...(result[key] || []), item];
  });
  console.log(result);
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

export const getScore = (data: any) => {
  if (data.type === "minted") {
    return calculateScore(data?.drop?.reaction_counts);
  } else {
    return calculateScore(data?.reaction_counts);
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
  if (dayDiff < 1 && today.getDate() === target.getDate()) {
    return "Today";
  } else if (dayDiff < 2) {
    return "Yesterday";
  } else {
    return `${target.getDate()}-${
      target.getMonth() + 1
    }-${target.getFullYear()}`;
  }
};


