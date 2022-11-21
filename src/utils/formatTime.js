export function formatTime(date) {
  date = new Date(date);
  let end = 'AM';
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (hours > 12) end = 'PM';

  return (hours % 12) + ':' + minutes + end;
}
