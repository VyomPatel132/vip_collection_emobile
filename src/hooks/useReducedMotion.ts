import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Returns the system "Reduce Motion" preference. When the user has
 * Reduce Motion on, animated UI should short-circuit non-essential
 * motion (entrance animations, press-scale feedback, etc.) so the
 * app stays usable for users with vestibular disorders.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Initial read.
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });

    // Subscribe to changes so a system setting flip while the app
    // is open is picked up.
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (value) => {
        if (mounted) setReduced(value);
      },
    );

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
