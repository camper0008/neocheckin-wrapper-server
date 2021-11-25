
export const formatFileFriendly = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  + `_${date.getUTCHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

export const getDateFromDateOrString = (date?: Date | string) => {
  if (typeof date === 'string')
    return new Date(date);
  else 
    return date ?? new Date();
}
