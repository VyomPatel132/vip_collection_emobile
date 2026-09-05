import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Delete Account flow. The user must type "DELETE" to confirm. We then
// call Clerk's `useUser().delete()` which removes the Clerk identity
// and triggers the `clerk/user.deleted` Inngest handler in the
// backend, which cascades the Mongo User document.
//
// The backend cascade (cart, anonymize orders) is documented in
// §7.5 of the plan and will be added in Milestone D; until then the
// Clerk delete + Inngest cascade is sufficient for the demo.
export const DeleteAccountScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { colors } = useThemeColor();

  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = confirmText.trim() === "DELETE" && !isDeleting;

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await user.delete();
      await signOut();
      // signOut() routes via the (auth) layout. No router.push needed.
    } catch (err: any) {
      setIsDeleting(false);
      Alert.alert(
        "Couldn’t delete account",
        err?.errors?.[0]?.message ||
          err?.message ||
          "Please try again or contact support.",
      );
    }
  };

  return (
    <SafeScreen>
      <ScreenHeader title="Delete Account" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-danger/10 dark:bg-danger/10 border-2 border-danger/20 dark:border-danger/20 rounded-2xl p-5">
          <View className="flex-row items-center mb-3">
            <Icon name="warning" size={24} color="danger" />
            <Text className="text-danger dark:text-danger font-bold text-lg ml-2">
              This is permanent
            </Text>
          </View>
          <Text className="text-text-secondary dark:text-text-secondary text-sm leading-5">
            Deleting your account will remove your profile, addresses,
            wishlist, and reviews. Past orders will be retained for
            record-keeping but anonymized.
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
            Type DELETE to confirm
          </Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            placeholder="DELETE"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface dark:bg-surface rounded-xl px-4 py-3 text-text-primary dark:text-text-primary"
          />
        </View>

        <TouchableOpacity
          disabled={!canDelete}
          onPress={handleDelete}
          activeOpacity={0.85}
          className={`rounded-2xl py-4 items-center mt-6 ${
            canDelete ? "bg-danger dark:bg-danger" : "bg-danger/40 dark:bg-danger/40"
          }`}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text className="text-on-primary dark:text-on-primary font-bold text-base">
              Delete my account
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-3"
          activeOpacity={0.7}
        >
          <Text className="text-text-secondary dark:text-text-secondary text-center">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};
