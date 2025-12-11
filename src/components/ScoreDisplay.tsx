"use client";

import { UI_TEXT } from "@/lib/constants";
import type { ScoreDisplayProps } from "@/types";
import { formatScore } from "@/utils/scoreCalculator";

/**
 * 麻雀の点数計算結果を表示するコンポーネント
 *
 * @remarks
 * 飜数・符数、点数ランク（満貫、跳満など）、総得点を表示します。
 * ロン和了時は放銃者の支払い点数、ツモ和了時は各プレイヤーの支払い点数を表示します。
 *
 * @param props - コンポーネントのプロパティ
 * @param props.han - 飜数
 * @param props.fu - 符数
 * @param props.result - 点数計算結果オブジェクト
 * @param props.winType - 和了種別（"ron" または "tsumo"）
 */
export function ScoreDisplay({ han, fu, result, winType }: ScoreDisplayProps) {
  const hasRankName = result.rankName.trim() !== "";
  const ronPayment = result.ronPayment ?? null;
  const tsumoPayment = result.tsumoPayment ?? null;
  const oyaPayment = tsumoPayment?.oyaPayment ?? null;

  return (
    <div className="text-center py-4">
      {/* 飜符表示 */}
      <div className="inline-block bg-primary-bg/50 px-4 py-2 rounded-md mb-2">
        <span className="text-xl font-bold text-white">
          {han}
          {UI_TEXT.HAN_UNIT} {fu}
          {UI_TEXT.FU_UNIT}
        </span>
        {hasRankName ? (
          <span className="ml-2 text-accent font-bold">{result.rankName}</span>
        ) : null}
      </div>

      {/* メイン点数表示 */}
      <div className="text-5xl sm:text-6xl font-bold text-white mb-3 transition-all duration-200">
        {formatScore(result.total)}
        <span className="text-2xl sm:text-3xl ml-1">{UI_TEXT.POINT_UNIT}</span>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">
          {UI_TEXT.BASE_POINT_LABEL}: {formatScore(result.basePoints)}
          {UI_TEXT.POINT_UNIT}
        </div>

        {winType === "ron" && ronPayment !== null ? (
          <div className="text-lg font-medium text-yellow-400">
            {UI_TEXT.RON_PAYMENT_LABEL}: {formatScore(ronPayment)}
            {UI_TEXT.POINT_UNIT}
          </div>
        ) : null}

        {winType === "tsumo" && tsumoPayment !== null ? (
          <div className="text-lg font-medium text-yellow-400">
            {oyaPayment !== null ? (
              // 子ツモの場合（3人/4人共通表示）
              <>
                {UI_TEXT.KO_LABEL}: {formatScore(tsumoPayment.koPayment)}
                {UI_TEXT.POINT_UNIT} /{UI_TEXT.OYA_LABEL}:{" "}
                {formatScore(oyaPayment)}
                {UI_TEXT.POINT_UNIT}
              </>
            ) : (
              // 親ツモの場合
              <>
                {formatScore(tsumoPayment.koPayment)}
                {UI_TEXT.POINT_UNIT}
                {UI_TEXT.ALL_PAYMENT_SUFFIX}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
