export const vt = (t: (key: string) => string, key: string) =>
  t(`validation.${key}`);
