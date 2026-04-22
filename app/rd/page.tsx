"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { EditableTable } from "@/components/editable-table";
import { PageHeader } from "@/components/page-header";
import { RDSettlementTable } from "@/components/rd-settlement-table";
import { SettlementSummary } from "@/components/settlement-summary";
import { FilterToolbar } from "@/components/filter-toolbar";
import { CollapsibleSection } from "@/components/collapsible-section";
import { formatCurrency } from "@/lib/money";
import { calcRDRow } from "@/lib/rd-calc";
import { getLocal, removeLocal, setLocal } from "@/lib/storage";
import { parsePercentInput } from "@/lib/percent";
import { FlowType, GameItem, RDRecord } from "@/lib/types";

const RD_KEY = "finance_rd_records";
const PREPAYMENT_KEY = "finance_rd_prepayment";
const GAMES_KEY = "finance_games";

const makeDemoRecords = (): RDRecord[] => [
  {
    id: "rd-demo-1",
    month: "2026-10-01",
    gameName: "末世王者（大熊）",
    recharge: 1000,
    discount: 0.01,
    minorRefund: 0,
    testFee: 0,
    voucher: 0,
    channelFeeRate: 0.05,
    withholdingTaxRate: 0,
    shareRatio: 0.5,
    note: "",
  },
  {
    id: "rd-demo-2",
    month: "2026-12-01",
    gameName: "末世王者（B站）",
    recharge: 1000,
    discount: 0.01,
    minorRefund: 0,
    testFee: 0,
    voucher: 0,
    channelFeeRate: 0.05,
    withholdingTaxRate: 0,
    shareRatio: 0.5,
    note: "",
  },
];

const emptyRecord = (preset?: Partial<RDRecord>): RDRecord => ({
  id: crypto.randomUUID(),
  month: preset?.month ?? "",
  gameName: preset?.gameName ?? "",
  recharge: 0,
  discount: preset?.discount ?? 0.05,
  minorRefund: 0,
  testFee: 0,
  voucher: 0,
  channelFeeRate: 0,
  withholdingTaxRate: 0,
  shareRatio: 0.5,
  note: "",
});

export default function RDPage() {
  const [records, setRecords] = useState<RDRecord[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [gameFilter, setGameFilter] = useState("");
  const [quickDiscount, setQuickDiscount] = useState("0.01");
  const [flowType, setFlowType] = useState<FlowType>("discounted");
  const [prepayment, setPrepayment] = useState(6368.25);

  useEffect(() => {
    const savedRecords = getLocal<RDRecord[] | null>(RD_KEY, null);
    if (!savedRecords || savedRecords.length === 0) {
      const demo = makeDemoRecords();
      setRecords(demo);
      setLocal(RD_KEY, demo);
    } else {
      setRecords(savedRecords);
    }
    setGames(getLocal<GameItem[]>(GAMES_KEY, []));
    setPrepayment(getLocal<number>(PREPAYMENT_KEY, 6368.25));
  }, []);

  useEffect(() => {
    setLocal(RD_KEY, records);
  }, [records]);

  useEffect(() => {
    setLocal(PREPAYMENT_KEY, prepayment);
  }, [prepayment]);

  const filtered = useMemo(
    () =>
      records.filter((item) => {
        const hitMonth = monthFilter ? item.month.includes(monthFilter) : true;
        const hitGame = gameFilter ? item.gameName === gameFilter : true;
        return hitMonth && hitGame;
      }),
    [records, monthFilter, gameFilter],
  );

  const rows = filtered.map((item) => ({ item, calc: calcRDRow(item, flowType) }));
  const totals = rows.reduce(
    (acc, row) => {
      acc.recharge += row.item.recharge;
      acc.minorRefund += row.item.minorRefund;
      acc.testFee += row.item.testFee;
      acc.voucher += row.item.voucher;
      acc.shareAmount += row.calc.shareAmount;
      acc.settlement += row.calc.settlementAmount;
      return acc;
    },
    { recharge: 0, minorRefund: 0, testFee: 0, voucher: 0, shareAmount: 0, settlement: 0 },
  );

  const setField = (id: string, field: keyof RDRecord, value: string) => {
    setRecords((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === "month" || field === "gameName" || field === "note") return { ...row, [field]: value };
        if (field === "channelFeeRate" || field === "withholdingTaxRate" || field === "shareRatio") {
          return { ...row, [field]: parsePercentInput(value) };
        }
        return { ...row, [field]: Number(value) || 0 };
      }),
    );
  };

  return (
    <div className="page-root">
      <PageHeader title="研发对账" description="上方筛选 + 可编辑表格 + 下方汇总结算" />

      <FilterToolbar>
        <input className="field" type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
        <input className="field" list="rd-games" placeholder="游戏筛选" value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} />
        <datalist id="rd-games">{games.map((g) => <option key={g.id} value={g.name} />)}</datalist>
        <select className="field" value={quickDiscount} onChange={(e) => setQuickDiscount(e.target.value)}>
          <option value="0.05">折扣 0.05</option><option value="0.01">折扣 0.01</option><option value="0">自定义</option>
        </select>
        <select className="field" value={flowType} onChange={(e) => setFlowType(e.target.value as FlowType)}>
          <option value="raw">原始流水</option><option value="discounted">折后流水</option>
        </select>
        <input className="field num" value={prepayment} onChange={(e) => setPrepayment(Number(e.target.value) || 0)} placeholder="预付款余额" />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setRecords((prev) => [...prev, emptyRecord({ month: monthFilter, gameName: gameFilter, discount: Number(quickDiscount) || 0.05 })])}
        >
          新增一行
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (!window.confirm("确认清空当前页面数据吗？")) return;
            setRecords([]);
            removeLocal(RD_KEY);
          }}
        >
          清空当前页面数据
        </button>
      </FilterToolbar>

      <EditableTable
        header={
          <tr>
            {["月份", "游戏名称", "充值流水", "折扣", "未成年退款", "测试费", "代金券", "通道费", "代扣税率", "分成金额", "分成比例", "结算金额", "备注", "操作"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        }
      >
        {rows.map(({ item, calc }) => (
          <tr key={item.id}>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" value={item.month} onChange={(e) => setField(item.id, "month", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" list="rd-games" value={item.gameName} onChange={(e) => setField(item.id, "gameName", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.recharge} onChange={(e) => setField(item.id, "recharge", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.discount} onChange={(e) => setField(item.id, "discount", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.minorRefund} onChange={(e) => setField(item.id, "minorRefund", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.testFee} onChange={(e) => setField(item.id, "testFee", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.voucher} onChange={(e) => setField(item.id, "voucher", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.channelFeeRate} onChange={(e) => setField(item.id, "channelFeeRate", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.withholdingTaxRate} onChange={(e) => setField(item.id, "withholdingTaxRate", e.target.value)} /></td>
            <td className="num">{formatCurrency(calc.shareAmount)}</td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" value={item.shareRatio} onChange={(e) => setField(item.id, "shareRatio", e.target.value)} /></td>
            <td className="num amount">{formatCurrency(calc.settlementAmount)}</td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" value={item.note} onChange={(e) => setField(item.id, "note", e.target.value)} /></td>
            <td className="op-col">
              <button type="button" className="btn btn-sm" onClick={() => setRecords((prev) => [...prev, { ...item, id: crypto.randomUUID() }])}>复制一行</button>
              <button type="button" className="btn btn-danger btn-sm ml-1" onClick={() => window.confirm("确认删除该行吗？") && setRecords((prev) => prev.filter((r) => r.id !== item.id))}>删除一行</button>
            </td>
          </tr>
        ))}
      </EditableTable>

      <div className="summary-grid">
        <section className="panel">
          <div className="panel-title">数据汇总</div>
          <div className="collapsible-body">
            <RDSettlementTable
              rechargeTotal={totals.recharge}
              minorRefundTotal={totals.minorRefund}
              testFeeTotal={totals.testFee}
              voucherTotal={totals.voucher}
              shareAmountTotal={totals.shareAmount}
              settlementTotal={totals.settlement}
            />
          </div>
        </section>
        <section className="panel">
          <div className="panel-title">结算区</div>
          <div className="collapsible-body">
            <SettlementSummary actualSettlement={totals.settlement} prepayment={prepayment} />
          </div>
        </section>
      </div>
      <CollapsibleSection title="附加说明" defaultOpen={false}>
        <p className="page-desc">预留给后续高级筛选、结算说明或备注区扩展。</p>
      </CollapsibleSection>
    </div>
  );
}
