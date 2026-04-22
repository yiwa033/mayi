import { round2 } from "@/lib/money";
import { ChannelRecord, FlowType } from "@/lib/types";

export interface ChannelCalculated {
  discountedFlow: number;
  channelFeeAmount: number;
  distributableBase: number;
  rdShareAmount: number;
  channelGrossProfit: number;
  settlementAmount: number;
}

export function calcChannelRow(
  row: ChannelRecord,
  flowType: FlowType,
): ChannelCalculated {
  const discountedFlow =
    flowType === "raw" ? row.recharge * row.discount : row.recharge;
  const channelFeeAmount = discountedFlow * row.channelFeeRate;
  const distributableBase =
    discountedFlow -
    row.playerRefund -
    row.testFee -
    row.voucher -
    row.serverFee -
    channelFeeAmount;
  const rdShareAmount = distributableBase * row.rdShareRatio;
  const channelGrossProfit = distributableBase - rdShareAmount;
  return {
    discountedFlow: round2(discountedFlow),
    channelFeeAmount: round2(channelFeeAmount),
    distributableBase: round2(distributableBase),
    rdShareAmount: round2(rdShareAmount),
    channelGrossProfit: round2(channelGrossProfit),
    settlementAmount: round2(channelGrossProfit),
  };
}
