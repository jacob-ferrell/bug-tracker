export function formatTime(date) {
  date = new Date(date);
  let end = 'AM';
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds();

  if (hours > 12) end = 'PM';

  return (hours % 12) + ':' + minutes + end;
}
