export const getGMTOffset = (gmtOffset: string) => {
  if (gmtOffset.startsWith('-')) {
    return gmtOffset;
  }

  return `+${gmtOffset}`;
};
