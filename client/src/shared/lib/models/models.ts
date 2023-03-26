export interface PersonInfo {
  fullname: string;
  phoneNumber: string;
  email: string;
  parcelLockerId?: string;
}

export interface ParcelRegistration {
  size: string;
  couponCode: string;
  senderInfo?: PersonInfo;
  receiverInfo?: PersonInfo;
  transactionId: string;
}

export interface ParcelRegistrationResponse {
  registrationCode: string;
}

export interface Problem {
  type: string;
  detail: string;
  title: string;
}
