'use client';

import { useState, useMemo } from 'react';

import { NumberInput } from '@/components/NumberInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ToggleButton } from '@/components/ToggleButton';
import type { GameMode, PlayerType, WinType } from '@/types';
import { calculateScore } from '@/utils/scoreCalculator';

// 定数定義
const GAME_MODE_OPTIONS = [
  { value: 'four' as const, label: '4人麻雀' },
  { value: 'three' as const, label: '3人麻雀' },
];

const PLAYER_TYPE_OPTIONS = [
  { value: 'ko' as const, label: '子' },
  { value: 'oya' as const, label: '親' },
];

const WIN_TYPE_OPTIONS = [
  { value: 'ron' as const, label: 'ロン' },
  { value: 'tsumo' as const, label: 'ツモ' },
];

const HAN_QUICK_BUTTONS = [1, 2, 3, 4, 5];
const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

// デフォルト値
const DEFAULT_VALUES = {
  gameMode: 'four' as GameMode,
  playerType: 'ko' as PlayerType,
  winType: 'ron' as WinType,
  han: 1,
  fu: 30,
  honba: 0,
};

export default function Home() {
  // 状態管理
  const [gameMode, setGameMode] = useState<GameMode>(DEFAULT_VALUES.gameMode);
  const [playerType, setPlayerType] = useState<PlayerType>(DEFAULT_VALUES.playerType);
  const [winType, setWinType] = useState<WinType>(DEFAULT_VALUES.winType);
  const [han, setHan] = useState(DEFAULT_VALUES.han);
  const [fu, setFu] = useState(DEFAULT_VALUES.fu);
  const [honba, setHonba] = useState(DEFAULT_VALUES.honba);

  // 点数計算（メモ化）
  const result = useMemo(() => {
    return calculateScore({
      gameMode,
      playerType,
      winType,
      han,
      fu,
      honba,
    });
  }, [gameMode, playerType, winType, han, fu, honba]);

  // リセット処理
  const handleReset = () => {
    setGameMode(DEFAULT_VALUES.gameMode);
    setPlayerType(DEFAULT_VALUES.playerType);
    setWinType(DEFAULT_VALUES.winType);
    setHan(DEFAULT_VALUES.han);
    setFu(DEFAULT_VALUES.fu);
    setHonba(DEFAULT_VALUES.honba);
  };

  return (
    <div className="h-dvh flex flex-col p-3 sm:p-4 max-w-md mx-auto">
      {/* ヘッダー */}
      <header className="text-center py-2">
        <h1 className="text-lg sm:text-xl font-bold text-white">
          麻雀 点数計算
        </h1>
      </header>

      {/* 点数表示エリア */}
      <section className="bg-card rounded-lg px-3 py-2 mb-3">
        <ScoreDisplay
          han={han}
          fu={fu}
          result={result}
          winType={winType}
          gameMode={gameMode}
        />
      </section>

      {/* 設定エリア */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* ゲームモード */}
        <section>
          <ToggleButton
            options={GAME_MODE_OPTIONS}
            value={gameMode}
            onChange={setGameMode}
            label="ゲームモード"
          />
        </section>

        {/* プレイヤー & 和了種別 */}
        <section className="grid grid-cols-2 gap-3">
          <ToggleButton
            options={PLAYER_TYPE_OPTIONS}
            value={playerType}
            onChange={setPlayerType}
            label="プレイヤー"
          />
          <ToggleButton
            options={WIN_TYPE_OPTIONS}
            value={winType}
            onChange={setWinType}
            label="和了種別"
          />
        </section>

        {/* 飜入力 */}
        <section>
          <NumberInput
            label="飜（ハン）"
            value={han}
            onChange={setHan}
            min={1}
            max={13}
            quickButtons={HAN_QUICK_BUTTONS}
          />
        </section>

        {/* 符 & 本場 */}
        <section className="grid grid-cols-2 gap-3">
          <NumberInput
            label="符（フ）"
            value={fu}
            onChange={setFu}
            selectOptions={FU_OPTIONS}
          />
          <NumberInput
            label="本場（300点/本）"
            value={honba}
            onChange={setHonba}
            min={0}
            max={99}
          />
        </section>
      </div>

      {/* リセットボタン */}
      <footer className="pt-3">
        <button
          type="button"
          onClick={handleReset}
          className="
            w-full py-3 rounded-lg
            bg-card text-gray-300 font-medium
            hover:bg-card-hover active:scale-[0.98]
            transition-all duration-200
            min-h-[48px]
          "
        >
          🔄 リセット
        </button>
      </footer>
    </div>
  );
}
