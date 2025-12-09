/**
 * 麻雀点数計算アプリの型定義
 */

/** ゲームモード（4人麻雀 or 3人麻雀） */
export type GameMode = "four" | "three";

/** プレイヤー種別（親 or 子） */
export type PlayerType = "oya" | "ko";

/** 和了種別（ロン or ツモ） */
export type WinType = "ron" | "tsumo";

/** 点数計算の入力パラメータ */
export type ScoreInput = {
  /** ゲームモード */
  gameMode: GameMode;
  /** プレイヤー種別 */
  playerType: PlayerType;
  /** 和了種別 */
  winType: WinType;
  /** 飜数（1〜13+） */
  han: number;
  /** 符数（20〜110） */
  fu: number;
  /** 本場数 */
  honba: number;
}

/** ツモ和了時の支払い詳細 */
export type TsumoPayment = {
  /** 親の支払い（子がツモの場合） */
  oyaPayment?: number;
  /** 子の支払い（親がツモの場合は全員この額） */
  koPayment: number;
}

/** 点数計算の結果 */
export type ScoreResult = {
  /** 合計点数 */
  total: number;
  /** 基本点 */
  basePoints: number;
  /** 点数のランク名（満貫、跳満など） */
  rankName: string;
  /** ロン時の放銃者支払い */
  ronPayment?: number;
  /** ツモ時の支払い詳細 */
  tsumoPayment?: TsumoPayment;
}

/** トグルボタンの選択肢 */
export type ToggleOption<T extends string> = {
  value: T;
  label: string;
}

/** トグルボタンのProps */
export type ToggleButtonProps<T extends string> = {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

/** 点数表示コンポーネントのProps */
export type ScoreDisplayProps = {
  han: number;
  fu: number;
  result: ScoreResult;
  winType: WinType;
}

/** 数値入力コンポーネントのProps */
export type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  quickButtons?: number[];
  selectOptions: number[];
}

/** 点数計算設定 */
export type ScoreCalculationConfig = Readonly<{
  YAKUMAN_POINTS: number;
  DOUBLE_YAKUMAN_POINTS: number;
  TRIPLE_YAKUMAN_POINTS: number;
  SANBAIMAN_POINTS: number;
  BAIMAN_POINTS: number;
  HANE_MAN_POINTS: number;
  MANGAN_POINTS: number;
  MANGAN_HAN_THRESHOLD: number;
  MANGAN_HAN_4_FU_40: number;
  MANGAN_HAN_3_FU_70: number;
  OYA_RON_MULTIPLIER: number;
  KO_RON_MULTIPLIER: number;
  OYA_TSUMO_MULTIPLIER: number;
  KO_TSUMO_MULTIPLIER: number;
  THREE_PLAYER_OYA_TSUMO_MULTIPLIER: number;
  THREE_PLAYER_KO_TSUMO_MULTIPLIER: number;
  HONBA_RON_POINTS: number;
  HONBA_TSUMO_POINTS: number;
  ROUND_UP_UNIT: number;
}>;
