import { accountSettings } from "@/lib/security_data";
import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

type SecurityOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "navigation" | "toggle";
  route?: string;
  value?: boolean;
};

// Local-only toggles. The mobile app has no backend preferences
// endpoint today; when it does, we replace the local state with a
// `useMutation` that PATCHes `/api/users/me/preferences`.
export const PrivacySecurityScreen = () => {
  const { user } = useUser();
  const { colors } = useThemeColor();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: "password",
      icon: "lock-closed-outline",
      title: "Change Password",
      description: "Update your account password",
      type: "navigation",
      route: "/(profile)/change-password",
    },
    {
      id: "two-factor",
      icon: "shield-checkmark-outline",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      type: "toggle",
      value: twoFactorEnabled,
    },
    {
      id: "biometric",
      icon: "finger-print-outline",
      title: "Biometric Login",
      description: "Use Face ID or Touch ID",
      type: "toggle",
      value: biometricEnabled,
    },
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: "push",
      icon: "notifications-outline",
      title: "Push Notifications",
      description: "Receive push notifications",
      type: "toggle",
      value: pushNotifications,
    },
    {
      id: "email",
      icon: "mail-outline",
      title: "Email Notifications",
      description: "Receive order updates via email",
      type: "toggle",
      value: emailNotifications,
    },
    {
      id: "marketing",
      icon: "megaphone-outline",
      title: "Marketing Emails",
      description: "Receive promotional emails",
      type: "toggle",
      value: marketingEmails,
    },
    {
      id: "data",
      icon: "analytics-outline",
      title: "Share Usage Data",
      description: "Help us improve the app",
      type: "toggle",
      value: shareData,
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "biometric":
        setBiometricEnabled(value);
        break;
      case "push":
        setPushNotifications(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
      case "data":
        setShareData(value);
        break;
    }
  };

  const handlePress = (setting: SecurityOption) => {
    if (setting.type === "navigation" && setting.route) {
      router.push(setting.route as any);
    }
  };

  return (
    <SafeScreen>
      <ScreenHeader title="Privacy & Security" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* SECURITY SECTION */}
        <View className="px-6 pt-6">
          <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-4">
            Security
          </Text>

          {securitySettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface dark:bg-surface rounded-2xl p-4 mb-3"
              activeOpacity={setting.type === "toggle" ? 1 : 0.7}
              onPress={() => handlePress(setting)}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Icon name={setting.icon as any} size={24} color="primary" />
                </View>

                <View className="flex-1">
                  <Text className="text-text-primary dark:text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary dark:text-text-secondary text-sm">
                    {setting.description}
                  </Text>
                </View>

                {setting.type === "toggle" ? (
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    thumbColor={colors.text.primary}
                    trackColor={{
                      false: colors.border,
                      true: colors.primary,
                    }}
                  />
                ) : (
                  <Icon name="chevron-forward" size={20} color="muted" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRIVACY SECTION */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-4">
            Privacy
          </Text>

          {privacySettings.map((setting) => (
            <View key={setting.id}>
              <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Icon name={setting.icon as any} size={24} color="primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary dark:text-text-primary font-bold text-base mb-1">
                      {setting.title}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary text-sm">
                      {setting.description}
                    </Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{
                      false: colors.border,
                      true: colors.primary,
                    }}
                    thumbColor={colors.text.primary}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SECTION */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-4">
            Account
          </Text>

          {accountSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface dark:bg-surface rounded-2xl p-4 mb-3"
              activeOpacity={0.7}
              onPress={() => router.push(setting.route as any)}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Icon name={setting.icon as any} size={24} color="primary" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary dark:text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary dark:text-text-secondary text-sm">
                    {setting.description}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color="muted" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACCOUNT */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            className="bg-surface dark:bg-surface rounded-2xl p-5 flex-row items-center justify-between border-2 border-danger/20 dark:border-danger/20"
            activeOpacity={0.7}
            onPress={() => router.push("/(profile)/delete-account" as any)}
          >
            <View className="flex-row items-center">
              <View className="bg-danger/20 dark:bg-danger/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Icon name="trash-outline" size={24} color="danger" />
              </View>
              <View>
                <Text className="text-danger dark:text-danger font-bold text-base mb-1">
                  Delete Account
                </Text>
                <Text className="text-text-secondary dark:text-text-secondary text-sm">
                  Permanently delete your account
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="danger" />
          </TouchableOpacity>
        </View>

        {/* INFO ALERT */}
        <View className="px-6 pt-6 pb-4">
          <View className="bg-primary/10 rounded-2xl p-4 flex-row">
            <Icon
              name="information-circle-outline"
              size={24}
              color="primary"
            />
            <Text className="text-text-secondary dark:text-text-secondary text-sm ml-3 flex-1">
              {user
                ? `Signed in as ${user.emailAddresses?.[0]?.emailAddress ?? "—"}. We take your privacy seriously.`
                : "We take your privacy seriously. Your data is encrypted and stored securely. You can manage your privacy settings at any time."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};
