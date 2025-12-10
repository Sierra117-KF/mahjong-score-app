import type { ScoreInput } from "@/types";
import { calculateScore, formatScore } from "@/utils/scoreCalculator";

describe("formatScore", () => {
  it("should format small numbers", () => {
    expect(formatScore(100)).toBe("100");
    expect(formatScore(300)).toBe("300");
    expect(formatScore(500)).toBe("500");
  });

  it("should format numbers with comma separator", () => {
    expect(formatScore(1000)).toBe("1,000");
    expect(formatScore(2000)).toBe("2,000");
    expect(formatScore(8000)).toBe("8,000");
  });

  it("should format large numbers", () => {
    expect(formatScore(12000)).toBe("12,000");
    expect(formatScore(24000)).toBe("24,000");
    expect(formatScore(48000)).toBe("48,000");
  });
});

describe("calculateScore", () => {
  // ヘルパー関数: デフォルト入力を作成
  const createInput = (overrides: Partial<ScoreInput> = {}): ScoreInput => ({
    gameMode: "four",
    playerType: "ko",
    winType: "ron",
    han: 1,
    fu: 30,
    honba: 0,
    ...overrides,
  });

  describe("子ロン（ko ron）", () => {
    it.each([
      [1, 30, 1000, ""],
      [2, 30, 2000, ""],
      [3, 30, 3900, ""],
      [3, 60, 7700, ""],
      [4, 30, 7700, ""],
      [1, 40, 1300, ""],
      [2, 40, 2600, ""],
      [2, 50, 3200, ""],
    ])("%i飜%i符 = %i点", (han, fu, expectedTotal, expectedRank) => {
      const result = calculateScore(createInput({ han, fu }));
      expect(result.total).toBe(expectedTotal);
      expect(result.ronPayment).toBe(expectedTotal);
      expect(result.rankName).toBe(expectedRank);
    });
  });

  describe("親ロン（oya ron）", () => {
    it.each([
      [1, 30, 1500],
      [2, 30, 2900],
      [3, 30, 5800],
      [4, 30, 11600],
      [1, 40, 2000],
      [2, 40, 3900],
    ])("%i飜%i符 = %i点", (han, fu, expectedTotal) => {
      const result = calculateScore(
        createInput({ playerType: "oya", han, fu })
      );
      expect(result.total).toBe(expectedTotal);
      expect(result.ronPayment).toBe(expectedTotal);
    });
  });

  describe("子ツモ 4人打ち（ko tsumo four players）", () => {
    it.each([
      [1, 30, 300, 500, 1000],
      [2, 30, 500, 1000, 2000],
      [3, 30, 1000, 2000, 3900],
      [4, 30, 2000, 3900, 7700],
    ])(
      "%i飜%i符 = %i/%i点（合計%i点）",
      (han, fu, koPayment, oyaPayment, total) => {
        const result = calculateScore(
          createInput({ winType: "tsumo", han, fu })
        );
        expect(result.tsumoPayment?.oyaPayment).toBe(oyaPayment);
        expect(result.tsumoPayment?.koPayment).toBe(koPayment);
        expect(result.total).toBe(total);
      }
    );
  });

  describe("子ツモ 3人打ち（ko tsumo three players）", () => {
    it.each([
      [1, 30, 400, 600, 1000],
      [2, 30, 800, 1200, 2000],
    ])(
      "%i飜%i符 = %i/%i点（合計%i点）",
      (han, fu, koPayment, oyaPayment, total) => {
        const result = calculateScore(
          createInput({
            gameMode: "three",
            winType: "tsumo",
            han,
            fu,
          })
        );
        expect(result.tsumoPayment?.oyaPayment).toBe(oyaPayment);
        expect(result.tsumoPayment?.koPayment).toBe(koPayment);
        expect(result.total).toBe(total);
      }
    );
  });

  describe("親ツモ 4人打ち（oya tsumo four players）", () => {
    it.each([
      [1, 30, 500, 1500],
      [2, 30, 1000, 2900],
      [3, 30, 2000, 5800],
      [4, 30, 3900, 11600],
    ])("%i飜%i符 = %iオール（合計%i点）", (han, fu, koPayment, total) => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han,
          fu,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(koPayment);
      expect(result.tsumoPayment?.oyaPayment).toBeUndefined();
      expect(result.total).toBe(total);
    });
  });

  describe("親ツモ 3人打ち（oya tsumo three players）", () => {
    it.each([
      [2, 30, 1000, 2000],
      [3, 30, 2000, 4000],
    ])("%i飜%i符 = %iオール（合計%i点）", (han, fu, koPayment, total) => {
      const result = calculateScore(
        createInput({
          gameMode: "three",
          playerType: "oya",
          winType: "tsumo",
          han,
          fu,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(koPayment);
      expect(result.total).toBe(total);
    });
  });

  describe("満貫（mangan）", () => {
    it("5飜で満貫（子ロン）= 8,000点", () => {
      const result = calculateScore(createInput({ han: 5, fu: 30 }));
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe("満貫");
      expect(result.basePoints).toBe(2000);
    });

    it("5飜で満貫（親ロン）= 12,000点", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          han: 5,
          fu: 30,
        })
      );
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe("満貫");
    });

    it("5飜で満貫（子ツモ）= 2,000/4,000点", () => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han: 5,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(4000);
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe("満貫");
    });

    it("5飜で満貫（親ツモ）= 4,000オール", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han: 5,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(4000);
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe("満貫");
    });

    // 満貫境界テスト（切り上げ満貫）
    it.each([
      [4, 40, 8000, "満貫"],
      [3, 70, 8000, "満貫"],
    ])("%i飜%i符で満貫（子ロン）= %i点", (han, fu, total, rankName) => {
      const result = calculateScore(createInput({ han, fu }));
      expect(result.total).toBe(total);
      expect(result.rankName).toBe(rankName);
    });

    it.each([
      [4, 40],
      [3, 70],
    ])("%i飜%i符で満貫（子ツモ）= 2,000/4,000点", (han, fu) => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han,
          fu,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(4000);
      expect(result.tsumoPayment?.koPayment).toBe(2000);
      expect(result.total).toBe(8000);
      expect(result.rankName).toBe("満貫");
    });

    it.each([
      [4, 40],
      [3, 70],
    ])("%i飜%i符で満貫（親ツモ）= 4,000オール", (han, fu) => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han,
          fu,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(4000);
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe("満貫");
    });

    // 満貫でない境界テスト
    it.each([
      [4, 30, 7700, ""],
      [3, 60, 7700, ""],
    ])("%i飜%i符は満貫ではない（子ロン）= %i点", (han, fu, total, rankName) => {
      const result = calculateScore(createInput({ han, fu }));
      expect(result.total).toBe(total);
      expect(result.rankName).toBe(rankName);
    });
  });

  describe("跳満（haneman）", () => {
    it("6飜で跳満（子ロン）= 12,000点", () => {
      const result = calculateScore(createInput({ han: 6, fu: 30 }));
      expect(result.total).toBe(12000);
      expect(result.rankName).toBe("跳満");
      expect(result.basePoints).toBe(3000);
    });

    it.each([
      [6, 12000, "跳満"],
      [7, 12000, "跳満"],
    ])("%i飜で跳満（子ロン）= %i点", (han, total, rankName) => {
      const result = calculateScore(createInput({ han, fu: 30 }));
      expect(result.total).toBe(total);
      expect(result.rankName).toBe(rankName);
    });

    it("6飜で跳満（親ロン）= 18,000点", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          han: 6,
          fu: 30,
        })
      );
      expect(result.total).toBe(18000);
      expect(result.rankName).toBe("跳満");
    });

    it("6飜で跳満（子ツモ）= 3,000/6,000点", () => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han: 6,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(6000);
      expect(result.tsumoPayment?.koPayment).toBe(3000);
      expect(result.total).toBe(12000);
    });

    it("6飜で跳満（親ツモ）= 6,000オール", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han: 6,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(6000);
      expect(result.total).toBe(18000);
    });
  });

  describe("倍満（baiman）", () => {
    it("8飜で倍満（子ロン）= 16,000点", () => {
      const result = calculateScore(createInput({ han: 8, fu: 30 }));
      expect(result.total).toBe(16000);
      expect(result.rankName).toBe("倍満");
      expect(result.basePoints).toBe(4000);
    });

    it.each([
      [8, 16000, "倍満"],
      [9, 16000, "倍満"],
      [10, 16000, "倍満"],
    ])("%i飜で倍満（子ロン）= %i点", (han, total, rankName) => {
      const result = calculateScore(createInput({ han, fu: 30 }));
      expect(result.total).toBe(total);
      expect(result.rankName).toBe(rankName);
    });

    it("8飜で倍満（親ロン）= 24,000点", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          han: 8,
          fu: 30,
        })
      );
      expect(result.total).toBe(24000);
      expect(result.rankName).toBe("倍満");
    });

    it("8飜で倍満（子ツモ）= 4,000/8,000点", () => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han: 8,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(8000);
      expect(result.tsumoPayment?.koPayment).toBe(4000);
      expect(result.total).toBe(16000);
    });

    it("8飜で倍満（親ツモ）= 8,000オール", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han: 8,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(8000);
      expect(result.total).toBe(24000);
    });
  });

  describe("三倍満（sanbaiman）", () => {
    it("11飜で三倍満（子ロン）= 24,000点", () => {
      const result = calculateScore(createInput({ han: 11, fu: 30 }));
      expect(result.total).toBe(24000);
      expect(result.rankName).toBe("三倍満");
      expect(result.basePoints).toBe(6000);
    });

    it.each([
      [11, 24000, "三倍満"],
      [12, 24000, "三倍満"],
    ])("%i飜で三倍満（子ロン）= %i点", (han, total, rankName) => {
      const result = calculateScore(createInput({ han, fu: 30 }));
      expect(result.total).toBe(total);
      expect(result.rankName).toBe(rankName);
    });

    it("11飜で三倍満（親ロン）= 36,000点", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          han: 11,
          fu: 30,
        })
      );
      expect(result.total).toBe(36000);
      expect(result.rankName).toBe("三倍満");
    });

    it("11飜で三倍満（子ツモ）= 6,000/12,000点", () => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han: 11,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(12000);
      expect(result.tsumoPayment?.koPayment).toBe(6000);
      expect(result.total).toBe(24000);
    });

    it("11飜で三倍満（親ツモ）= 12,000オール", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han: 11,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(12000);
      expect(result.total).toBe(36000);
    });
  });

  describe("役満（yakuman）", () => {
    it("13飜で役満（子ロン）= 32,000点", () => {
      const result = calculateScore(createInput({ han: 13, fu: 30 }));
      expect(result.total).toBe(32000);
      expect(result.rankName).toBe("役満");
      expect(result.basePoints).toBe(8000);
    });

    it("13飜で役満（親ロン）= 48,000点", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          han: 13,
          fu: 30,
        })
      );
      expect(result.total).toBe(48000);
      expect(result.rankName).toBe("役満");
    });

    it("13飜で役満（子ツモ）= 8,000/16,000点", () => {
      const result = calculateScore(
        createInput({
          winType: "tsumo",
          han: 13,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.oyaPayment).toBe(16000);
      expect(result.tsumoPayment?.koPayment).toBe(8000);
      expect(result.total).toBe(32000);
    });

    it("13飜で役満（親ツモ）= 16,000オール", () => {
      const result = calculateScore(
        createInput({
          playerType: "oya",
          winType: "tsumo",
          han: 13,
          fu: 30,
        })
      );
      expect(result.tsumoPayment?.koPayment).toBe(16000);
      expect(result.total).toBe(48000);
    });

    it("13飜以上でも役満（20飜）", () => {
      const result = calculateScore(createInput({ han: 20, fu: 30 }));
      expect(result.total).toBe(32000);
      expect(result.rankName).toBe("役満");
    });
  });

  describe("倍役満・三倍役満（double/triple yakuman）", () => {
    it.each([
      [26, 64000, 16000, "倍役満"],
      [39, 96000, 24000, "三倍役満"],
    ])("%i飜で%s（子ロン）= %i点", (han, total, basePoints, rankName) => {
      const result = calculateScore(createInput({ han, fu: 30 }));
      expect(result.total).toBe(total);
      expect(result.basePoints).toBe(basePoints);
      expect(result.rankName).toBe(rankName);
    });
  });

  describe("本場の計算（honba）", () => {
    describe("ロン時の本場加算", () => {
      it.each([
        ["ko", 1, 1300],
        ["ko", 5, 2500],
        ["ko", 0, 1000],
      ] as const)(
        "%s %i本場（1飜30符）= %i点",
        (playerType, honba, expectedTotal) => {
          const result = calculateScore(
            createInput({
              playerType,
              han: 1,
              fu: 30,
              honba,
            })
          );
          expect(result.total).toBe(expectedTotal);
          expect(result.ronPayment).toBe(expectedTotal);
        }
      );

      it("1本場で+300点（親ロン）", () => {
        const result = calculateScore(
          createInput({
            playerType: "oya",
            han: 1,
            fu: 30,
            honba: 1,
          })
        );
        expect(result.total).toBe(1800);
        expect(result.ronPayment).toBe(1800);
      });
    });

    describe("ツモ時の本場加算", () => {
      it("1本場で各自+100点（子ツモ4人打ち）", () => {
        const result = calculateScore(
          createInput({
            winType: "tsumo",
            han: 1,
            fu: 30,
            honba: 1,
          })
        );
        expect(result.tsumoPayment?.oyaPayment).toBe(600);
        expect(result.tsumoPayment?.koPayment).toBe(400);
        expect(result.total).toBe(1300);
      });

      it("1本場で各自+100点（親ツモ4人打ち）", () => {
        const result = calculateScore(
          createInput({
            playerType: "oya",
            winType: "tsumo",
            han: 1,
            fu: 30,
            honba: 1,
          })
        );
        expect(result.tsumoPayment?.koPayment).toBe(600);
        expect(result.total).toBe(1800);
      });

      it("3本場で各自+300点（子ツモ4人打ち）", () => {
        const result = calculateScore(
          createInput({
            winType: "tsumo",
            han: 1,
            fu: 30,
            honba: 3,
          })
        );
        expect(result.tsumoPayment?.oyaPayment).toBe(800);
        expect(result.tsumoPayment?.koPayment).toBe(600);
        expect(result.total).toBe(1900);
      });
    });
  });

  describe("エッジケース・境界値", () => {
    describe("特殊な符数", () => {
      it("20符（ピンフツモ）子ツモ = 400/700点", () => {
        const result = calculateScore(
          createInput({
            winType: "tsumo",
            han: 2,
            fu: 20,
          })
        );
        expect(result.tsumoPayment?.oyaPayment).toBe(700);
        expect(result.tsumoPayment?.koPayment).toBe(400);
      });

      // 25符（七対子）のテスト
      it.each([
        [2, 25, 1600],
        [3, 25, 3200],
        [4, 25, 6400],
      ])("%i飜%i符（七対子）子ロン = %i点", (han, fu, total) => {
        const result = calculateScore(createInput({ han, fu }));
        expect(result.total).toBe(total);
      });

      it("110符 子ロン 1飜 = 3,600点", () => {
        const result = calculateScore(
          createInput({
            han: 1,
            fu: 110,
          })
        );
        expect(result.total).toBe(3600);
      });
    });

    describe("満貫切り上げの境界", () => {
      it.each([
        [4, 50, 8000, "満貫"],
        [3, 80, 8000, "満貫"],
      ])("%i飜%i符は満貫（子ロン）= %i点", (han, fu, total, rankName) => {
        const result = calculateScore(createInput({ han, fu }));
        expect(result.total).toBe(total);
        expect(result.rankName).toBe(rankName);
      });
    });

    describe("大きな本場数", () => {
      it.each([
        [10, 4000],
        [20, 7000],
      ])("%i本場（子ロン 1飜30符）= %i点", (honba, total) => {
        const result = calculateScore(
          createInput({
            han: 1,
            fu: 30,
            honba,
          })
        );
        expect(result.total).toBe(total);
      });
    });

    describe("結果オブジェクトの構造", () => {
      it("ロン時はtsumoPaymentがundefined", () => {
        const result = calculateScore(createInput({ winType: "ron" }));
        expect(result.tsumoPayment).toBeUndefined();
        expect(result.ronPayment).toBeDefined();
      });

      it("ツモ時はronPaymentがundefined", () => {
        const result = calculateScore(createInput({ winType: "tsumo" }));
        expect(result.ronPayment).toBeUndefined();
        expect(result.tsumoPayment).toBeDefined();
      });

      it("basePointsが正しく設定される", () => {
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
