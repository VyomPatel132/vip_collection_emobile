import { SafeScreen } from "@/components/custom";
import { Icon } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

export const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress,
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {
  const { colors } = useThemeColor();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 py-5 border-b border-border dark:border-border flex-row items-center justify-between">
            <Text className="text-text-primary dark:text-text-primary text-2xl font-bold">
              {isEditing ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={28} color="text" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  Label
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary p-4 rounded-2xl text-base"
                  placeholder="e.g., Home, Work, Office"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.label}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, label: text })
                  }
                />
              </View>

              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  Full Name
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.fullName}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, fullName: text })
                  }
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  Street Address
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="Street address, apt/suite number"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.streetAddress}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, streetAddress: text })
                  }
                  multiline
                />
              </View>

              {/* City Input */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  City
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g., New York"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.city}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, city: text })
                  }
                />
              </View>

              {/* State Input */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  State
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g., NY"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.state}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, state: text })
                  }
                />
              </View>

              {/* ZIP Code Input */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  ZIP Code
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="e.g., 10001"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.zipCode}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, zipCode: text })
                  }
                  keyboardType="numeric"
                />
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="text-text-primary dark:text-text-primary font-semibold mb-2">
                  Phone Number
                </Text>
                <TextInput
                  className="bg-surface dark:bg-surface text-text-primary dark:text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={colors.input.placeholder}
                  value={addressForm.phoneNumber}
                  onChangeText={(text) =>
                    onFormChange({ ...addressForm, phoneNumber: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              {/* Default Address Toggle */}
              <View className="bg-surface dark:bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
                <Text className="text-text-primary dark:text-text-primary font-semibold">
                  Set as default address
                </Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) =>
                    onFormChange({ ...addressForm, isDefault: value })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.text.primary}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-primary dark:bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                {isAddingAddress || isUpdatingAddress ? (
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                  <Text className="text-on-primary dark:text-on-primary font-bold text-lg">
                    {isEditing ? "Save Changes" : "Add Address"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};
