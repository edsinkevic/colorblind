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
  id: string;
}

export interface Problem {
  type: string;
  detail: string;
  title: string;
}

export interface ParcelDetails {
  id: string;
  code: string;
  status: ParcelStatus;
  version: number;
}

export enum ParcelStatus {
  REGISTERED = "Registered",
  UNREGISTERED = "Unregistered",
  SUBMITTED = "Submitted",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
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

export interface RegisterCourier {
  name: string;
}

export interface RegisterCourierResponse {
  id: string;
}

export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  Conflict = 409,
}
