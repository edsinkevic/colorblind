export interface PersonInfo {
  fullname: string;
  phoneNumber: string;
  email: string;
  terminalId?: string;
  takeawayAddress: string;
}

export interface Courier {
  id: string;
  name: string;
  parcelIds: string[];
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

export interface TerminalDetails {
  id: string;
  address: string;
  parcelIds: string[];
}

export interface RegisterTerminalResponse {
  id: string;
}

export interface RegisterTerminal {
  address: string;
}

export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}
