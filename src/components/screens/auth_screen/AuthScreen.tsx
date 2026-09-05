import { useSocialAuth } from "@/hooks";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-background">
      <Image
        source={require("@/assets/images/auth-image.png")}
        className="size-96"
        resizeMode="contain"
      />

      <View className="gap-2 mt-3">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={loadingStrategy !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {loadingStrategy === "oauth_google" ? (
            <ActivityIndicator size="small" color="#4285f4" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />

              <Text className="text-black font-medium text-base">
                Continue With Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={loadingStrategy !== null}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2,
          }}
        >
          {loadingStrategy === "oauth_apple" ? (
            <ActivityIndicator size="small" color="#4285f4" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/apple.png")}
                className="size-8 mr-3"
                resizeMode="contain"
              />

              <Text className="text-black font-medium text-base">
                Continue With Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-text-secondary dark:text-text-secondary text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our{" "}
        <Text className="text-primary">Terms</Text>
        {", "}
        <Text className="text-primary">Privacy Policy</Text>
        {", and "}
        <Text className="text-primary">Cookie Use</Text>
      </Text>
    </View>
  );
};
