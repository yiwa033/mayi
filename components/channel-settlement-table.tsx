import { formatCurrency } from "@/lib/money";

export function ChannelSettlementTable({
  rechargeTotal,
  refundTotal,
  testFeeTotal,
  voucherTotal,
  serverFeeTotal,
  grossTotal,
  settlementTotal,
}: {
  rechargeTotal: number;
  refundTotal: number;
  testFeeTotal: number;
  voucherTotal: number;
  serverFeeTotal: number;
  grossTotal: number;
  settlementTotal: number;
}) {
  return (
    <table className="stat-table">
      <tbody>
        <tr>
          <td>渠道充值流水合计</td>
          <td className="num">{formatCurrency(rechargeTotal)}</td>
        </tr>
        <tr>
          <td>玩家退款合计</td>
          <td className="num">{formatCurrency(refundTotal)}</td>
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
          <td>服务器费合计</td>
          <td className="num">{formatCurrency(serverFeeTotal)}</td>
        </tr>
        <tr>
          <td>渠道毛利合计</td>
          <td className="num">{formatCurrency(grossTotal)}</td>
        </tr>
        <tr>
          <td>结算金额合计</td>
          <td className="num amount">{formatCurrency(settlementTotal)}</td>
        </tr>
      </tbody>
    </table>
  );
}
