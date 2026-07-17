import { sessionParamsFromUrl } from "./oauth-url";

describe("sessionParamsFromUrl", () => {
  it("extracts tokens from the callback fragment", () => {
    const url =
      "fitnessapp://auth-callback#access_token=abc123&expires_in=3600&refresh_token=def456&token_type=bearer";
    expect(sessionParamsFromUrl(url)).toEqual({ accessToken: "abc123", refreshToken: "def456" });
  });

  it("returns null when tokens are missing", () => {
    expect(sessionParamsFromUrl("fitnessapp://auth-callback#error=access_denied")).toBeNull();
    expect(sessionParamsFromUrl("fitnessapp://auth-callback")).toBeNull();
  });
});
