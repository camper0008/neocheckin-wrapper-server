
export const insureUrlPathEnd = (url: string): string => {
  if (!url.endsWith('/'))
    url += '/'
  return url;
}

export const paramString = (data: Record<string, string>): string => {
  const params = new URLSearchParams(data);
  const pstr = params.toString()
  return pstr ? '?' + pstr : '';
}
