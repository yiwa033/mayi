import { formatCurrency } from "@/lib/money";

export function RDSettlementTable({
  rechargeTotal,
  minorRefundTotal,
  testFeeTotal,
  voucherTotal,
  shareAmountTotal,
  settlementTotal,
}: {
  rechargeTotal: number;
  minorRefundTotal: number;
  testFeeTotal: number;
  voucherTotal: number;
  shareAmountTotal: number;
  settlementTotal: number;
}) {
  return (
    <table className="stat-table">
      <tbody>
        <tr>
          <td>研发数据汇总</td>
          <td className="num">{formatCurrency(rechargeTotal)}</td>
        </tr>
        <tr>
          <td>未成年退款合计</td>
          <td className="num">{formatCurrency(minorRefundTotal)}</td>
        </tr>
        <tr>
          <td>测试费合计</td>
          <td className="num">{formatCurrency(testFeeTotal)}</td>
        </tr>
        <tr>
          <td>代金券合计</td>
          <td className="num">{formatCurrency(voucherTotal)}</td>
        </tr>
        <tr>
          <td>分成金额合计</td>
          <td className="num">{formatCurrency(shareAmountTotal)}</td>
        </tr>
        <tr>
          <td>结算金额合计</td>
          <td className="num amount">{formatCurrency(settlementTotal)}</td>
        </tr>
      </tbody>
    </table>
  );
}
