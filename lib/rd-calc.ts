import { round2 } from "@/lib/money";
import { RDRecord, FlowType } from "@/lib/types";

export interface RDCalculated {
  discountedFlow: number;
  channelFeeAmount: number;
  withholdingTaxAmount: number;
  shareAmount: number;
  settlementAmount: number;
}

export function calcRDRow(row: RDRecord, flowType: FlowType): RDCalculated {
  const discountedFlow =
    flowType === "raw" ? row.recharge * row.discount : row.recharge;

  const channelFeeAmount = discountedFlow * row.channelFeeRate;
  const taxBase = Math.max(
    discountedFlow -
      row.minorRefund -
      row.testFee -
      row.voucher -
      channelFeeAmount,
    0,
  );
  const withholdingTaxAmount = taxBase * row.withholdingTaxRate;
  const shareAmount =
    discountedFlow -
    row.minorRefund -
    row.testFee -
    row.voucher -
    channelFeeAmount -
    withholdingTaxAmount;
  const settlementAmount = shareAmount * row.shareRatio;

  return {
    discountedFlow: round2(discountedFlow),
    channelFeeAmount: round2(channelFeeAmount),
    withholdingTaxAmount: round2(withholdingTaxAmount),
    shareAmount: round2(shareAmount),
    settlementAmount: round2(settlementAmount),
  };
}
