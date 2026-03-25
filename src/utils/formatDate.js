export function formatDate(date) {
  date = new Date(date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  return month + "/" + day + "/" + year;
}
