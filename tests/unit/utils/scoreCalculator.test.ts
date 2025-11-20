import { calculateScore, formatScore } from '@/utils/scoreCalculator';
import type { ScoreInput } from '@/types';

describe('formatScore', () => {
  it('should format small numbers', () => {
    expect(formatScore(100)).toBe('100');
    expect(formatScore(300)).toBe('300');
    expect(formatScore(500)).toBe('500');
  });

  it('should format numbers with comma separator', () => {
    expect(formatScore(1000)).toBe('1,000');
    expect(formatScore(2000)).toBe('2,000');
    expect(formatScore(8000)).toBe('8,000');
  });

  it('should format large numbers', () => {
    expect(formatScore(12000)).toBe('12,000');
    expect(formatScore(24000)).toBe('24,000');
    expect(formatScore(48000)).toBe('48,000');
  });
});

describe('calculateScore', () => {
  // ヘルパー関数: デフォルト入力を作成
  const createInput = (overrides: Partial<ScoreInput> = {}): ScoreInput => ({
    gameMode: 'four',
    playerType: 'ko',
    winType: 'ron',
    han: 1,
    fu: 30,
    honba: 0,
    ...overrides,
  });

  describe('子ロン（ko ron）', () => {
    it('1飜30符 = 1,000点', () => {
      const result = calculateScore(createInput({ han: 1, fu: 30 }));
      expect(result.total).toBe(1000);
      expect(result.ronPayment).toBe(1000);
      expect(result.rankName).toBe('');
    });

    it('2飜30符 = 2,000点', () => {
      const result = calculateScore(createInput({ han: 2, fu: 30 }));
      expect(result.total).toBe(2000);
      expect(result.ronPayment).toBe(2000);
    });

    it('3飜30符 = 3,900点', () => {
      const result = calculateScore(createInput({ han: 3, fu: 30 }));
      expect(result.total).toBe(3900);
      expect(result.ronPayment).toBe(3900);
    });

    it('3飜60符 = 7,700点', () => {
      const result = calculateScore(createInput({ han: 3, fu: 60 }));
      expect(result.total).toBe(7700);
      expect(result.ronPayment).toBe(7700);
    });

    it('4飜30符 = 7,700点', () => {
      const result = calculateScore(createInput({ han: 4, fu: 30 }));
      expect(result.total).toBe(7700);
      expect(result.ronPayment).toBe(7700);
    });

    it('1飜40符 = 1,300点', () => {
      const result = calculateScore(createInput({ han: 1, fu: 40 }));
      expect(result.total).toBe(1300);
    });

    it('2飜40符 = 2,600点', () => {
      const result = calculateScore(createInput({ han: 2, fu: 40 }));
      expect(result.total).toBe(2600);
    });

    it('2飜50符 = 3,200点', () => {
      const result = calculateScore(createInput({ han: 2, fu: 50 }));
      expect(result.total).toBe(3200);
    });
  });

  describe('親ロン（oya ron）', () => {
    it('1飜30符 = 1,500点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 1,
        fu: 30,
      }));
      expect(result.total).toBe(1500);
      expect(result.ronPayment).toBe(1500);
    });

    it('2飜30符 = 2,900点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 2,
        fu: 30,
      }));
      expect(result.total).toBe(2900);
      expect(result.ronPayment).toBe(2900);
    });

    it('3飜30符 = 5,800点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 3,
        fu: 30,
      }));
      expect(result.total).toBe(5800);
      expect(result.ronPayment).toBe(5800);
    });

    it('4飜30符 = 11,600点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 4,
        fu: 30,
      }));
      expect(result.total).toBe(11600);
      expect(result.ronPayment).toBe(11600);
    });

    it('1飜40符 = 2,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 1,
        fu: 40,
      }));
      expect(result.total).toBe(2000);
    });

    it('2飜40符 = 3,900点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 2,
        fu: 40,
      }));
      expect(result.total).toBe(3900);
    });
  });

  describe('子ツモ 4人打ち（ko tsumo four players）', () => {
    it('1飜30符 = 300/500点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 1,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(500);
      expect(result.tsumoPayment?.koPayment).toBe(300);
      expect(result.total).toBe(1000);
    });

    it('2飜30符 = 500/1,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 2,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(1000);
      expect(result.tsumoPayment?.koPayment).toBe(500);
      expect(result.total).toBe(2000);
    });

    it('3飜30符 = 1,000/2,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 3,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(2000);
      expect(result.tsumoPayment?.koPayment).toBe(1000);
      expect(result.total).toBe(3900);
    });

    it('4飜30符 = 2,000/3,900点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 4,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(3900);
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(7700);
    });
  });

  describe('子ツモ 3人打ち（ko tsumo three players）', () => {
    it('1飜30符 = 400/600点', () => {
      const result = calculateScore(createInput({
        gameMode: 'three',
        winType: 'tsumo',
        han: 1,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(600);
      expect(result.tsumoPayment?.koPayment).toBe(400);
      expect(result.total).toBe(1000);
    });

    it('2飜30符 = 800/1,200点', () => {
      const result = calculateScore(createInput({
        gameMode: 'three',
        winType: 'tsumo',
        han: 2,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(1200);
      expect(result.tsumoPayment?.koPayment).toBe(800);
      expect(result.total).toBe(2000);
    });
  });

  describe('親ツモ 4人打ち（oya tsumo four players）', () => {
    it('1飜30符 = 500オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 1,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(500);
      expect(result.tsumoPayment?.oyaPayment).toBeUndefined();
      expect(result.total).toBe(1500);
    });

    it('2飜30符 = 1,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 2,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(1000);
      expect(result.total).toBe(2900);
    });

    it('3飜30符 = 2,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 3,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(5800);
    });

    it('4飜30符 = 3,900オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 4,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(3900);
      expect(result.total).toBe(11600);
    });
  });

  describe('親ツモ 3人打ち（oya tsumo three players）', () => {
    it('2飜30符 = 1,000オール', () => {
      const result = calculateScore(createInput({
        gameMode: 'three',
        playerType: 'oya',
        winType: 'tsumo',
        han: 2,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(1000);
      expect(result.total).toBe(2000);
    });

    it('3飜30符 = 2,000オール', () => {
      const result = calculateScore(createInput({
        gameMode: 'three',
        playerType: 'oya',
        winType: 'tsumo',
        han: 3,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(4000);
    });
  });

  describe('満貫（mangan）', () => {
    it('5飜で満貫（子ロン）= 8,000点', () => {
      const result = calculateScore(createInput({ han: 5, fu: 30 }));
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe('満貫');
      expect(result.basePoints).toBe(2000);
    });

    it('5飜で満貫（親ロン）= 12,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 5,
        fu: 30,
      }));
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe('満貫');
    });

    it('5飜で満貫（子ツモ）= 2,000/4,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 5,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(4000);
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe('満貫');
    });

    it('5飜で満貫（親ツモ）= 4,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 5,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(4000);
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe('満貫');
    });

    it('4飜40符で満貫（子ロン）= 8,000点', () => {
      const result = calculateScore(createInput({ han: 4, fu: 40 }));
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe('満貫');
    });

    it('3飜70符で満貫（子ロン）= 8,000点', () => {
      const result = calculateScore(createInput({ han: 3, fu: 70 }));
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe('満貫');
    });

    // 満貫境界テスト
    it('4飜30符は満貫ではない（子ロン）= 7,700点', () => {
      const result = calculateScore(createInput({ han: 4, fu: 30 }));
      expect(result.total).toBe(7700);
      expect(result.rankName).toBe('');
    });

    it('3飜60符は満貫ではない（子ロン）= 7,700点', () => {
      const result = calculateScore(createInput({ han: 3, fu: 60 }));
      expect(result.total).toBe(7700);
      expect(result.rankName).toBe('');
    });
  });

  describe('跳満（haneman）', () => {
    it('6飜で跳満（子ロン）= 12,000点', () => {
      const result = calculateScore(createInput({ han: 6, fu: 30 }));
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe('跳満');
      expect(result.basePoints).toBe(3000);
    });

    it('7飜で跳満（子ロン）= 12,000点', () => {
      const result = calculateScore(createInput({ han: 7, fu: 30 }));
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe('跳満');
    });

    it('6飜で跳満（親ロン）= 18,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 6,
        fu: 30,
      }));
      expect(result.total).toBe(18000);
      expect(result.rankName).toBe('跳満');
    });

    it('6飜で跳満（子ツモ）= 3,000/6,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 6,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(6000);
      expect(result.tsumoPayment?.koPayment).toBe(3000);
      expect(result.total).toBe(12000);
    });

    it('6飜で跳満（親ツモ）= 6,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 6,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(6000);
      expect(result.total).toBe(18000);
    });
  });

  describe('倍満（baiman）', () => {
    it('8飜で倍満（子ロン）= 16,000点', () => {
      const result = calculateScore(createInput({ han: 8, fu: 30 }));
      expect(result.total).toBe(16000);
      expect(result.rankName).toBe('倍満');
      expect(result.basePoints).toBe(4000);
    });

    it('9飜で倍満（子ロン）= 16,000点', () => {
      const result = calculateScore(createInput({ han: 9, fu: 30 }));
      expect(result.total).toBe(16000);
      expect(result.rankName).toBe('倍満');
    });

    it('10飜で倍満（子ロン）= 16,000点', () => {
      const result = calculateScore(createInput({ han: 10, fu: 30 }));
      expect(result.total).toBe(16000);
      expect(result.rankName).toBe('倍満');
    });

    it('8飜で倍満（親ロン）= 24,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 8,
        fu: 30,
      }));
      expect(result.total).toBe(24000);
      expect(result.rankName).toBe('倍満');
    });

    it('8飜で倍満（子ツモ）= 4,000/8,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 8,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(8000);
      expect(result.tsumoPayment?.koPayment).toBe(4000);
      expect(result.total).toBe(16000);
    });

    it('8飜で倍満（親ツモ）= 8,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 8,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(8000);
      expect(result.total).toBe(24000);
    });
  });

  describe('三倍満（sanbaiman）', () => {
    it('11飜で三倍満（子ロン）= 24,000点', () => {
      const result = calculateScore(createInput({ han: 11, fu: 30 }));
      expect(result.total).toBe(24000);
      expect(result.rankName).toBe('三倍満');
      expect(result.basePoints).toBe(6000);
    });

    it('12飜で三倍満（子ロン）= 24,000点', () => {
      const result = calculateScore(createInput({ han: 12, fu: 30 }));
      expect(result.total).toBe(24000);
      expect(result.rankName).toBe('三倍満');
    });

    it('11飜で三倍満（親ロン）= 36,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 11,
        fu: 30,
      }));
      expect(result.total).toBe(36000);
      expect(result.rankName).toBe('三倍満');
    });

    it('11飜で三倍満（子ツモ）= 6,000/12,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 11,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(12000);
      expect(result.tsumoPayment?.koPayment).toBe(6000);
      expect(result.total).toBe(24000);
    });

    it('11飜で三倍満（親ツモ）= 12,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 11,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(12000);
      expect(result.total).toBe(36000);
    });
  });

  describe('役満（yakuman）', () => {
    it('13飜で役満（子ロン）= 32,000点', () => {
      const result = calculateScore(createInput({ han: 13, fu: 30 }));
      expect(result.total).toBe(32000);
      expect(result.rankName).toBe('役満');
      expect(result.basePoints).toBe(8000);
    });

    it('13飜で役満（親ロン）= 48,000点', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        han: 13,
        fu: 30,
      }));
      expect(result.total).toBe(48000);
      expect(result.rankName).toBe('役満');
    });

    it('13飜で役満（子ツモ）= 8,000/16,000点', () => {
      const result = calculateScore(createInput({
        winType: 'tsumo',
        han: 13,
        fu: 30,
      }));
      expect(result.tsumoPayment?.oyaPayment).toBe(16000);
      expect(result.tsumoPayment?.koPayment).toBe(8000);
      expect(result.total).toBe(32000);
    });

    it('13飜で役満（親ツモ）= 16,000オール', () => {
      const result = calculateScore(createInput({
        playerType: 'oya',
        winType: 'tsumo',
        han: 13,
        fu: 30,
      }));
      expect(result.tsumoPayment?.koPayment).toBe(16000);
      expect(result.total).toBe(48000);
    });

    it('13飜以上でも役満（20飜）', () => {
      const result = calculateScore(createInput({ han: 20, fu: 30 }));
      expect(result.total).toBe(32000);
      expect(result.rankName).toBe('役満');
    });
  });

  describe('本場の計算（honba）', () => {
    describe('ロン時の本場加算', () => {
      it('1本場で+300点（子ロン）', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 30,
          honba: 1,
        }));
        expect(result.total).toBe(1300);
        expect(result.ronPayment).toBe(1300);
      });

      it('1本場で+300点（親ロン）', () => {
        const result = calculateScore(createInput({
          playerType: 'oya',
          han: 1,
          fu: 30,
          honba: 1,
        }));
        expect(result.total).toBe(1800);
        expect(result.ronPayment).toBe(1800);
      });

      it('5本場で+1,500点（子ロン）', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 30,
          honba: 5,
        }));
        expect(result.total).toBe(2500);
      });

      it('0本場で加算なし', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 30,
          honba: 0,
        }));
        expect(result.total).toBe(1000);
      });
    });

    describe('ツモ時の本場加算', () => {
      it('1本場で各自+100点（子ツモ4人打ち）', () => {
        const result = calculateScore(createInput({
          winType: 'tsumo',
          han: 1,
          fu: 30,
          honba: 1,
        }));
        expect(result.tsumoPayment?.oyaPayment).toBe(600);
        expect(result.tsumoPayment?.koPayment).toBe(400);
        expect(result.total).toBe(1300);
      });

      it('1本場で各自+100点（親ツモ4人打ち）', () => {
        const result = calculateScore(createInput({
          playerType: 'oya',
          winType: 'tsumo',
          han: 1,
          fu: 30,
          honba: 1,
        }));
        expect(result.tsumoPayment?.koPayment).toBe(600);
        expect(result.total).toBe(1800);
      });

      it('3本場で各自+300点（子ツモ4人打ち）', () => {
        const result = calculateScore(createInput({
          winType: 'tsumo',
          han: 1,
          fu: 30,
          honba: 3,
        }));
        expect(result.tsumoPayment?.oyaPayment).toBe(800);
        expect(result.tsumoPayment?.koPayment).toBe(600);
        expect(result.total).toBe(1900);
      });
    });
  });

  describe('エッジケース・境界値', () => {
    describe('特殊な符数', () => {
      it('20符（ピンフツモ）子ツモ = 400/700点', () => {
        const result = calculateScore(createInput({
          winType: 'tsumo',
          han: 2,
          fu: 20,
        }));
        expect(result.tsumoPayment?.oyaPayment).toBe(700);
        expect(result.tsumoPayment?.koPayment).toBe(400);
      });

      it('25符（七対子）子ロン 2飜 = 1,600点', () => {
        const result = calculateScore(createInput({
          han: 2,
          fu: 25,
        }));
        expect(result.total).toBe(1600);
      });

      it('25符（七対子）子ロン 3飜 = 3,200点', () => {
        const result = calculateScore(createInput({
          han: 3,
          fu: 25,
        }));
        expect(result.total).toBe(3200);
      });

      it('25符（七対子）子ロン 4飜 = 6,400点', () => {
        const result = calculateScore(createInput({
          han: 4,
          fu: 25,
        }));
        expect(result.total).toBe(6400);
      });

      it('110符 子ロン 1飜 = 3,600点', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 110,
        }));
        expect(result.total).toBe(3600);
      });
    });

    describe('満貫切り上げの境界', () => {
      it('4飜50符は満貫（子ロン）= 8,000点', () => {
        const result = calculateScore(createInput({ han: 4, fu: 50 }));
        expect(result.total).toBe(8000);
        expect(result.rankName).toBe('満貫');
      });

      it('3飜80符は満貫（子ロン）= 8,000点', () => {
        const result = calculateScore(createInput({ han: 3, fu: 80 }));
        expect(result.total).toBe(8000);
        expect(result.rankName).toBe('満貫');
      });
    });

    describe('大きな本場数', () => {
      it('10本場（子ロン）= +3,000点', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 30,
          honba: 10,
        }));
        expect(result.total).toBe(4000);
      });

      it('99本場（子ロン）= +29,700点', () => {
        const result = calculateScore(createInput({
          han: 1,
          fu: 30,
          honba: 99,
        }));
        expect(result.total).toBe(30700);
      });
    });

    describe('結果オブジェクトの構造', () => {
      it('ロン時はtsumoPaymentがundefined', () => {
        const result = calculateScore(createInput({ winType: 'ron' }));
        expect(result.tsumoPayment).toBeUndefined();
        expect(result.ronPayment).toBeDefined();
      });

      it('ツモ時はronPaymentがundefined', () => {
        const result = calculateScore(createInput({ winType: 'tsumo' }));
        expect(result.ronPayment).toBeUndefined();
        expect(result.tsumoPayment).toBeDefined();
      });

      it('basePointsが正しく設定される', () => {
        // 通常の基本点
        const result1 = calculateScore(createInput({ han: 1, fu: 30 }));
        expect(result1.basePoints).toBe(240);

        // 満貫の基本点
        const result2 = calculateScore(createInput({ han: 5, fu: 30 }));
        expect(result2.basePoints).toBe(2000);
      });
    });
  });
});
