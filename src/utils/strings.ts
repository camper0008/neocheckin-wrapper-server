
export const padString = (value: string, minLength: number): string => {
  let res = value;
  while (res.length < minLength)
    res += ' ';
  return res;
}

export const padStringBehind = (value: string, minLength: number): string => {
  let res = value;
  while (res.length < minLength)
    res = ' ' + res;
  return res;
}

export const padRfid = (rfid: number): string => {
  return padStringBehind(rfid.toString(), 10).replace(/ /g, '0');
}


export const getRfidAsNumber = (rfid: string): number => {
  let rfidSigStart = rfid;
  while (rfidSigStart.charAt(0) === '0')
    rfidSigStart = rfidSigStart.slice(1);
  return parseInt(rfidSigStart);
}
