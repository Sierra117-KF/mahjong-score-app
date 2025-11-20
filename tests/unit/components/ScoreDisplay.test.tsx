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

  describe('基本表示', () => {
    it('飜数と符数が正しく表示される', () => {
      const props = createDefaultProps({ han: 3, fu: 40 });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('3飜 40符')).toBeInTheDocument();
    });

    it('合計点数が正しく表示される', () => {
      const props = createDefaultProps({
        result: { total: 1000, basePoints: 240, rankName: '' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('点')).toBeInTheDocument();
    });

    it('基本点が正しく表示される', () => {
      const props = createDefaultProps({
        result: { total: 2000, basePoints: 480, rankName: '' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('基本点: 480点')).toBeInTheDocument();
    });

    it('大きな点数がカンマ区切りで表示される', () => {
      const props = createDefaultProps({
        result: { total: 32000, basePoints: 8000, rankName: '役満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('32,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 8,000点')).toBeInTheDocument();
    });
  });

  describe('役名表示', () => {
    it('役名がある場合、役名が表示される', () => {
      const props = createDefaultProps({
        han: 5,
        fu: 30,
        result: { total: 8000, basePoints: 2000, rankName: '満貫' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('満貫')).toBeInTheDocument();
    });

    it('跳満の役名が表示される', () => {
      const props = createDefaultProps({
        han: 6,
        fu: 30,
        result: { total: 12000, basePoints: 3000, rankName: '跳満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('跳満')).toBeInTheDocument();
    });

    it('倍満の役名が表示される', () => {
      const props = createDefaultProps({
        han: 8,
        fu: 30,
        result: { total: 16000, basePoints: 4000, rankName: '倍満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('倍満')).toBeInTheDocument();
    });

    it('三倍満の役名が表示される', () => {
      const props = createDefaultProps({
        han: 11,
        fu: 30,
        result: { total: 24000, basePoints: 6000, rankName: '三倍満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('三倍満')).toBeInTheDocument();
    });

    it('役満の役名が表示される', () => {
      const props = createDefaultProps({
        han: 13,
        fu: 30,
        result: { total: 32000, basePoints: 8000, rankName: '役満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('役満')).toBeInTheDocument();
    });

    it('役名が空文字の場合、役名は表示されない', () => {
      const props = createDefaultProps({
        han: 1,
        fu: 30,
        result: { total: 1000, basePoints: 240, rankName: '' },
      });
      const { container } = render(<ScoreDisplay {...props} />);

      // 飜符は表示されているが、役名（満貫、跳満等）は表示されない
      expect(screen.getByText('1飜 30符')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).not.toMatch(/(満貫|跳満|倍満|三倍満|役満)/);
    });
  });

  describe('ロン和了の表示', () => {
    it('ロン時に放銃者支払いが表示される', () => {
      const props = createDefaultProps({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000,
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('放銃者支払い: 2,000点')).toBeInTheDocument();
    });

    it('ロン時にronPaymentがundefinedの場合、放銃者支払いは表示されない', () => {
      const props = createDefaultProps({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: undefined,
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.queryByText(/放銃者支払い/)).not.toBeInTheDocument();
    });

    it('ツモ時に放銃者支払いは表示されない', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 3000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000, // ronPaymentがあってもツモなら表示されない
          tsumoPayment: { koPayment: 1000, oyaPayment: 2000 },
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.queryByText(/放銃者支払い/)).not.toBeInTheDocument();
    });
  });

  describe('ツモ和了の表示（子ツモ）', () => {
    it('4人打ち・子ツモ時に親と子の支払いが表示される', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 3900,
          basePoints: 960,
          rankName: '',
          tsumoPayment: { koPayment: 1000, oyaPayment: 1900 },
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText(/子: 1,000点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 1,900点/)).toBeInTheDocument();
    });

    it('3人打ち・子ツモ時に親と子の支払いが表示される', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 2900,
          basePoints: 960,
          rankName: '',
          tsumoPayment: { koPayment: 1000, oyaPayment: 1900 },
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText(/子: 1,000点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 1,900点/)).toBeInTheDocument();
    });
  });

  describe('ツモ和了の表示（親ツモ）', () => {
    it('4人打ち・親ツモ時に「〇〇点オール」と表示される', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 3000,
          basePoints: 480,
          rankName: '',
          tsumoPayment: { koPayment: 1000 }, // oyaPaymentがundefined = 親ツモ
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('1,000点オール')).toBeInTheDocument();
    });

    it('3人打ち・親ツモ時に「〇〇点オール」と表示される', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          tsumoPayment: { koPayment: 1000 },
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('1,000点オール')).toBeInTheDocument();
    });
  });

  describe('ツモ和了の異常系', () => {
    it('ツモ時にtsumoPaymentがundefinedの場合、支払い詳細は表示されない', () => {
      const props = createDefaultProps({
        winType: 'tsumo',
        result: {
          total: 3000,
          basePoints: 480,
          rankName: '',
          tsumoPayment: undefined,
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.queryByText(/点オール/)).not.toBeInTheDocument();
      expect(screen.queryByText(/子:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/親:/)).not.toBeInTheDocument();
    });

    it('ロン時にtsumoPaymentがあっても表示されない', () => {
      const props = createDefaultProps({
        winType: 'ron',
        result: {
          total: 2000,
          basePoints: 480,
          rankName: '',
          ronPayment: 2000,
          tsumoPayment: { koPayment: 1000, oyaPayment: 500 },
        },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.queryByText(/点オール/)).not.toBeInTheDocument();
      expect(screen.queryByText(/子:/)).not.toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('0点の場合も正しく表示される', () => {
      const props = createDefaultProps({
        result: { total: 0, basePoints: 0, rankName: '' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('基本点: 0点')).toBeInTheDocument();
    });

    it('非常に大きな点数も正しくフォーマットされる', () => {
      const props = createDefaultProps({
        result: { total: 96000, basePoints: 8000, rankName: '役満' },
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('96,000')).toBeInTheDocument();
    });

    it('本場による追加点数を含む点数が正しく表示される', () => {
      const props = createDefaultProps({
        result: {
          total: 1300, // 1000 + 300(本場1)
          basePoints: 240,
          rankName: '',
          ronPayment: 1300,
        },
        winType: 'ron',
      });
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('1,300')).toBeInTheDocument();
      expect(screen.getByText('放銃者支払い: 1,300点')).toBeInTheDocument();
    });
  });

  describe('複合テスト', () => {
    it('満貫・子ツモ・4人打ちの完全な表示', () => {
      const props = createDefaultProps({
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
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('5飜 30符')).toBeInTheDocument();
      expect(screen.getByText('満貫')).toBeInTheDocument();
      expect(screen.getByText('8,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 2,000点')).toBeInTheDocument();
      expect(screen.getByText(/子: 2,000点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 4,000点/)).toBeInTheDocument();
    });

    it('役満・親ツモ・3人打ちの完全な表示', () => {
      const props = createDefaultProps({
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
      render(<ScoreDisplay {...props} />);

      expect(screen.getByText('13飜 30符')).toBeInTheDocument();
      expect(screen.getByText('役満')).toBeInTheDocument();
      expect(screen.getByText('32,000')).toBeInTheDocument();
      expect(screen.getByText('基本点: 8,000点')).toBeInTheDocument();
      expect(screen.getByText('16,000点オール')).toBeInTheDocument();
    });
  });
});
