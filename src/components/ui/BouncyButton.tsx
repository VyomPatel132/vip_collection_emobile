import { useReducedMotion } from "@/hooks/useReducedMotion";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * `TouchableOpacity` wrapped in a Reanimated scale animation.
 * On press the inner view bounces 1.0 → 1.06 → 1.0 in 180ms —
 * enough to feel tactile, short enough not to slow the user.
 *
 * Honors the system "Reduce Motion" preference: if the user has
 * Reduce Motion on, the scale animation is skipped (the press still
 * registers via `TouchableOpacity`'s default opacity feedback).
 *
 * Extracted from `ProductDetailScreen.tsx` so the cart quantity
 * stepper can use the same pattern.
 */
interface BouncyButtonProps extends TouchableOpacityProps {
  /** Override the press scale (defaults to 1.06). */
  pressScale?: number;
  /** When true, skip the animation entirely (used when Reduce Motion is on). */
  disabledAnimation?: boolean;
}

export const BouncyButton = ({
  pressScale = 1.06,
  disabledAnimation = false,
  onPress,
  disabled,
  children,
  ...rest
}: BouncyButtonProps) => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shouldAnimate = !disabledAnimation && !reduceMotion;

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        {...rest}
        disabled={disabled}
        onPress={(e) => {
          if (shouldAnimate) {
            // 1.0 → 1.06 → 1.0 over 180ms — punchy, not bouncy.
            scale.value = withSequence(
              withTiming(pressScale, { duration: 90 }),
              withTiming(1, { duration: 90 }),
            );
          }
          onPress?.(e);
        }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
