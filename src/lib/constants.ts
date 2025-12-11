import type {
  GameMode,
  PlayerType,
  ScoreCalculationConfig,
  WinType,
} from "@/types";

/**
 * ゲームモード選択肢
 *
 * @remarks
 * 4人麻雀と3人麻雀の選択肢を提供します。
 */
export const GAME_MODE_OPTIONS = [
  { value: "four" as const, label: "4人麻雀" },
  { value: "three" as const, label: "3人麻雀" },
];

/**
 * プレイヤータイプ選択肢
 *
 * @remarks
 * 親（オヤ）と子（コ）の選択肢を提供します。
 */
export const PLAYER_TYPE_OPTIONS = [
  { value: "ko" as const, label: "子" },
  { value: "oya" as const, label: "親" },
];

/**
 * 和了種別選択肢
 *
 * @remarks
 * ロン（他家の捨牌で和了）とツモ（自摸和了）の選択肢を提供します。
 */
export const WIN_TYPE_OPTIONS = [
  { value: "ron" as const, label: "ロン" },
  { value: "tsumo" as const, label: "ツモ" },
];

/**
 * 飜数のクイックアクセスボタン用の値
 *
 * @remarks
 * よく使用される1〜5飜のクイックボタン表示用の配列です。
 */
export const HAN_QUICK_BUTTONS = [1, 2, 3, 4, 5];

/**
 * 飜数の選択肢
 *
 * @remarks
 * 1〜13飜、倍役満（26飜）、三倍役満（39飜）を含む全選択肢です。
 */
export const HAN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 26, 39];

/**
 * 符数の選択肢
 *
 * @remarks
 * 20符から110符までの主要な符数を含む選択肢です。
 */
export const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

/**
 * 本場数の選択肢
 *
 * @remarks
 * 0〜20本場までの選択肢です。
 */
export const HONBA_OPTIONS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

/**
 * アプリケーションのデフォルト値
 *
 * @remarks
 * 初期表示時およびリセット時に使用される設定値です。
 * - ゲームモード: 4人麻雀
 * - プレイヤータイプ: 子
 * - 和了種別: ロン
 * - 飜数: 1飜
 * - 符数: 30符
 * - 本場数: 0本場
 */
export const DEFAULT_VALUES = {
  gameMode: "four" as GameMode,
  playerType: "ko" as PlayerType,
  winType: "ron" as WinType,
  han: 1,
  fu: 30,
  honba: 0,
};

/**
 * UI表示用のテキスト定数
 *
 * @remarks
 * アプリケーション全体で使用されるラベル、ボタンテキスト、単位表示などをまとめたオブジェクトです。
 * 一元管理により、表示テキストの変更を容易にします。
 */
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

/**
 * 点数ランク名の定数
 *
 * @remarks
 * 麻雀における点数ランク（役満、倍満、跳満、満貫など）の表示名を定義します。
 */
export const SCORE_RANKS = {
  TRIPLE_YAKUMAN: "三倍役満",
  DOUBLE_YAKUMAN: "倍役満",
  YAKUMAN: "役満",
  SANBAIMAN: "三倍満",
  BAIMAN: "倍満",
  HANE_MAN: "跳満",
  MANGAN: "満貫",
} as const;

/**
 * 点数計算に使用する定数
 *
 * @remarks
 * 麻雀の点数計算で使用される各種の定数を定義します。
 * - 役満・倍満・跳満・満貫の基本点
 * - 満貫判定の閾値（飜数、符数）
 * - 親・子のロン/ツモ時の倍率
 * - 3人打ちのツモ時の倍率
 * - 本場点数（ロン/ツモ）
 * - 切り上げ単位（100点）
 */
export const SCORE_CALCULATION: ScoreCalculationConfig = {
  YAKUMAN_POINTS: 8000,
  DOUBLE_YAKUMAN_POINTS: 16000,
  TRIPLE_YAKUMAN_POINTS: 24000,
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
  THREE_PLAYER_OYA_TSUMO_MULTIPLIER: 2.5,
  THREE_PLAYER_KO_TSUMO_MULTIPLIER: 1.5,
  HONBA_RON_POINTS: 300,
  HONBA_TSUMO_POINTS: 100,
  ROUND_UP_UNIT: 100,
} as const;

/**
 * キーボードイベントで使用するキー名
 *
 * @remarks
 * キーボード操作のイベントハンドリングで使用するキー名の定数です。
 */
export const KEYBOARD_KEYS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
} as const;

/**
 * ロケール設定
 *
 * @remarks
 * 数値フォーマットなどで使用する日本語ロケール設定です。
 */
export const LOCALE = {
  JP: "ja-JP",
} as const;
