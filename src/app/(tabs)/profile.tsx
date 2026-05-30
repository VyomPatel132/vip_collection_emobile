import { ProfileScreen, SafeScreen } from "@/components";

const Profile = () => {
  return (
    <SafeScreen>
      <ProfileScreen />
    </SafeScreen>
  );
};

export default Profile;
