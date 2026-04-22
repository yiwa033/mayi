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
    <table className="mt-2 w-full border-collapse text-sm">
      <tbody>
        <tr>
          <td className="border border-slate-200 bg-slate-50 px-2 py-2 font-semibold">数据汇总</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(rechargeTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(minorRefundTotal)}</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(testFeeTotal)}</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(voucherTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(shareAmountTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num amount border border-slate-200 px-2 py-2">{formatCurrency(settlementTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="border border-slate-200 px-2 py-2" />
        </tr>
      </tbody>
    </table>
  );
}
