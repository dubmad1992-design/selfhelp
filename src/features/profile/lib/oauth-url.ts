/** Pull access/refresh tokens out of an OAuth callback URL fragment. */
export function sessionParamsFromUrl(url: string) {
  const fragment = url.split("#")[1] ?? "";
  const params = new URLSearchParams(fragment);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}
