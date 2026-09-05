import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

// Gate every screen under `/(profile)/...` — addresses, checkout,
// orders, wishlist, privacy, etc. — so an unauthenticated deep link
// bounces to the auth screen rather than rendering a screen that
// immediately errors on a Clerk-protected API call.
export default function ProfileRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
