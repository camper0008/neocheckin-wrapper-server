
export const clearSpaceBefore = (str: string) => str.replace(/^\s+/gm, '');




export const clearAttributes = (str: string) => str.replace(/<(\w+)[\s][^>]+>/g, '<$1>');
export const getForms = (str: string)        => str.match(/<form>.*?<\/form>/gs);
export const getRows = (form: string)        => form.match(/<tr>.*?<\/tr>/gs)
