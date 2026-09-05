import { Icon } from "@/components/ui";
import {
  ACCENT_PRESETS,
  useAccentColor,
} from "@/context/AccentColorContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * Preset accent color grid. Renders only when
 * `EXPO_PUBLIC_ENABLE_ACCENT_PICKER=true` is set; otherwise the
 * section is hidden entirely.
 *
 * The user's choice is stored in SecureStore and exposed via
 * `useAccentColor()`. Components that need a raw accent color
 * (Switch track, icon circles, etc.) should read `effective` from
 * the context — that falls back to the active theme's `primary`
 * token when the user hasn't picked anything.
 */
export const AccentColorPicker = () => {
  const { accent, setAccent, effective, enabled } = useAccentColor();
  const { colors } = useThemeColor();

  if (!enabled) return null;

  return (
    <View className="px-6 pt-4">
      <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-4">
        Accent Color
      </Text>

      <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-3">
        <View className="flex-row items-center mb-4">
          <View
            className="rounded-full w-12 h-12 items-center justify-center mr-4"
            style={{ backgroundColor: effective + "33" }}
          >
            <Icon name="color-palette-outline" size={24} color={effective} />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary dark:text-text-primary font-bold text-base mb-1">
              {accent ? "Custom accent" : "Default (blue)"}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-sm">
              Tap a swatch to change the app accent
            </Text>
          </View>
          {accent && (
            <TouchableOpacity
              onPress={() => setAccent(null)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                className="font-semibold text-sm"
                style={{ color: effective }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row flex-wrap gap-3">
          {ACCENT_PRESETS.map((hex) => {
            const active = (accent ?? ACCENT_PRESETS[0]) === hex;
            return (
              <TouchableOpacity
                key={hex}
                onPress={() => setAccent(hex)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Select accent ${hex}`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: hex,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: active ? 3 : 0,
                  borderColor: colors.text.primary,
                }}
              >
                {active && (
                  <Icon name="checkmark" size={20} color={colors.onPrimary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};
