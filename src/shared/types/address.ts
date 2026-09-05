// Address shape — used by both the mobile checkout screen (which
// selects from the user's saved addresses) and the admin order
// detail page (which renders the shipping address).
export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}
