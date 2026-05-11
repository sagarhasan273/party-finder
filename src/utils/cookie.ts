export const setCookie = (
  name: string,
  value: string,
  days: number = 30,
): void => {
  const maxAge = days * 24 * 60 * 60;

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAge}; secure; samesite=strict`;
};

export const getCookie = (name: string): string | undefined =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
