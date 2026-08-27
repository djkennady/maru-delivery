export type RkeeperSyncStatus =
  | "disabled"
  | "skipped"
  | "sent"
  | "failed"
  | "not_implemented";

export interface RkeeperConfig {
  enabled: boolean;
  baseUrl: string;
  objectId: string;
  stationId: string;
  username: string;
  password: string;
  /** Если true — ошибка кипера ломает оформление заказа */
  failOrderOnError: boolean;
}

export interface RkeeperOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  rkeeperCode?: string;
  size?: string;
  milk?: string;
}

export interface RkeeperOrderPayload {
  externalOrderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  comment?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
  items: RkeeperOrderItem[];
}

export interface RkeeperSyncResult {
  status: RkeeperSyncStatus;
  externalId?: string;
  message?: string;
  payload?: RkeeperOrderPayload;
}
