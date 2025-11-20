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
