import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

// The `scheme` here must match the one registered in app.json. After
// the OAuth round-trip, Clerk deep-links the user to this URL, which
// expo-router maps to the `sso-callback` route. That route waits for
// `isSignedIn` to become true and then redirects to the Shop tab.
const SSO_CALLBACK_URL = Linking.createURL("sso-callback", {
  scheme: "vipcollectionemobile",
});

export const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: SSO_CALLBACK_URL,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        // Explicitly push into the tabs group. Relying on the (auth)
        // layout's <Redirect> doesn't navigate on first login because
        // /(tabs) hasn't been pushed onto the stack yet.
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error in social auth: ", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
};
