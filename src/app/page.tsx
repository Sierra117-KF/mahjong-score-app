'use client';

import { NumberInput } from '@/components/NumberInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ToggleButton } from '@/components/ToggleButton';
import { useMahjongGame } from '@/hooks/useMahjongGame';
import {
  GAME_MODE_OPTIONS,
  PLAYER_TYPE_OPTIONS,
  WIN_TYPE_OPTIONS,
  HAN_QUICK_BUTTONS,
  HAN_OPTIONS,
  FU_OPTIONS,
  HONBA_OPTIONS,
} from '@/lib/constants';

export default function Home() {
  const {
    gameMode,
    setGameMode,
    playerType,
    setPlayerType,
    winType,
    setWinType,
    han,
    setHan,
    fu,
    setFu,
    honba,
    setHonba,
    result,
    handleReset,
  } = useMahjongGame();

  return (
    <div className="h-dvh flex flex-col p-3 sm:p-4 max-w-md mx-auto overflow-x-hidden">
      {/* ヘッダー */}
      <header className="text-center py-2">
        <h1 className="text-lg sm:text-xl font-bold text-white">
          麻雀 点数計算
        </h1>
      </header>

      {/* 点数表示エリア */}
      <section className="bg-card rounded-lg px-3 py-2 mb-3 relative z-10">
        <ScoreDisplay
          han={han}
          fu={fu}
          result={result}
          winType={winType}
          gameMode={gameMode}
        />
      </section>

      {/* 設定エリア */}
      <div className="flex-1 flex flex-col gap-3 overflow-visible">
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
        <section className="bg-card rounded-lg px-3 py-2 relative z-20">
          <NumberInput
            label="飜（ハン）"
            value={han}
            onChange={setHan}
            selectOptions={HAN_OPTIONS}
            quickButtons={HAN_QUICK_BUTTONS}
          />
        </section>

        {/* 符 & 本場 */}
        <section className="grid grid-cols-2 gap-2">
          <div className="bg-card rounded-lg px-3 py-2">
            <NumberInput
              label="符（フ）"
              value={fu}
              onChange={setFu}
              selectOptions={FU_OPTIONS}
            />
          </div>
          <div className="bg-card rounded-lg px-3 py-2">
            <NumberInput
              label="本場"
              value={honba}
              onChange={setHonba}
              selectOptions={HONBA_OPTIONS}
            />
          </div>
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
