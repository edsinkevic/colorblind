export interface PersonInfo {
  fullname: string;
  phoneNumber: string;
  email: string;
  parcelLockerAddress: string;
  takeawayAddress: string;
}

export interface DeliveryType {
  from: string;
  to: string;
}

export interface ParcelRegistration {
  size: string;
  couponCode: string;
  senderDeliveryInfo?: PersonInfo;
  receiverDeliveryInfo?: PersonInfo;
  transactionCode: string;
  invoiceEmail: string;

  deliveryType: DeliveryType;
}

export interface ParcelRegistrationResponse {
  code: string;
}

export interface Problem {
  type: string;
  detail: string;
  title: string;
}

export interface ParcelDetails {
  id: string;
  code: string;
  parcelStatus: string;
}

export interface RegisterTerminalResponse {
  id: string;
}

export interface RegisterTerminal {
  address: string;
}
