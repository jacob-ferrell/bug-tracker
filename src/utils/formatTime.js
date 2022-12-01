export function formatTime(date) {
  date = new Date(date);
  let end = "AM";
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds();

  if (hours >= 12) {
    end = "PM";
  }

  if (hours > 12) hours %= 12;

  return hours + ":" + minutes + end;
}
