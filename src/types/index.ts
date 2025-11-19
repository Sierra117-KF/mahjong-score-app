/**
 * 麻雀点数計算アプリの型定義
 */

/** ゲームモード（4人麻雀 or 3人麻雀） */
export type GameMode = 'four' | 'three';

/** プレイヤー種別（親 or 子） */
export type PlayerType = 'oya' | 'ko';

/** 和了種別（ロン or ツモ） */
export type WinType = 'ron' | 'tsumo';

/** 点数計算の入力パラメータ */
export interface ScoreInput {
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
export interface TsumoPayment {
  /** 親の支払い（子がツモの場合） */
  oyaPayment?: number;
  /** 子の支払い（親がツモの場合は全員この額） */
  koPayment: number;
}

/** 点数計算の結果 */
export interface ScoreResult {
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
