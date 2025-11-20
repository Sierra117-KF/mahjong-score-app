'use client';

import { UI_TEXT } from '@/lib/constants';
import type { ScoreDisplayProps } from '@/types';
import { formatScore } from '@/utils/scoreCalculator';

export function ScoreDisplay({
  han,
  fu,
  result,
  winType,
  gameMode: _gameMode,
}: ScoreDisplayProps) {
  return (
    <div className="text-center py-4">
      {/* 飜符表示 */}
      <div className="inline-block bg-primary-bg/50 px-4 py-2 rounded-md mb-2">
        <span className="text-xl font-bold text-white">
          {han}{UI_TEXT.HAN_UNIT} {fu}{UI_TEXT.FU_UNIT}
        </span>
        {result.rankName && (
          <span className="ml-2 text-accent font-bold">
            {result.rankName}
          </span>
        )}
      </div>

      {/* メイン点数表示 */}
      <div className="text-5xl sm:text-6xl font-bold text-white mb-3 transition-all duration-200">
        {formatScore(result.total)}
        <span className="text-2xl sm:text-3xl ml-1">{UI_TEXT.POINT_UNIT}</span>
      </div>

      {/* 詳細情報 */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">{UI_TEXT.BASE_POINT_LABEL}: {formatScore(result.basePoints)}{UI_TEXT.POINT_UNIT}</div>

        {winType === 'ron' && result.ronPayment && (
          <div className="text-lg font-medium text-yellow-400">
            {UI_TEXT.RON_PAYMENT_LABEL}: {formatScore(result.ronPayment)}{UI_TEXT.POINT_UNIT}
          </div>
        )}

        {winType === 'tsumo' && result.tsumoPayment && (
          <div className="text-lg font-medium text-yellow-400">
            {result.tsumoPayment.oyaPayment ? (
              // 子ツモの場合（3人/4人共通表示）
              <>
                {UI_TEXT.KO_LABEL}: {formatScore(result.tsumoPayment.koPayment)}{UI_TEXT.POINT_UNIT} /
                {UI_TEXT.OYA_LABEL}: {formatScore(result.tsumoPayment.oyaPayment)}{UI_TEXT.POINT_UNIT}
              </>
            ) : (
              // 親ツモの場合
              <>
                {formatScore(result.tsumoPayment.koPayment)}{UI_TEXT.POINT_UNIT}{UI_TEXT.ALL_PAYMENT_SUFFIX}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
