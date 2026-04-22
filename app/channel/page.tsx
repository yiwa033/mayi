"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { ChannelSettlementTable } from "@/components/channel-settlement-table";
import { EditableTable } from "@/components/editable-table";
import { PageHeader } from "@/components/page-header";
import { FilterToolbar } from "@/components/filter-toolbar";
import { GameSelect } from "@/components/game-select";
import { RowActions } from "@/components/row-actions";
import { formatCurrency } from "@/lib/money";
import {
  formatPercentDisplay,
  normalizePercentValue,
  parsePercentInput,
} from "@/lib/percent";
import { calcChannelRow } from "@/lib/channel-calc";
import { getLocal, removeLocal, setLocal } from "@/lib/storage";
import { normalizeMonthValue } from "@/lib/month";
import { ChannelRecord, FlowType, GameItem } from "@/lib/types";

const CHANNEL_KEY = "finance_channel_records";
const GAMES_KEY = "finance_games";

const emptyRecord = (preset?: Partial<ChannelRecord>): ChannelRecord => ({
  id: crypto.randomUUID(),
  month: preset?.month ?? "",
  channelName: preset?.channelName ?? "",
  gameName: preset?.gameName ?? "",
  recharge: 0,
  discount: preset?.discount ?? 0.05,
  playerRefund: 0,
  testFee: 0,
  voucher: 0,
  serverFee: 0,
  channelFeeRate: 0,
  rdShareRatio: 0.5,
  note: "",
});

export default function ChannelPage() {
  const [records, setRecords] = useState<ChannelRecord[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [gameFilter, setGameFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [quickDiscount, setQuickDiscount] = useState("0.05");
  const [flowType, setFlowType] = useState<FlowType>("discounted");

  useEffect(() => {
    const normalized = getLocal<ChannelRecord[]>(CHANNEL_KEY, []).map((row) => ({
      ...row,
      month: normalizeMonthValue(row.month),
      channelFeeRate: normalizePercentValue(row.channelFeeRate),
      rdShareRatio: normalizePercentValue(row.rdShareRatio),
    }));
    setRecords(normalized);
    setGames(getLocal<GameItem[]>(GAMES_KEY, []));
  }, []);

  useEffect(() => {
    setLocal(CHANNEL_KEY, records);
  }, [records]);

  const filtered = useMemo(
    () =>
      records.filter((item) => {
        const hitMonth = monthFilter ? item.month === monthFilter : true;
        const hitGame = gameFilter ? item.gameName === gameFilter : true;
        const hitChannel = channelFilter ? item.channelName.includes(channelFilter) : true;
        return hitMonth && hitGame && hitChannel;
      }),
    [records, monthFilter, gameFilter, channelFilter],
  );

  const rows = filtered.map((item) => ({ item, calc: calcChannelRow(item, flowType) }));
  const totals = rows.reduce(
    (acc, row) => {
      acc.recharge += row.item.recharge;
      acc.refund += row.item.playerRefund;
      acc.testFee += row.item.testFee;
      acc.voucher += row.item.voucher;
      acc.serverFee += row.item.serverFee;
      acc.gross += row.calc.channelGrossProfit;
      acc.settlement += row.calc.settlementAmount;
      return acc;
    },
    {
      recharge: 0,
      refund: 0,
      testFee: 0,
      voucher: 0,
      serverFee: 0,
      gross: 0,
      settlement: 0,
    },
  );

  const setField = (id: string, field: keyof ChannelRecord, value: string) => {
    setRecords((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === "month") {
          return { ...row, month: normalizeMonthValue(value) };
        }
        if (field === "channelName" || field === "gameName" || field === "note") {
          return { ...row, [field]: value };
        }
        if (field === "channelFeeRate" || field === "rdShareRatio") {
          return { ...row, [field]: parsePercentInput(value) };
        }
        return { ...row, [field]: Number(value) || 0 };
      }),
    );
  };

  return (
    <div className="page-root">
      <PageHeader title="渠道对账" description="结构与研发页一致，先保障录入与计算" />

      <FilterToolbar>
        <input className="field" title="月份筛选" type="month" value={monthFilter} onChange={(e) => setMonthFilter(normalizeMonthValue(e.target.value))} />
        <GameSelect value={gameFilter} games={games} onChange={setGameFilter} placeholder="游戏筛选" title="游戏筛选" />
        <input className="field" title="渠道名称筛选" placeholder="渠道名称筛选" value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} />
        <select className="field" aria-label="折扣快捷选择" title="折扣快捷选择" value={quickDiscount} onChange={(e) => setQuickDiscount(e.target.value)}>
          <option value="0.05">折扣 0.05</option><option value="0.01">折扣 0.01</option><option value="0">自定义</option>
        </select>
        <select className="field" aria-label="流水类型" title="流水类型" value={flowType} onChange={(e) => setFlowType(e.target.value as FlowType)}>
          <option value="raw">原始流水</option><option value="discounted">折后流水</option>
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            setRecords((prev) => [
              ...prev,
              emptyRecord({
                month: normalizeMonthValue(monthFilter),
                channelName: channelFilter,
                gameName: gameFilter,
                discount: Number(quickDiscount) || 0.05,
              }),
            ])
          }
        >
          新增一行
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (!window.confirm("确认清空当前页面数据吗？")) return;
            setRecords([]);
            removeLocal(CHANNEL_KEY);
          }}
        >
          清空当前页面数据
        </button>
      </FilterToolbar>

      <EditableTable
        header={
          <tr>
            {[
              "月份",
              "渠道名称",
              "游戏名称",
              "充值流水",
              "折扣",
              "玩家退款",
              "测试费",
              "代金券",
              "服务器费",
              "通道费",
              "研发分成比例",
              "渠道毛利",
              "结算金额",
              "备注",
              "操作",
            ].map((h) => (
              <th key={h} className={h === "操作" ? "op-col op-col-narrow" : ""}>
                {h}
              </th>
            ))}
          </tr>
        }
      >
        {rows.map(({ item, calc }) => (
          <tr key={item.id}>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" title="月份" type="month" value={normalizeMonthValue(item.month)} onChange={(e) => setField(item.id, "month", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" title="渠道名称" value={item.channelName} onChange={(e) => setField(item.id, "channelName", e.target.value)} /></td>
            <td>
              <GameSelect
                value={item.gameName}
                games={games}
                onChange={(next) => setField(item.id, "gameName", next)}
                title="游戏名称"
              />
            </td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="充值流水" value={item.recharge} onChange={(e) => setField(item.id, "recharge", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="折扣" value={item.discount} onChange={(e) => setField(item.id, "discount", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="玩家退款" value={item.playerRefund} onChange={(e) => setField(item.id, "playerRefund", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="测试费" value={item.testFee} onChange={(e) => setField(item.id, "testFee", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="代金券" value={item.voucher} onChange={(e) => setField(item.id, "voucher", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="服务器费" value={item.serverFee} onChange={(e) => setField(item.id, "serverFee", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="通道费率" value={formatPercentDisplay(item.channelFeeRate)} onChange={(e) => setField(item.id, "channelFeeRate", e.target.value)} /></td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1 num" title="研发分成比例" value={formatPercentDisplay(item.rdShareRatio)} onChange={(e) => setField(item.id, "rdShareRatio", e.target.value)} /></td>
            <td className="num">{formatCurrency(calc.channelGrossProfit)}</td>
            <td className="num amount">{formatCurrency(calc.settlementAmount)}</td>
            <td><input className="field h-[30px] w-full rounded-[4px] px-1" title="备注" value={item.note} onChange={(e) => setField(item.id, "note", e.target.value)} /></td>
            <td className="op-col op-col-narrow">
              <RowActions
                onCopy={() => setRecords((prev) => [...prev, { ...item, id: crypto.randomUUID() }])}
                onDelete={() => window.confirm("确认删除该行吗？") && setRecords((prev) => prev.filter((r) => r.id !== item.id))}
              />
            </td>
          </tr>
        ))}
      </EditableTable>

      <ChannelSettlementTable
        rechargeTotal={totals.recharge}
        refundTotal={totals.refund}
        testFeeTotal={totals.testFee}
        voucherTotal={totals.voucher}
        serverFeeTotal={totals.serverFee}
        grossTotal={totals.gross}
        settlementTotal={totals.settlement}
      />
    </div>
  );
}
