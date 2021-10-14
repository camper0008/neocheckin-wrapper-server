
export const insureUrlPathEnd = (url: string): string => {
  if (!url.endsWith('/'))
    url += '/'
  return url;
}
