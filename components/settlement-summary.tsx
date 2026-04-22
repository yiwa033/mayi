import { formatCurrency, numberToChineseUppercaseRMB } from "@/lib/money";

export function SettlementSummary({
  actualSettlement,
  prepayment,
}: {
  actualSettlement: number;
  prepayment: number;
}) {
  const remain = actualSettlement - prepayment;
  const negative = remain < 0;
  return (
    <table className="stat-table">
      <tbody>
        <tr>
          <td>实际结算金额</td>
          <td className="num amount">{formatCurrency(actualSettlement)}</td>
        </tr>
        <tr>
          <td>实际结算金额合计（大写）</td>
          <td>{numberToChineseUppercaseRMB(actualSettlement)}</td>
        </tr>
        <tr>
          <td>预付款余额</td>
          <td className="num">{formatCurrency(prepayment)}</td>
        </tr>
        <tr>
          <td>剩余余款</td>
          <td className={`num amount ${negative ? "text-red-600" : ""}`}>
            {negative ? `（${formatCurrency(Math.abs(remain))}）` : formatCurrency(remain)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
