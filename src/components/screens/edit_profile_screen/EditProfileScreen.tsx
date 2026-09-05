import { ErrorUI, LoadingUI, SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Edit Profile screen. The user's name and avatar are owned by Clerk;
// we read them via `useUser` and write via `user.update`. The email
// field is read-only — email changes go through Clerk's account
// management UI so the verification flow stays consistent.
export const EditProfileScreen = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { colors } = useThemeColor();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate the local form state from Clerk on first load. We do this
  // in a `useEffect` (rather than `useState`'s initializer) because
  // `isLoaded` is false on the first render — Clerk resolves the
  // session asynchronously.
  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <LoadingUI />;
  if (!user) return <ErrorUI />;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      Alert.alert("Profile updated", "Your changes have been saved.");
      router.back();
    } catch (err: any) {
      Alert.alert(
        "Couldn’t save",
        err?.errors?.[0]?.message || err?.message || "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const dirty =
    firstName.trim() !== (user.firstName ?? "") ||
    lastName.trim() !== (user.lastName ?? "");

  return (
    <SafeScreen>
      <ScreenHeader title="Edit Profile" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="items-center my-6">
          <View className="relative">
            <Image
              source={user.imageUrl}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              transition={200}
            />
            <View className="absolute -bottom-1 -right-1 bg-primary dark:bg-primary rounded-full size-8 items-center justify-center border-2 border-background">
              <Icon name="camera" size={16} color="onPrimary" />
            </View>
          </View>
          <Text className="text-text-secondary dark:text-text-secondary text-xs mt-3">
            Tap the avatar to change it (managed by Clerk)
          </Text>
        </View>

        <View className="bg-surface dark:bg-surface rounded-2xl p-4">
          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 text-text-primary dark:text-text-primary mb-4"
            autoCapitalize="words"
          />

          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.input.placeholder}
            className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 text-text-primary dark:text-text-primary mb-4"
            autoCapitalize="words"
          />

          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-2">Email</Text>
          <View className="bg-surface-elevated dark:bg-surface-elevated rounded-xl px-4 py-3 mb-2">
            <Text className="text-text-secondary dark:text-text-secondary">
              {user.emailAddresses?.[0]?.emailAddress || "—"}
            </Text>
          </View>
          <Text className="text-text-secondary dark:text-text-secondary text-[10px]">
            Email is managed by Clerk. Tap the avatar above to update
            account-level settings.
          </Text>
        </View>

        <TouchableOpacity
          disabled={!dirty || isSaving}
          onPress={handleSave}
          activeOpacity={0.85}
          className={`rounded-2xl py-4 items-center mt-6 ${
            !dirty || isSaving ? "bg-primary/50" : "bg-primary"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text className="text-on-primary font-bold text-base">
              Save changes
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};
