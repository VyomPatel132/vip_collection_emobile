import { Icon } from "@/components/ui";
import { Address } from "@/types";
import { Text, TouchableOpacity, View } from "react-native";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string, label: string) => void;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = (props) => {
  const { address, onEdit, onDelete, isUpdatingAddress, isDeletingAddress } =
    props;

  return (
    <View className="bg-surface dark:bg-surface rounded-3xl p-5 mb-3">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-3">
            <Icon name="location" size={24} color="primary" />
          </View>
          <Text className="text-text-primary dark:text-text-primary font-bold text-lg">
            {address.label}
          </Text>
        </View>
        {address.isDefault && (
          <View className="bg-primary dark:bg-primary px-3 py-1 rounded-full">
            <Text className="text-on-primary dark:text-on-primary text-xs font-bold">
              Default
            </Text>
          </View>
        )}
      </View>
      <View className="ml-15">
        <Text className="text-text-primary dark:text-text-primary font-semibold mb-1">
          {address.fullName}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary text-sm mb-1">
          {address.streetAddress}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary text-sm mb-2">
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary text-sm">
          {address.phoneNumber}
        </Text>
      </View>
      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          className="flex-1 bg-primary/20 dark:bg-primary/20 py-3 rounded-xl items-center"
          activeOpacity={0.7}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Text className="text-primary dark:text-primary font-bold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-danger/20 dark:bg-danger/20 py-3 rounded-xl items-center"
          activeOpacity={0.7}
          onPress={() => onDelete(address._id, address.label)}
          disabled={isDeletingAddress}
        >
          <Text className="text-danger dark:text-danger font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
