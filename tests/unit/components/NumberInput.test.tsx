import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '@/components/NumberInput';

describe('NumberInput', () => {
  const defaultProps = {
    label: 'テストラベル',
    value: 5,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('ラベルが正しく表示される', () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByText('テストラベル')).toBeInTheDocument();
    });

    it('数値入力モードで値が表示される', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);
    });

    it('ドロップダウンモードで値が表示される', () => {
      render(
        <NumberInput
          {...defaultProps}
          selectOptions={[10, 20, 30]}
        />
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('カスタムmin/max値が設定される', () => {
      render(<NumberInput {...defaultProps} min={1} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '100');
    });

    it('デフォルトのmin/max値が適用される', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '999');
    });
  });

  describe('数値入力モード', () => {
    it('有効な値を入力するとonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });

      expect(onChange).toHaveBeenCalledWith(10);
    });

    it('min値と同じ値を入力できる', () => {
      const onChange = vi.fn();
      // 初期値を10に設定し、min値の5を入力できることを確認
      render(<NumberInput {...defaultProps} value={10} onChange={onChange} min={5} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '5' } });

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('max値と同じ値を入力できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} max={100} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '100' } });

      expect(onChange).toHaveBeenCalledWith(100);
    });

    it('inputModeがnumericに設定されている', () => {
      render(<NumberInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('inputMode', 'numeric');
    });
  });

  describe('数値入力モード - 異常系', () => {
    it('min未満の値を入力するとonChangeは呼ばれない', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={5} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '3' } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('max超の値を入力するとonChangeは呼ばれない', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} max={10} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '15' } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('無効な文字列を入力するとmin値にフォールバックする', () => {
      // type="number"のinputでは無効な文字列は空文字列として扱われる
      // 空文字列の場合、実装ではmin値にフォールバックする
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={1} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: 'abc' } });

      // ブラウザが'abc'を空文字列として扱い、空文字列のハンドリングでmin値が設定される
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('空の入力でonChangeがmin値で呼ばれる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={1} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('負の数はminが0の場合受け付けない', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={0} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '-5' } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('小数点を含む値は整数として解釈される', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '5.7' } });

      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe('ドロップダウンモード', () => {
    const dropdownProps = {
      ...defaultProps,
      value: 30,
      selectOptions: [20, 25, 30, 40, 50],
    };

    it('ドロップダウンボタンが表示される', () => {
      render(<NumberInput {...dropdownProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('クリックでドロップダウンが開く', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('再クリックでドロップダウンが閉じる', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('すべてのオプションが表示される', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5);
    });

    it('オプションを選択するとonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...dropdownProps} onChange={onChange} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: '40' });
      fireEvent.click(option);

      expect(onChange).toHaveBeenCalledWith(40);
    });

    it('オプションを選択するとドロップダウンが閉じる', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: '40' });
      fireEvent.click(option);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('aria-expandedが正しく設定される', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('aria-haspopupが設定される', () => {
      render(<NumberInput {...dropdownProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('現在選択中のオプションにaria-selectedが設定される', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const selectedOption = screen.getByRole('option', { name: '30' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const notSelectedOption = screen.getByRole('option', { name: '40' });
      expect(notSelectedOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('ドロップダウンモード - キーボード操作', () => {
    const dropdownProps = {
      ...defaultProps,
      value: 30,
      selectOptions: [20, 25, 30, 40, 50],
    };

    it('Escapeキーでドロップダウンが閉じる', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(button, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('Enterキーでオプションを選択できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...dropdownProps} onChange={onChange} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: '40' });
      fireEvent.keyDown(option, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(40);
    });

    it('Spaceキーでオプションを選択できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...dropdownProps} onChange={onChange} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: '25' });
      fireEvent.keyDown(option, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(25);
    });

    it('その他のキーではオプションが選択されない', () => {
      const onChange = vi.fn();
      render(<NumberInput {...dropdownProps} onChange={onChange} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const option = screen.getByRole('option', { name: '40' });
      fireEvent.keyDown(option, { key: 'Tab' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('ドロップダウンモード - 外側クリック', () => {
    const dropdownProps = {
      ...defaultProps,
      value: 30,
      selectOptions: [20, 25, 30, 40, 50],
    };

    it('外側をクリックするとドロップダウンが閉じる', () => {
      render(
        <div>
          <NumberInput {...dropdownProps} />
          <button data-testid="outside">外側</button>
        </div>
      );

      const dropdownButton = screen.getByRole('button', { name: /30/ });
      fireEvent.click(dropdownButton);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const outsideButton = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideButton);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ドロップダウン内をクリックしても閉じない', () => {
      render(<NumberInput {...dropdownProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const listbox = screen.getByRole('listbox');
      fireEvent.mouseDown(listbox);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('クイックボタン', () => {
    const quickButtonProps = {
      ...defaultProps,
      value: 3,
      quickButtons: [1, 2, 3, 4, 5],
    };

    it('クイックボタンが表示される', () => {
      render(<NumberInput {...quickButtonProps} />);

      quickButtonProps.quickButtons.forEach(num => {
        expect(screen.getByRole('button', { name: String(num) })).toBeInTheDocument();
      });
    });

    it('クイックボタンをクリックするとonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...quickButtonProps} onChange={onChange} />);

      const button = screen.getByRole('button', { name: '4' });
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledWith(4);
    });

    it('各ボタンが正しい値でonChangeを呼ぶ', () => {
      const onChange = vi.fn();
      render(<NumberInput {...quickButtonProps} onChange={onChange} />);

      [1, 2, 3, 4, 5].forEach(num => {
        const button = screen.getByRole('button', { name: String(num) });
        fireEvent.click(button);
        expect(onChange).toHaveBeenCalledWith(num);
      });
    });

    it('クイックボタンがない場合は表示されない', () => {
      render(<NumberInput {...defaultProps} />);

      // 数値入力のみでボタンはない
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });
  });

  describe('複合モード', () => {
    it('ドロップダウンとクイックボタンを同時に表示できる', () => {
      render(
        <NumberInput
          {...defaultProps}
          selectOptions={[20, 30, 40]}
          quickButtons={[1, 2, 3]}
        />
      );

      // ドロップダウンボタン
      const dropdownButton = screen.getByRole('button', { name: /5/ });
      expect(dropdownButton).toBeInTheDocument();

      // クイックボタン
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('数値入力とクイックボタンを同時に表示できる', () => {
      render(
        <NumberInput
          {...defaultProps}
          quickButtons={[1, 2, 3, 4, 5]}
        />
      );

      // 数値入力
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      // クイックボタン
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('空のselectOptionsでもエラーにならない', () => {
      render(
        <NumberInput
          {...defaultProps}
          selectOptions={[]}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('空のquickButtonsでもエラーにならない', () => {
      render(
        <NumberInput
          {...defaultProps}
          quickButtons={[]}
        />
      );

      // 数値入力のみが表示される
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('非常に大きな値も扱える', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} max={999999} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '999999' } });

      expect(onChange).toHaveBeenCalledWith(999999);
    });

    it('0の値を正しく扱える', () => {
      render(<NumberInput {...defaultProps} value={0} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(0);
    });

    it('負のminを設定できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} min={-10} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '-5' } });

      expect(onChange).toHaveBeenCalledWith(-5);
    });
  });
});
