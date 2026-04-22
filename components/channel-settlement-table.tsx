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
    <table className="mt-2 w-full border-collapse text-sm">
      <tbody>
        <tr>
          <td className="border border-slate-200 bg-slate-50 px-2 py-2 font-semibold">数据汇总</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(rechargeTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(refundTotal)}</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(testFeeTotal)}</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(voucherTotal)}</td>
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(serverFeeTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="border border-slate-200 px-2 py-2" />
          <td className="num border border-slate-200 px-2 py-2">{formatCurrency(grossTotal)}</td>
          <td className="num amount border border-slate-200 px-2 py-2">{formatCurrency(settlementTotal)}</td>
          <td className="border border-slate-200 px-2 py-2" />
          <td className="border border-slate-200 px-2 py-2" />
        </tr>
      </tbody>
    </table>
  );
}
