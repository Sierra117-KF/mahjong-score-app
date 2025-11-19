'use client';

import type { ScoreResult, WinType, GameMode } from '@/types';
import { formatScore } from '@/utils/scoreCalculator';

interface ScoreDisplayProps {
  han: number;
  fu: number;
  result: ScoreResult;
  winType: WinType;
  gameMode: GameMode;
}

export function ScoreDisplay({
  han,
  fu,
  result,
  winType,
  gameMode,
}: ScoreDisplayProps) {
  return (
    <div className="text-center py-4">
      {/* 飜符表示 */}
      <div className="text-lg text-gray-300 mb-1">
        {han}飜 {fu}符
        {result.rankName && (
          <span className="ml-2 text-accent font-medium">
            {result.rankName}
          </span>
        )}
      </div>

      {/* メイン点数表示 */}
      <div className="text-5xl sm:text-6xl font-bold text-white mb-3 transition-all duration-200">
        {formatScore(result.total)}
        <span className="text-2xl sm:text-3xl ml-1">点</span>
      </div>

      {/* 詳細情報 */}
      <div className="text-sm text-gray-400 space-y-1">
        <div>基本点: {formatScore(result.basePoints)}点</div>

        {winType === 'ron' && result.ronPayment && (
          <div className="text-gray-300">
            放銃者支払い: {formatScore(result.ronPayment)}点
          </div>
        )}

        {winType === 'tsumo' && result.tsumoPayment && (
          <div className="text-gray-300">
            {result.tsumoPayment.oyaPayment ? (
              // 子ツモの場合
              <>
                {gameMode === 'four' ? (
                  <>
                    子: {formatScore(result.tsumoPayment.koPayment)}点 /
                    親: {formatScore(result.tsumoPayment.oyaPayment)}点
                  </>
                ) : (
                  <>
                    子: {formatScore(result.tsumoPayment.koPayment)}点 /
                    親: {formatScore(result.tsumoPayment.oyaPayment)}点
                  </>
                )}
              </>
            ) : (
              // 親ツモの場合
              <>
                {formatScore(result.tsumoPayment.koPayment)}点オール
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
