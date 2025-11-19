import type { ScoreInput, ScoreResult, TsumoPayment } from '@/types';

/**
 * 100点単位で切り上げる
 */
function roundUp100(value: number): number {
  return Math.ceil(value / 100) * 100;
}

/**
 * 飜数から点数ランク名を取得
 */
function getRankName(han: number, fu: number): string {
  // 役満
  if (han >= 13) return '役満';
  if (han >= 11) return '三倍満';
  if (han >= 8) return '倍満';
  if (han >= 6) return '跳満';

  // 満貫判定（5飜以上、または4飜30符以上、または3飜70符以上）
  if (han >= 5) return '満貫';
  if (han === 4 && fu >= 40) return '満貫';
  if (han === 3 && fu >= 70) return '満貫';

  return '';
}

/**
 * 基本点を計算する
 * 基本点 = 符 × 2^(飜+2)
 */
function calculateBasePoints(han: number, fu: number): number {
  // 役満
  if (han >= 13) return 8000;
  // 三倍満
  if (han >= 11) return 6000;
  // 倍満
  if (han >= 8) return 4000;
  // 跳満
  if (han >= 6) return 3000;

  // 満貫判定
  if (han >= 5) return 2000;
  if (han === 4 && fu >= 40) return 2000;
  if (han === 3 && fu >= 70) return 2000;

  // 通常計算
  const basePoints = fu * Math.pow(2, han + 2);

  // 満貫を超えたら満貫に
  return Math.min(basePoints, 2000);
}

/**
 * 親のロン和了時の点数を計算
 */
function calculateOyaRon(basePoints: number, honba: number): number {
  return roundUp100(basePoints * 6) + honba * 300;
}

/**
 * 子のロン和了時の点数を計算
 */
function calculateKoRon(basePoints: number, honba: number): number {
  return roundUp100(basePoints * 4) + honba * 300;
}

/**
 * 親のツモ和了時の支払いを計算
 */
function calculateOyaTsumo(
  basePoints: number,
  honba: number,
  _gameMode: 'four' | 'three'
): TsumoPayment {
  const koPayment = roundUp100(basePoints * 2) + honba * 100;

  return {
    koPayment,
  };
}

/**
 * 子のツモ和了時の支払いを計算
 */
function calculateKoTsumo(
  basePoints: number,
  honba: number,
  _gameMode: 'four' | 'three'
): TsumoPayment {
  const oyaPayment = roundUp100(basePoints * 2) + honba * 100;
  const koPayment = roundUp100(basePoints * 1) + honba * 100;

  return {
    oyaPayment,
    koPayment,
  };
}

/**
 * 点数を計算する
 */
export function calculateScore(input: ScoreInput): ScoreResult {
  const { gameMode, playerType, winType, han, fu, honba } = input;

  // 基本点を計算
  const basePoints = calculateBasePoints(han, fu);
  const rankName = getRankName(han, fu);

  // ロン和了の場合
  if (winType === 'ron') {
    const ronPayment = playerType === 'oya'
      ? calculateOyaRon(basePoints, honba)
      : calculateKoRon(basePoints, honba);

    return {
      total: ronPayment,
      basePoints,
      rankName,
      ronPayment,
    };
  }

  // ツモ和了の場合
  if (playerType === 'oya') {
    // 親ツモ
    const tsumoPayment = calculateOyaTsumo(basePoints, honba, gameMode);
    const numPlayers = gameMode === 'four' ? 3 : 2;
    const total = tsumoPayment.koPayment * numPlayers;

    return {
      total,
      basePoints,
      rankName,
      tsumoPayment,
    };
  } else {
    // 子ツモ
    const tsumoPayment = calculateKoTsumo(basePoints, honba, gameMode);
    const oyaPay = tsumoPayment.oyaPayment ?? 0;
    const total = gameMode === 'four'
      ? oyaPay + tsumoPayment.koPayment * 2
      : oyaPay + tsumoPayment.koPayment;

    return {
      total,
      basePoints,
      rankName,
      tsumoPayment,
    };
  }
}

/**
 * 点数をフォーマットする（カンマ区切り）
 */
export function formatScore(score: number): string {
  return score.toLocaleString('ja-JP');
}
