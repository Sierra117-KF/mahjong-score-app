import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleButton } from "@/components/ToggleButton";

describe("ToggleButton", () => {
  const defaultOptions = [
    { value: "option1", label: "オプション1" },
    { value: "option2", label: "オプション2" },
    { value: "option3", label: "オプション3" },
  ];

  const defaultProps = {
    options: defaultOptions,
    value: "option1" as const,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本的なレンダリング", () => {
    it("すべてのオプションが表示される", () => {
      render(<ToggleButton {...defaultProps} />);

      expect(screen.getByText("オプション1")).toBeInTheDocument();
      expect(screen.getByText("オプション2")).toBeInTheDocument();
      expect(screen.getByText("オプション3")).toBeInTheDocument();
    });

    it("ラベルが渡された場合に表示される", () => {
      render(<ToggleButton {...defaultProps} label="テストラベル" />);

      expect(screen.getByText("テストラベル")).toBeInTheDocument();
    });

    it("ラベルが渡されない場合は表示されない", () => {
      render(<ToggleButton {...defaultProps} />);

      // ラベル用のspan要素が存在しないことを確認
      const labels = screen.queryByText(/テストラベル/);
      expect(labels).not.toBeInTheDocument();
    });

    it("すべてのオプションがボタンとして表示される", () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("各ボタンが正しいラベルを表示する", () => {
      render(<ToggleButton {...defaultProps} />);

      const button1 = screen.getByRole("button", { name: "オプション1" });
      const button2 = screen.getByRole("button", { name: "オプション2" });
      const button3 = screen.getByRole("button", { name: "オプション3" });

      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
      expect(button3).toBeInTheDocument();
    });
  });

  describe("選択状態", () => {
    it("選択されたオプションがaria-pressed=trueになる", () => {
      render(<ToggleButton {...defaultProps} value="option2" />);

      const selectedButton = screen.getByRole("button", {
        name: "オプション2",
      });
      expect(selectedButton).toHaveAttribute("aria-pressed", "true");
    });

    it("選択されていないオプションがaria-pressed=falseになる", () => {
      render(<ToggleButton {...defaultProps} value="option1" />);

      const unselectedButton = screen.getByRole("button", {
        name: "オプション2",
      });
      expect(unselectedButton).toHaveAttribute("aria-pressed", "false");
    });

    it("選択を変更するとaria-pressedが正しく更新される", () => {
      const { rerender } = render(
        <ToggleButton {...defaultProps} value="option1" />
      );

      let button1 = screen.getByRole("button", { name: "オプション1" });
      let button2 = screen.getByRole("button", { name: "オプション2" });

      expect(button1).toHaveAttribute("aria-pressed", "true");
      expect(button2).toHaveAttribute("aria-pressed", "false");

      rerender(<ToggleButton {...defaultProps} value="option2" />);

      button1 = screen.getByRole("button", { name: "オプション1" });
      button2 = screen.getByRole("button", { name: "オプション2" });

      expect(button1).toHaveAttribute("aria-pressed", "false");
      expect(button2).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("クリックイベント", () => {
    it("ボタンをクリックするとonChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "オプション2" });
      await user.click(button);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("クリックしたボタンの値でonChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "オプション2" });
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("各ボタンが正しい値でonChangeを呼ぶ", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={handleChange} />);

      const button1 = screen.getByRole("button", { name: "オプション1" });
      const button2 = screen.getByRole("button", { name: "オプション2" });
      const button3 = screen.getByRole("button", { name: "オプション3" });

      await user.click(button1);
      expect(handleChange).toHaveBeenLastCalledWith("option1");

      await user.click(button2);
      expect(handleChange).toHaveBeenLastCalledWith("option2");

      await user.click(button3);
      expect(handleChange).toHaveBeenLastCalledWith("option3");

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it("同じボタンを複数回クリックできる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "オプション2" });

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenCalledWith("option2");
    });
  });

  describe("アクセシビリティ", () => {
    it('すべてのボタンがtype="button"を持っている', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("最小タッチターゲットサイズを満たしている", () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("min-h-[44px]");
        expect(button).toHaveClass("min-w-[44px]");
      });
    });
  });

  describe("2つのオプション", () => {
    const twoOptions = [
      { value: "ron", label: "ロン" },
      { value: "tsumo", label: "ツモ" },
    ];

    it("2つのオプションが正しく表示される", () => {
      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={twoOptions}
          value="ron"
          onChange={handleChange}
        />
      );

      expect(screen.getByText("ロン")).toBeInTheDocument();
      expect(screen.getByText("ツモ")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("2つのオプション間で切り替えができる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={twoOptions}
          value="ron"
          onChange={handleChange}
        />
      );

      const tsumoButton = screen.getByRole("button", { name: "ツモ" });
      await user.click(tsumoButton);

      expect(handleChange).toHaveBeenCalledWith("tsumo");
    });
  });

  describe("多数のオプション", () => {
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      value: `option${i}`,
      label: `オプション${i}`,
    }));

    it("多数のオプションが正しく表示される", () => {
      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={manyOptions}
          value="option0"
          onChange={handleChange}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(10);
    });

    it("多数のオプションでも正しく選択できる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={manyOptions}
          value="option0"
          onChange={handleChange}
        />
      );

      const button5 = screen.getByRole("button", { name: "オプション5" });
      await user.click(button5);

      expect(handleChange).toHaveBeenCalledWith("option5");
    });
  });

  describe("エッジケース", () => {
    it("空のoptionsでもエラーにならない", () => {
      const handleChange = vi.fn();
      render(<ToggleButton options={[]} value="" onChange={handleChange} />);

      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);
    });

    it("単一のオプションでも動作する", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const singleOption = [{ value: "only", label: "唯一のオプション" }];

      render(
        <ToggleButton
          options={singleOption}
          value="only"
          onChange={handleChange}
        />
      );

      expect(screen.getByText("唯一のオプション")).toBeInTheDocument();

      const button = screen.getByRole("button", { name: "唯一のオプション" });
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith("only");
    });

    it("valueが選択肢に含まれていない場合でもレンダリングされる", () => {
      // 型安全性を保ちながら、存在しない値をテストする
      type TestValue = "option1" | "option2" | "option3";
      const nonexistentValue = "nonexistent" as unknown as TestValue;

      render(<ToggleButton {...defaultProps} value={nonexistentValue} />);

      // すべてのボタンが選択されていない状態でレンダリングされる
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed", "false");
      });
    });

    it("数値型の値でも動作する", async () => {
      const user = userEvent.setup();
      const numericOptions = [
        { value: "1", label: "1人" },
        { value: "2", label: "2人" },
        { value: "3", label: "3人" },
      ];

      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={numericOptions}
          value="2"
          onChange={handleChange}
        />
      );

      const button3 = screen.getByRole("button", { name: "3人" });
      await user.click(button3);

      expect(handleChange).toHaveBeenCalledWith("3");
    });

    it("特殊文字を含むラベルも正しく表示される", () => {
      const specialOptions = [
        { value: "special1", label: "親（オヤ）" },
        { value: "special2", label: "子（コ）" },
        { value: "special3", label: "4人/3人" },
      ];

      const handleChange = vi.fn();
      render(
        <ToggleButton
          options={specialOptions}
          value="special1"
          onChange={handleChange}
        />
      );

      expect(screen.getByText("親（オヤ）")).toBeInTheDocument();
      expect(screen.getByText("子（コ）")).toBeInTheDocument();
      expect(screen.getByText("4人/3人")).toBeInTheDocument();
    });
  });
});
