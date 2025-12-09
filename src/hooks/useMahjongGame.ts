import { useMemo,useState } from 'react';

import { DEFAULT_VALUES } from '@/lib/constants';
import type { GameMode, PlayerType, WinType } from '@/types';
import { calculateScore } from '@/utils/scoreCalculator';

export const useMahjongGame = () => {
  const [gameMode, setGameMode] = useState<GameMode>(DEFAULT_VALUES.gameMode);
  const [playerType, setPlayerType] = useState<PlayerType>(DEFAULT_VALUES.playerType);
  const [winType, setWinType] = useState<WinType>(DEFAULT_VALUES.winType);
  const [han, setHan] = useState(DEFAULT_VALUES.han);
  const [fu, setFu] = useState(DEFAULT_VALUES.fu);
  const [honba, setHonba] = useState(DEFAULT_VALUES.honba);

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

  const handleReset = () => {
    setPlayerType(DEFAULT_VALUES.playerType);
    setWinType(DEFAULT_VALUES.winType);
    setHan(DEFAULT_VALUES.han);
    setFu(DEFAULT_VALUES.fu);
    setHonba(DEFAULT_VALUES.honba);
  };

  return {
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
  };
};
