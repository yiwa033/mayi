export type FlowType = "raw" | "discounted";

export type GameStatus = "enabled" | "disabled";

export interface GameItem {
  id: string;
  name: string;
  code: string;
  status: GameStatus;
  note: string;
}

export interface RDRecord {
  id: string;
  month: string;
  gameName: string;
  recharge: number;
  discount: number;
  minorRefund: number;
  testFee: number;
  voucher: number;
  channelFeeRate: number;
  withholdingTaxRate: number;
  shareRatio: number;
  note: string;
}

export interface ChannelRecord {
  id: string;
  month: string;
  channelName: string;
  gameName: string;
  recharge: number;
  discount: number;
  playerRefund: number;
  testFee: number;
  voucher: number;
  serverFee: number;
  channelFeeRate: number;
  rdShareRatio: number;
  note: string;
}
