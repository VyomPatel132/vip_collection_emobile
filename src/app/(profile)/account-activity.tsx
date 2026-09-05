import { ComingSoonScreen } from "@/components";

const AccountActivity = () => {
  return (
    <ComingSoonScreen
      // The screen reads title/description from URL params via
      // `useLocalSearchParams` (set on the screen itself by expo-router
      // at mount time). The screen's default copy is descriptive enough
      // when no params are provided.
    />
  );
};

export default AccountActivity;
