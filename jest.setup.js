process.env.EXPO_PUBLIC_SUPABASE_URL ??= "https://unit-tests.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= "unit-test-anon-key";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
