import { renderHook, act } from '@testing-library/react';
import { useMahjongGame } from '@/hooks/useMahjongGame';
import { DEFAULT_VALUES } from '@/lib/constants';
import { calculateScore } from '@/utils/scoreCalculator';

describe('useMahjongGame', () => {
  describe('初期状態', () => {
    it('全ての状態がデフォルト値で初期化されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      expect(result.current.gameMode).toBe(DEFAULT_VALUES.gameMode);
      expect(result.current.playerType).toBe(DEFAULT_VALUES.playerType);
      expect(result.current.winType).toBe(DEFAULT_VALUES.winType);
      expect(result.current.han).toBe(DEFAULT_VALUES.han);
      expect(result.current.fu).toBe(DEFAULT_VALUES.fu);
      expect(result.current.honba).toBe(DEFAULT_VALUES.honba);
    });

    it('初期状態のresultが正しく計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const expectedResult = calculateScore({
        gameMode: DEFAULT_VALUES.gameMode,
        playerType: DEFAULT_VALUES.playerType,
        winType: DEFAULT_VALUES.winType,
        han: DEFAULT_VALUES.han,
        fu: DEFAULT_VALUES.fu,
        honba: DEFAULT_VALUES.honba,
      });

      expect(result.current.result).toEqual(expectedResult);
    });
  });

  describe('状態更新 - setGameMode', () => {
    it('gameModeを"three"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setGameMode('three');
      });

      expect(result.current.gameMode).toBe('three');
    });

    it('gameModeを"four"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setGameMode('three');
      });

      act(() => {
        result.current.setGameMode('four');
      });

      expect(result.current.gameMode).toBe('four');
    });

    it('gameMode変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setPlayerType('oya');
        result.current.setWinType('tsumo');
        result.current.setHan(2);
        result.current.setFu(30);
      });

      const resultBefore = result.current.result;

      act(() => {
        result.current.setGameMode('three');
      });

      const expectedResult = calculateScore({
        gameMode: 'three',
        playerType: 'oya',
        winType: 'tsumo',
        han: 2,
        fu: 30,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('状態更新 - setPlayerType', () => {
    it('playerTypeを"oya"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setPlayerType('oya');
      });

      expect(result.current.playerType).toBe('oya');
    });

    it('playerTypeを"ko"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setPlayerType('oya');
      });

      act(() => {
        result.current.setPlayerType('ko');
      });

      expect(result.current.playerType).toBe('ko');
    });

    it('playerType変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setPlayerType('oya');
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'oya',
        winType: 'ron',
        han: 1,
        fu: 30,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('状態更新 - setWinType', () => {
    it('winTypeを"tsumo"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setWinType('tsumo');
      });

      expect(result.current.winType).toBe('tsumo');
    });

    it('winTypeを"ron"に変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setWinType('tsumo');
      });

      act(() => {
        result.current.setWinType('ron');
      });

      expect(result.current.winType).toBe('ron');
    });

    it('winType変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setWinType('tsumo');
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'tsumo',
        han: 1,
        fu: 30,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('状態更新 - setHan', () => {
    it('hanを変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHan(3);
      });

      expect(result.current.han).toBe(3);
    });

    it('hanを複数回変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHan(5);
      });

      expect(result.current.han).toBe(5);

      act(() => {
        result.current.setHan(13);
      });

      expect(result.current.han).toBe(13);
    });

    it('han変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setHan(5);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 5,
        fu: 30,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('状態更新 - setFu', () => {
    it('fuを変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setFu(40);
      });

      expect(result.current.fu).toBe(40);
    });

    it('fuを複数回変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setFu(50);
      });

      expect(result.current.fu).toBe(50);

      act(() => {
        result.current.setFu(110);
      });

      expect(result.current.fu).toBe(110);
    });

    it('fu変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setFu(50);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 1,
        fu: 50,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('状態更新 - setHonba', () => {
    it('honbaを変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHonba(2);
      });

      expect(result.current.honba).toBe(2);
    });

    it('honbaを複数回変更できるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHonba(5);
      });

      expect(result.current.honba).toBe(5);

      act(() => {
        result.current.setHonba(99);
      });

      expect(result.current.honba).toBe(99);
    });

    it('honba変更時にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setHonba(3);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 1,
        fu: 30,
        honba: 3,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result).not.toEqual(resultBefore);
    });
  });

  describe('handleReset', () => {
    it('全ての状態（gameModeを除く）をデフォルト値にリセットするべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      // 全ての状態を変更
      act(() => {
        result.current.setGameMode('three');
        result.current.setPlayerType('oya');
        result.current.setWinType('tsumo');
        result.current.setHan(5);
        result.current.setFu(50);
        result.current.setHonba(3);
      });

      // 変更されたことを確認
      expect(result.current.gameMode).toBe('three');
      expect(result.current.playerType).toBe('oya');
      expect(result.current.winType).toBe('tsumo');
      expect(result.current.han).toBe(5);
      expect(result.current.fu).toBe(50);
      expect(result.current.honba).toBe(3);

      // リセット
      act(() => {
        result.current.handleReset();
      });

      // gameModeは変更されないことを確認
      expect(result.current.gameMode).toBe('three');

      // その他の状態はデフォルト値に戻ることを確認
      expect(result.current.playerType).toBe(DEFAULT_VALUES.playerType);
      expect(result.current.winType).toBe(DEFAULT_VALUES.winType);
      expect(result.current.han).toBe(DEFAULT_VALUES.han);
      expect(result.current.fu).toBe(DEFAULT_VALUES.fu);
      expect(result.current.honba).toBe(DEFAULT_VALUES.honba);
    });

    it('リセット後にresultが再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      // 状態を変更
      act(() => {
        result.current.setPlayerType('oya');
        result.current.setWinType('tsumo');
        result.current.setHan(5);
        result.current.setFu(50);
        result.current.setHonba(3);
      });

      // リセット
      act(() => {
        result.current.handleReset();
      });

      const expectedResult = calculateScore({
        gameMode: DEFAULT_VALUES.gameMode,
        playerType: DEFAULT_VALUES.playerType,
        winType: DEFAULT_VALUES.winType,
        han: DEFAULT_VALUES.han,
        fu: DEFAULT_VALUES.fu,
        honba: DEFAULT_VALUES.honba,
      });

      expect(result.current.result).toEqual(expectedResult);
    });

    it('gameModeを変更した後にリセットしても、gameModeは変更されないべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      // gameModeだけを変更
      act(() => {
        result.current.setGameMode('three');
      });

      expect(result.current.gameMode).toBe('three');

      // リセット
      act(() => {
        result.current.handleReset();
      });

      // gameModeは変更されないことを確認
      expect(result.current.gameMode).toBe('three');
    });
  });

  describe('複数の状態を同時に変更', () => {
    it('複数の状態を変更した場合、resultが正しく再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setGameMode('three');
        result.current.setPlayerType('oya');
        result.current.setWinType('tsumo');
        result.current.setHan(6);
        result.current.setFu(40);
        result.current.setHonba(5);
      });

      const expectedResult = calculateScore({
        gameMode: 'three',
        playerType: 'oya',
        winType: 'tsumo',
        han: 6,
        fu: 40,
        honba: 5,
      });

      expect(result.current.result).toEqual(expectedResult);
    });
  });

  describe('境界値テスト', () => {
    it('han=13（役満）の場合、resultが正しく計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHan(13);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 13,
        fu: 30,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
      expect(result.current.result.rankName).toBe('役満');
    });

    it('fu=110（最大符数）の場合、resultが正しく計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setFu(110);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 1,
        fu: 110,
        honba: 0,
      });

      expect(result.current.result).toEqual(expectedResult);
    });

    it('honba=99（最大本場数）の場合、resultが正しく計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      act(() => {
        result.current.setHonba(99);
      });

      const expectedResult = calculateScore({
        gameMode: 'four',
        playerType: 'ko',
        winType: 'ron',
        han: 1,
        fu: 30,
        honba: 99,
      });

      expect(result.current.result).toEqual(expectedResult);
    });
  });

  describe('useMemoの動作確認', () => {
    it('依存配列に変更がない場合、resultは再計算されないべき', () => {
      const { result, rerender } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      // 再レンダリング（状態変更なし）
      rerender();

      // 同じオブジェクトの参照であることを確認
      expect(result.current.result).toBe(resultBefore);
    });

    it('依存配列に変更がある場合、resultは再計算されるべき', () => {
      const { result } = renderHook(() => useMahjongGame());

      const resultBefore = result.current.result;

      act(() => {
        result.current.setHan(2);
      });

      // 異なるオブジェクトの参照であることを確認
      expect(result.current.result).not.toBe(resultBefore);
    });
  });
});
