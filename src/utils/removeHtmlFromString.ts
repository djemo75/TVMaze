export const removeHtmlFromString = (value: string) => {
  return value.replace(/<[^>]*>?/gm, '');
};
