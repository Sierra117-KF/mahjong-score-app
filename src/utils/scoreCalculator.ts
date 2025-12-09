import { LOCALE, SCORE_CALCULATION, SCORE_RANKS } from "@/lib/constants";
import type { ScoreInput, ScoreResult, TsumoPayment } from "@/types";

/**
 * 100点単位で切り上げる
 */
function roundUp100(value: number): number {
  return (
    Math.ceil(value / SCORE_CALCULATION.ROUND_UP_UNIT) *
    SCORE_CALCULATION.ROUND_UP_UNIT
  );
}

/**
 * 飜数から点数ランク名を取得
 */
function getRankName(han: number, fu: number): string {
  // 役満
  if (han >= 39) return SCORE_RANKS.TRIPLE_YAKUMAN;
  if (han >= 26) return SCORE_RANKS.DOUBLE_YAKUMAN;
  if (han >= 13) return SCORE_RANKS.YAKUMAN;
  if (han >= 11) return SCORE_RANKS.SANBAIMAN;
  if (han >= 8) return SCORE_RANKS.BAIMAN;
  if (han >= 6) return SCORE_RANKS.HANE_MAN;

  // 満貫判定（5飜以上、または4飜40符以上、または3飜70符以上）
  if (han >= SCORE_CALCULATION.MANGAN_HAN_THRESHOLD) return SCORE_RANKS.MANGAN;
  if (han === 4 && fu >= SCORE_CALCULATION.MANGAN_HAN_4_FU_40)
    return SCORE_RANKS.MANGAN;
  if (han === 3 && fu >= SCORE_CALCULATION.MANGAN_HAN_3_FU_70)
    return SCORE_RANKS.MANGAN;

  return "";
}

/**
 * 基本点を計算する
 * 基本点 = 符 × 2^(飜+2)
 */
function calculateBasePoints(han: number, fu: number): number {
  // 役満
  if (han >= 39) return SCORE_CALCULATION.TRIPLE_YAKUMAN_POINTS;
  if (han >= 26) return SCORE_CALCULATION.DOUBLE_YAKUMAN_POINTS;
  if (han >= 13) return SCORE_CALCULATION.YAKUMAN_POINTS;
  // 三倍満
  if (han >= 11) return SCORE_CALCULATION.SANBAIMAN_POINTS;
  // 倍満
  if (han >= 8) return SCORE_CALCULATION.BAIMAN_POINTS;
  // 跳満
  if (han >= 6) return SCORE_CALCULATION.HANE_MAN_POINTS;

  // 満貫判定
  if (han >= SCORE_CALCULATION.MANGAN_HAN_THRESHOLD)
    return SCORE_CALCULATION.MANGAN_POINTS;
  if (han === 4 && fu >= SCORE_CALCULATION.MANGAN_HAN_4_FU_40)
    return SCORE_CALCULATION.MANGAN_POINTS;
  if (han === 3 && fu >= SCORE_CALCULATION.MANGAN_HAN_3_FU_70)
    return SCORE_CALCULATION.MANGAN_POINTS;

  // 通常計算
  const basePoints = fu * Math.pow(2, han + 2);

  // 満貫を超えたら満貫に
  return Math.min(basePoints, SCORE_CALCULATION.MANGAN_POINTS);
}

/**
 * 親のロン和了時の点数を計算
 */
function calculateOyaRon(basePoints: number, honba: number): number {
  return (
    roundUp100(basePoints * SCORE_CALCULATION.OYA_RON_MULTIPLIER) +
    honba * SCORE_CALCULATION.HONBA_RON_POINTS
  );
}

/**
 * 子のロン和了時の点数を計算
 */
function calculateKoRon(basePoints: number, honba: number): number {
  return (
    roundUp100(basePoints * SCORE_CALCULATION.KO_RON_MULTIPLIER) +
    honba * SCORE_CALCULATION.HONBA_RON_POINTS
  );
}

/**
 * 親のツモ和了時の支払いを計算
 */
function calculateOyaTsumo(basePoints: number, honba: number): TsumoPayment {
  const koPayment =
    roundUp100(basePoints * SCORE_CALCULATION.OYA_TSUMO_MULTIPLIER) +
    honba * SCORE_CALCULATION.HONBA_TSUMO_POINTS;

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
  gameMode: "four" | "three"
): TsumoPayment {
  const oyaMultiplier: number =
    gameMode === "three"
      ? SCORE_CALCULATION.THREE_PLAYER_OYA_TSUMO_MULTIPLIER
      : SCORE_CALCULATION.OYA_TSUMO_MULTIPLIER;
  const koMultiplier: number =
    gameMode === "three"
      ? SCORE_CALCULATION.THREE_PLAYER_KO_TSUMO_MULTIPLIER
      : SCORE_CALCULATION.KO_TSUMO_MULTIPLIER;

  const oyaPayment =
    roundUp100(basePoints * oyaMultiplier) +
    honba * SCORE_CALCULATION.HONBA_TSUMO_POINTS;
  const koPayment =
    roundUp100(basePoints * koMultiplier) +
    honba * SCORE_CALCULATION.HONBA_TSUMO_POINTS;

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
  if (winType === "ron") {
    const ronPayment =
      playerType === "oya"
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
  if (playerType === "oya") {
    // 親ツモ
    const tsumoPayment = calculateOyaTsumo(basePoints, honba);
    const numPlayers = gameMode === "four" ? 3 : 2;

    // 4人打ちの場合は理論値（基本点×6）を使用
    const total =
      gameMode === "four"
        ? roundUp100(basePoints * 6) + honba * 300
        : tsumoPayment.koPayment * numPlayers;

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

    // 4人打ちの場合は理論値（基本点×4）を使用
    const total =
      gameMode === "four"
        ? roundUp100(basePoints * 4) + honba * 300
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
  return score.toLocaleString(LOCALE.JP);
}
