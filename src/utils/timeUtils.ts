import { FlexTime } from "../models/Elev";

export const flexTimeFromString = (flex: string): FlexTime => {
  let [hoursString, minutesString] = [flex.split(':')[0], flex.split(':')[1]];
  
  let isNegative = false;
  if (hoursString.slice(0, 1) === '-') {
    isNegative = true;
    hoursString = hoursString.slice(1);
  }

  const [hoursPartial, minutesPartial] = [parseInt(hoursString), parseInt(minutesString)]
  const secondsTotal = (hoursPartial * 60 + minutesPartial) * 60;
  
  return {
    secondsTotal,
    hoursPartial,
    minutesPartial,
    isNegative,
  };
}
