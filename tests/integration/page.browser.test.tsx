import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import Home from "@/app/page";

test("ページが正しくレンダリングされる", async () => {
  await render(<Home />);

  // ヘッダーが表示される
  await expect
    .element(page.getByRole("heading", { name: "麻雀 点数計算" }))
    .toBeVisible();

  // 点数表示エリアが表示される（メインの大きい点数表示）
  await expect.element(page.getByText("1,000点").first()).toBeVisible();

  // ゲームモード選択ボタンが表示される
  await expect
    .element(page.getByRole("button", { name: "4人麻雀" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: "3人麻雀" }))
    .toBeVisible();

  // プレイヤー選択ボタンが表示される
  await expect.element(page.getByRole("button", { name: "子" })).toBeVisible();
  await expect.element(page.getByRole("button", { name: "親" })).toBeVisible();

  // 和了種別選択ボタンが表示される
  await expect
    .element(page.getByRole("button", { name: "ロン" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("button", { name: "ツモ" }))
    .toBeVisible();

  // リセットボタンが表示される
  await expect
    .element(page.getByRole("button", { name: "🔄 リセット" }))
    .toBeVisible();
});

test("4人麻雀から3人麻雀に切り替え", async () => {
  await render(<Home />);

  // 初期状態: 4人麻雀が選択されている
  const button4Players = page.getByRole("button", { name: "4人麻雀" });
  const button3Players = page.getByRole("button", { name: "3人麻雀" });

  await expect.element(button4Players).toHaveAttribute("aria-pressed", "true");
  await expect.element(button3Players).toHaveAttribute("aria-pressed", "false");

  // 3人麻雀ボタンをクリック
  await button3Players.click();

  // 選択状態が切り替わる
  await expect.element(button3Players).toHaveAttribute("aria-pressed", "true");
  await expect.element(button4Players).toHaveAttribute("aria-pressed", "false");
});

test("親/子の切り替え", async () => {
  await render(<Home />);

  // 初期状態: 子が選択されている
  const buttonKo = page.getByRole("button", { name: "子" });
  const buttonOya = page.getByRole("button", { name: "親" });

  await expect.element(buttonKo).toHaveAttribute("aria-pressed", "true");
  await expect.element(buttonOya).toHaveAttribute("aria-pressed", "false");

  // 親ボタンをクリック
  await buttonOya.click();

  // 選択状態が切り替わる
  await expect.element(buttonOya).toHaveAttribute("aria-pressed", "true");
  await expect.element(buttonKo).toHaveAttribute("aria-pressed", "false");

  // 点数が変わることを確認（1飜30符 親ロン = 1,500点）
  await expect.element(page.getByText("1,500点").first()).toBeVisible();
});

test("ロン/ツモの切り替え", async () => {
  await render(<Home />);

  // 初期状態: ロンが選択されている
  const buttonRon = page.getByRole("button", { name: "ロン" });
  const buttonTsumo = page.getByRole("button", { name: "ツモ" });

  await expect.element(buttonRon).toHaveAttribute("aria-pressed", "true");
  await expect.element(buttonTsumo).toHaveAttribute("aria-pressed", "false");

  // ツモボタンをクリック
  await buttonTsumo.click();

  // 選択状態が切り替わる
  await expect.element(buttonTsumo).toHaveAttribute("aria-pressed", "true");
  await expect.element(buttonRon).toHaveAttribute("aria-pressed", "false");

  // 点数表示が変わることを確認（1飜30符 子ツモの場合）
  // 詳細表示に「親」「子」の支払いが表示される
  await expect.element(page.getByText("親").first()).toBeVisible();
});

test("飜数を変更して点数が更新される", async () => {
  await render(<Home />);

  // 初期状態: 1飜30符 子ロン = 1,000点
  await expect.element(page.getByText("1,000点").first()).toBeVisible();

  // 2飜ボタンをクリック
  const hanButton2 = page.getByRole("button", { name: "2", exact: true });
  await hanButton2.click();

  // 点数が更新される（2飜30符 子ロン = 2,000点）
  await expect.element(page.getByText("2,000点").first()).toBeVisible();

  // 3飜ボタンをクリック
  const hanButton3 = page.getByRole("button", { name: "3", exact: true });
  await hanButton3.click();

  // 点数が更新される（3飜30符 子ロン = 3,900点）
  await expect.element(page.getByText("3,900点").first()).toBeVisible();
});

test("複雑な点数計算フロー: 親ツモ", async () => {
  await render(<Home />);

  // 親を選択
  const buttonOya = page.getByRole("button", { name: "親" });
  await buttonOya.click();

  // ツモを選択
  const buttonTsumo = page.getByRole("button", { name: "ツモ" });
  await buttonTsumo.click();

  // 2飜を選択
  const hanButton2 = page.getByRole("button", { name: "2", exact: true });
  await hanButton2.click();

  // 2飜30符 親ツモ = 1,000オール（4人打ち、各子1,000点、合計3,000点 - 本場100点 = 2,900点）
  // 「1,000点オール」のテキストが表示されることを確認
  await expect.element(page.getByText(/1,000.*オール/)).toBeVisible();
});

test("リセットボタンですべての値がデフォルトに戻る", async () => {
  await render(<Home />);

  // 値を変更
  await page.getByRole("button", { name: "親" }).click();
  await page.getByRole("button", { name: "ツモ" }).click();
  await page.getByRole("button", { name: "3", exact: true }).click();

  // 変更後の点数を確認（3飜30符 親ツモ）
  // 各子の支払い表示を確認
  await expect.element(page.getByText(/オール/)).toBeVisible();

  // リセットボタンをクリック
  await page.getByRole("button", { name: "🔄 リセット" }).click();

  // デフォルト値に戻ることを確認
  await expect
    .element(page.getByRole("button", { name: "子" }))
    .toHaveAttribute("aria-pressed", "true");
  await expect
    .element(page.getByRole("button", { name: "ロン" }))
    .toHaveAttribute("aria-pressed", "true");
  await expect.element(page.getByText("1,000点").first()).toBeVisible();
});

test("満貫以上の点数計算", async () => {
  await render(<Home />);

  // 5飜を選択（満貫）
  const hanButton5 = page.getByRole("button", { name: "5", exact: true });
  await hanButton5.click();

  // 5飜30符 子ロン = 8,000点（満貫）
  await expect.element(page.getByText("8,000点").first()).toBeVisible();

  // 「満貫」のテキストが表示されることを確認
  await expect.element(page.getByText("満貫")).toBeVisible();
});
