import { ActivityIndicator, Text, View } from "react-native";
import { SafeScreen } from "../safe_screen";

export const LoadingUI = () => {
  return (
    <SafeScreen>
      {/* <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
      </View> */}
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading...</Text>
      </View>
    </SafeScreen>
  );
};
