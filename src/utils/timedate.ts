
export const formatFileFriendly = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  + `_${date.getHours() - 1}-${date.getMinutes()}-${date.getSeconds()}`;
}

