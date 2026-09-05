import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUser } from "@clerk/expo";
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

// Change password. Clerk's `updatePassword` is the source of truth for
// mobile — it rotates the credential, invalidates other sessions, and
// emails the user. We collect the current + new password here and
// forward to Clerk.
export const ChangePasswordScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useThemeColor();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canSave =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    !isSaving;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      Alert.alert(
        "Password updated",
        "Use your new password the next time you sign in.",
      );
      router.back();
    } catch (err: any) {
      Alert.alert(
        "Couldn’t update password",
        err?.errors?.[0]?.message ||
          err?.message ||
          "Please check your current password and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      <ScreenHeader title="Change Password" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-surface dark:bg-surface rounded-2xl p-4">
          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">
            Current password
          </Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Current password"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 text-text-primary dark:text-text-primary mb-4"
          />

          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">
            New password
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="At least 8 characters"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 text-text-primary dark:text-text-primary mb-4"
          />

          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">
            Confirm new password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Re-enter new password"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 text-text-primary dark:text-text-primary"
          />
          {confirmPassword.length > 0 &&
            newPassword !== confirmPassword && (
              <Text className="text-danger dark:text-danger text-xs mt-2">
                Passwords don't match.
              </Text>
            )}
        </View>

        <Text className="text-text-secondary dark:text-text-secondary text-xs mt-3 px-2">
          Changing your password will sign you out of other devices.
        </Text>

        <TouchableOpacity
          disabled={!canSave}
          onPress={handleSave}
          activeOpacity={0.85}
          className={`rounded-2xl py-4 items-center mt-6 ${
            !canSave ? "bg-primary/50" : "bg-primary"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text className="text-on-primary font-bold text-base">
              Update password
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};
