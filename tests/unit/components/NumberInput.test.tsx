import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NumberInput } from "@/components/NumberInput";

describe("NumberInput", () => {
  const defaultProps = {
    label: "テストラベル",
    value: 30,
    onChange: vi.fn(),
    selectOptions: [10, 20, 30, 40, 50],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本的なレンダリング", () => {
    it("ラベルが正しく表示される", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByText("テストラベル")).toBeInTheDocument();
    });

    it("選択中の値がボタンに表示される", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByRole("button", { name: /30/ })).toBeInTheDocument();
    });
  });

  describe("ドロップダウン挙動", () => {
    it("クリックでドロップダウンが開閉する", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: /30/ });
      await user.click(button);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(button);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("オプション一覧がすべて表示される", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      expect(screen.getAllByRole("option")).toHaveLength(
        defaultProps.selectOptions.length
      );
    });

    it("オプション選択でonChangeが呼ばれて閉じる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      await user.click(screen.getByRole("option", { name: "40" }));

      expect(handleChange).toHaveBeenCalledWith(40);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("aria属性が正しく設定される", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: /30/ });
      expect(button).toHaveAttribute("aria-haspopup", "listbox");
      expect(button).toHaveAttribute("aria-expanded", "false");

      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("選択中のオプションにaria-selectedが付与される", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: /30/ }));

      expect(screen.getByRole("option", { name: "30" })).toHaveAttribute(
        "aria-selected",
        "true"
      );
      expect(screen.getByRole("option", { name: "40" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });
  });

  describe("キーボード操作", () => {
    it("Escapeでドロップダウンを閉じる", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole("button", { name: /30/ });
      await user.click(button);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("Enterキーでオプションを選択できる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      await user.tab();
      const firstOption = screen.getByRole("option", { name: "10" });

      expect(firstOption).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleChange).toHaveBeenCalledWith(10);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("Spaceキーでオプションを選択できる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      await user.tab();
      const firstOption = screen.getByRole("option", { name: "10" });

      expect(firstOption).toHaveFocus();

      await user.keyboard("{ }");
      expect(handleChange).toHaveBeenCalledWith(10);
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("その他のキーでは選択されない", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      await user.tab();
      const firstOption = screen.getByRole("option", { name: "10" });

      expect(firstOption).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("外側クリック", () => {
    it("外側クリックで閉じる", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <NumberInput {...defaultProps} />
          <button type="button">外側</button>
        </div>
      );

      const button = screen.getByRole("button", { name: /30/ });
      await user.click(button);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "外側" }));
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("ドロップダウン内のクリックでは閉じない", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      const listbox = screen.getByRole("listbox");

      await user.click(listbox);
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("クイックボタン", () => {
    const quickButtonProps = {
      ...defaultProps,
      quickButtons: [1, 2, 3, 4, 5],
    };

    it("クイックボタンが表示される", () => {
      render(<NumberInput {...quickButtonProps} />);
      quickButtonProps.quickButtons.forEach((num) => {
        expect(
          screen.getByRole("button", { name: String(num) })
        ).toBeInTheDocument();
      });
    });

    it("クリックするとonChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput {...quickButtonProps} onChange={handleChange} />);

      await user.click(screen.getByRole("button", { name: "4" }));
      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it("クイックボタン未設定時はドロップダウンのみ", () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByRole("button", { name: /30/ })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "1" })
      ).not.toBeInTheDocument();
    });

    it("クイックボタンが空配列でもエラーにならない", () => {
      render(<NumberInput {...defaultProps} quickButtons={[]} />);
      expect(screen.getByRole("button", { name: /30/ })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "1" })
      ).not.toBeInTheDocument();
    });
  });

  describe("複合パターンとエッジケース", () => {
    it("ドロップダウンとクイックボタンを同時に扱える", () => {
      render(
        <NumberInput
          {...defaultProps}
          selectOptions={[20, 30, 40]}
          quickButtons={[2, 4]}
        />
      );

      expect(screen.getByRole("button", { name: /30/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    });

    it("selectOptionsが空でもリストを開ける", async () => {
      const user = userEvent.setup();
      render(<NumberInput {...defaultProps} selectOptions={[]} />);

      await user.click(screen.getByRole("button", { name: /30/ }));
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });

    it("値が0でも正しく表示される", () => {
      render(<NumberInput {...defaultProps} value={0} />);
      expect(screen.getByRole("button", { name: /0/ })).toBeInTheDocument();
    });

    it("非常に大きな値でも表示できる", () => {
      render(
        <NumberInput
          {...defaultProps}
          value={999999}
          selectOptions={[999999]}
        />
      );
      expect(
        screen.getByRole("button", { name: /999999/ })
      ).toBeInTheDocument();
    });
  });
});
