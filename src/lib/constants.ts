import type { GameMode, PlayerType, WinType } from "@/types";

export const GAME_MODE_OPTIONS = [
  { value: "four" as const, label: "4人麻雀" },
  { value: "three" as const, label: "3人麻雀" },
];

export const PLAYER_TYPE_OPTIONS = [
  { value: "ko" as const, label: "子" },
  { value: "oya" as const, label: "親" },
];

export const WIN_TYPE_OPTIONS = [
  { value: "ron" as const, label: "ロン" },
  { value: "tsumo" as const, label: "ツモ" },
];

export const HAN_QUICK_BUTTONS = [1, 2, 3, 4, 5];
export const HAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
export const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
export const HONBA_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const DEFAULT_VALUES = {
  gameMode: "four" as GameMode,
  playerType: "ko" as PlayerType,
  winType: "ron" as WinType,
  han: 1,
  fu: 30,
  honba: 0,
};

export const UI_TEXT = {
  HEADER_TITLE: "麻雀 点数計算",
  GAME_MODE_LABEL: "ゲームモード",
  PLAYER_LABEL: "プレイヤー",
  WIN_TYPE_LABEL: "和了種別",
  HAN_LABEL: "飜（ハン）",
  FU_LABEL: "符（フ）",
  HONBA_LABEL: "本場",
  RESET_BUTTON: "🔄 リセット",
  HAN_UNIT: "飜",
  FU_UNIT: "符",
  POINT_UNIT: "点",
  BASE_POINT_LABEL: "基本点",
  RON_PAYMENT_LABEL: "放銃者支払い",
  KO_LABEL: "子",
  OYA_LABEL: "親",
  ALL_PAYMENT_SUFFIX: "オール",
  DROPDOWN_ARROW: "▼",
} as const;

export const SCORE_RANKS = {
  YAKUMAN: "役満",
  SANBAIMAN: "三倍満",
  BAIMAN: "倍満",
  HANE_MAN: "跳満",
  MANGAN: "満貫",
} as const;

export const SCORE_CALCULATION = {
  YAKUMAN_POINTS: 8000,
  SANBAIMAN_POINTS: 6000,
  BAIMAN_POINTS: 4000,
  HANE_MAN_POINTS: 3000,
  MANGAN_POINTS: 2000,
  MANGAN_HAN_THRESHOLD: 5,
  MANGAN_HAN_4_FU_40: 40,
  MANGAN_HAN_3_FU_70: 70,
  OYA_RON_MULTIPLIER: 6,
  KO_RON_MULTIPLIER: 4,
  OYA_TSUMO_MULTIPLIER: 2,
  KO_TSUMO_MULTIPLIER: 1, // 子ツモ時に他の子が支払う基本点の倍率
  HONBA_RON_POINTS: 300,
  HONBA_TSUMO_POINTS: 100,
  ROUND_UP_UNIT: 100,
} as const;

export const KEYBOARD_KEYS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
} as const;

export const LOCALE = {
  JP: "ja-JP",
} as const;
