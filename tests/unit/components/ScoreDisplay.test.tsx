import { render, screen } from '@testing-library/react';

import { ScoreDisplay } from '@/components/ScoreDisplay';
import type { ScoreResult, WinType } from '@/types';

describe('ScoreDisplay', () => {
  // ヘルパー関数：デフォルトpropsを生成
  const createDefaultProps = (overrides?: {
    han?: number;
    fu?: number;
    result?: Partial<ScoreResult>;
    winType?: WinType;
  }) => ({
    han: overrides?.han ?? 1,
    fu: overrides?.fu ?? 30,
    result: {
      total: 1000,
      basePoints: 240,
      rankName: '',
      ...overrides?.result,
    },
    winType: overrides?.winType ?? 'ron',
  });

  const renderScoreDisplay = (
    overrides?: Parameters<typeof createDefaultProps>[0],
  ) => render(<ScoreDisplay {...createDefaultProps(overrides)} />);

  describe('基本表示', () => {
    it('飜数と符数が正しく表示される', () => {
      renderScoreDisplay({ han: 3, fu: 40 });

      expect(screen.getByText('3飜 40符')).toBeInTheDocument();
    });

    it('合計点数が正しく表示される', () => {
      renderScoreDisplay({
        result: { total: 1000, basePoints: 240, rankName: '' },
      });

      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('点')).toBeInTheDocument();
    });

    it('基本点が正しく表示される', () => {
      renderScoreDisplay({
        result: { total: 2000, basePoints: 480, rankName: '' },
      });

      expect(screen.getByText('基本点: 480点')).toBeInTheDocument();
    });

    it('大きな点数がカンマ区切りで表示される', () => {
      renderScoreDisplay({
        result: { total: 32000, basePoints: 8000, rankName: '役満' },
      });

      expect(screen.getByText('32,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 8,000点')).toBeInTheDocument();
    });
  });

  describe('役名表示', () => {
    it.each([
      { han: 5, rankName: '満貫', total: 8000, basePoints: 2000 },
      { han: 6, rankName: '跳満', total: 12000, basePoints: 3000 },
      { han: 8, rankName: '倍満', total: 16000, basePoints: 4000 },
      { han: 11, rankName: '三倍満', total: 24000, basePoints: 6000 },
      { han: 13, rankName: '役満', total: 32000, basePoints: 8000 },
    ])('$rankName の役名が表示される', ({ han, rankName, total, basePoints }) => {
      renderScoreDisplay({
        han,
        fu: 30,
        result: { total, basePoints, rankName },
      });

      expect(screen.getByText(rankName)).toBeInTheDocument();
    });

    it('役名が空文字の場合、役名は表示されない', () => {
      renderScoreDisplay({
        han: 1,
        fu: 30,
        result: { total: 1000, basePoints: 240, rankName: '' },
      });

      // 飜符は表示されているが、役名（満貫、跳満等）は表示されない
      expect(screen.getByText('1飜 30符')).toBeInTheDocument();
      expect(screen.queryByText(/満貫|跳満|倍満|三倍満|役満/)).not.toBeInTheDocument();
    });
  });

  describe('ロン和了の表示', () => {
    it('ロン時に放銃者支払いが表示される', () => {
      renderScoreDisplay({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000,
        },
      });

      expect(screen.getByText('放銃者支払い: 2,000点')).toBeInTheDocument();
    });

    it('ロン時にronPaymentがundefinedの場合、放銃者支払いは表示されない', () => {
      renderScoreDisplay({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: undefined,
        },
      });

      expect(screen.queryByText(/放銃者支払い/)).not.toBeInTheDocument();
    });

    it('ツモ時に放銃者支払いは表示されない', () => {
      renderScoreDisplay({
        winType: 'tsumo',
        result: {
          total: 3000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000, // ronPaymentがあってもツモなら表示されない
          tsumoPayment: { koPayment: 1000, oyaPayment: 2000 },
        },
      });

      expect(screen.queryByText(/放銃者支払い/)).not.toBeInTheDocument();
    });
  });

  describe('ツモ和了の表示（子ツモ）', () => {
    it.each([
      { caseName: '4人打ち', total: 3900 },
      { caseName: '3人打ち', total: 2900 },
    ])('$caseName・子ツモ時に親と子の支払いが表示される', ({ total }) => {
      renderScoreDisplay({
        winType: 'tsumo',
        result: {
          total,
          basePoints: 960,
          rankName: '',
          tsumoPayment: { koPayment: 1000, oyaPayment: 1900 },
        },
      });

      expect(screen.getByText(/子: 1,000点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 1,900点/)).toBeInTheDocument();
    });
  });

  describe('ツモ和了の表示（親ツモ）', () => {
    it.each([
      { caseName: '4人打ち', total: 3000 },
      { caseName: '3人打ち', total: 2000 },
    ])('$caseName・親ツモ時に「〇〇点オール」と表示される', ({ total }) => {
      renderScoreDisplay({
        winType: 'tsumo',
        result: {
          total,
          basePoints: 480,
          rankName: '',
          tsumoPayment: { koPayment: 1000 }, // oyaPaymentがundefined = 親ツモ
        },
      });

      expect(screen.getByText('1,000点オール')).toBeInTheDocument();
    });
  });

  describe('ツモ和了の異常系', () => {
    it('ツモ時にtsumoPaymentがundefinedの場合、支払い詳細は表示されない', () => {
      renderScoreDisplay({
        winType: 'tsumo',
        result: {
          total: 3000,
          basePoints: 480,
          rankName: '',
          tsumoPayment: undefined,
        },
      });

      expect(screen.queryByText(/点オール/)).not.toBeInTheDocument();
      expect(screen.queryByText(/子:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/親:/)).not.toBeInTheDocument();
    });

    it('ロン時にtsumoPaymentがあっても表示されない', () => {
      renderScoreDisplay({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000,
          tsumoPayment: { koPayment: 1000, oyaPayment: 500 },
        },
      });

      expect(screen.queryByText(/点オール/)).not.toBeInTheDocument();
      expect(screen.queryByText(/子:/)).not.toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('0点の場合も正しく表示される', () => {
      renderScoreDisplay({
        result: { total: 0, basePoints: 0, rankName: '' },
      });

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('基本点: 0点')).toBeInTheDocument();
    });

    it('非常に大きな点数も正しくフォーマットされる', () => {
      renderScoreDisplay({
        result: { total: 96000, basePoints: 8000, rankName: '役満' },
      });

      expect(screen.getByText('96,000')).toBeInTheDocument();
    });

    it('本場による追加点数を含む点数が正しく表示される', () => {
      renderScoreDisplay({
        result: {
          total: 1300, // 1000 + 300(本場1)
          basePoints: 240,
          rankName: '',
          ronPayment: 1300,
        },
        winType: 'ron',
      });

      expect(screen.getByText('1,300')).toBeInTheDocument();
      expect(screen.getByText('放銃者支払い: 1,300点')).toBeInTheDocument();
    });
  });

  describe('複合テスト', () => {
    it('満貫・子ツモ・4人打ちの完全な表示', () => {
      renderScoreDisplay({
        han: 5,
        fu: 30,
        winType: 'tsumo',
        result: {
          total: 8000,
          basePoints: 2000,
          rankName: '満貫',
          tsumoPayment: { koPayment: 2000, oyaPayment: 4000 },
        },
      });

      expect(screen.getByText('5飜 30符')).toBeInTheDocument();
      expect(screen.getByText('満貫')).toBeInTheDocument();
      expect(screen.getByText('8,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 2,000点')).toBeInTheDocument();
      expect(screen.getByText(/子: 2,000点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 4,000点/)).toBeInTheDocument();
    });

    it('役満・親ツモ・3人打ちの完全な表示', () => {
      renderScoreDisplay({
        han: 13,
        fu: 30,
        winType: 'tsumo',
        result: {
          total: 32000,
          basePoints: 8000,
          rankName: '役満',
          tsumoPayment: { koPayment: 16000 },
        },
      });

      expect(screen.getByText('13飜 30符')).toBeInTheDocument();
      expect(screen.getByText('役満')).toBeInTheDocument();
      expect(screen.getByText('32,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 8,000点')).toBeInTheDocument();
      expect(screen.getByText('16,000点オール')).toBeInTheDocument();
    });
  });
});
