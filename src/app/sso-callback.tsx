import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

/**
 * Handles the OAuth callback deep link (`vipcollectionemobile://sso-callback?...`).
 *
 * When Clerk completes the OAuth round-trip, it deep-links the app to
 * `sso-callback` with `created_session_id` and `rotating_token` in the
 * query string. On warm starts (the app was killed by the OS during the
 * OAuth flow) this route is the entry point.
 *
 * The Clerk SDK automatically picks up the `created_session_id` from the
 * URL and activates the session. We just wait for `isSignedIn` to flip
 * true, then redirect to the Shop tab.
 */
export default function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const { colors } = useThemeColor();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
