export function formatCurrentTime() {
  const now = new Date();

  const options: any = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDateTime = formatter.format(now).split(',');

  const timeString = formattedDateTime.pop();
  const dateString = `${formattedDateTime[0]} ${formattedDateTime[1]}`

  return `${timeString} - ${dateString}`;
}
