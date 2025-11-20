import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '@/components/NumberInput';

describe('NumberInput', () => {
  const defaultProps = {
    label: 'テストラベル',
    value: 30,
    onChange: vi.fn(),
    selectOptions: [10, 20, 30, 40, 50],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('ラベルが正しく表示される', () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByText('テストラベル')).toBeInTheDocument();
    });

    it('選択中の値がボタンに表示される', () => {
      render(<NumberInput {...defaultProps} />);
      expect(screen.getByRole('button', { name: /30/ })).toBeInTheDocument();
    });
  });

  describe('ドロップダウン挙動', () => {
    it('クリックでドロップダウンが開閉する', () => {
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole('button', { name: /30/ });
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('オプション一覧がすべて表示される', () => {
      render(<NumberInput {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      expect(screen.getAllByRole('option')).toHaveLength(defaultProps.selectOptions.length);
    });

    it('オプション選択でonChangeが呼ばれて閉じる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      fireEvent.click(screen.getByRole('option', { name: '40' }));

      expect(onChange).toHaveBeenCalledWith(40);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('aria属性が正しく設定される', () => {
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole('button', { name: /30/ });
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('選択中のオプションにaria-selectedが付与される', () => {
      render(<NumberInput {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /30/ }));

      expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: '40' })).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('キーボード操作', () => {
    it('Escapeでドロップダウンを閉じる', () => {
      render(<NumberInput {...defaultProps} />);

      const button = screen.getByRole('button', { name: /30/ });
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(button, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('Enterキーでオプションを選択できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      const option = screen.getByRole('option', { name: '40' });

      fireEvent.keyDown(option, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith(40);
    });

    it('Spaceキーでオプションを選択できる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      const option = screen.getByRole('option', { name: '40' });

      fireEvent.keyDown(option, { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(40);
    });

    it('その他のキーでは選択されない', () => {
      const onChange = vi.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      const option = screen.getByRole('option', { name: '40' });

      fireEvent.keyDown(option, { key: 'Tab' });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('外側クリック', () => {
    it('外側クリックで閉じる', () => {
      render(
        <div>
          <NumberInput {...defaultProps} />
          <button data-testid="outside">外側</button>
        </div>
      );

      const button = screen.getByRole('button', { name: /30/ });
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ドロップダウン内のクリックでは閉じない', () => {
      render(<NumberInput {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      const listbox = screen.getByRole('listbox');

      fireEvent.mouseDown(listbox);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('クイックボタン', () => {
    const quickButtonProps = {
      ...defaultProps,
      quickButtons: [1, 2, 3, 4, 5],
    };

    it('クイックボタンが表示される', () => {
      render(<NumberInput {...quickButtonProps} />);
      quickButtonProps.quickButtons.forEach(num => {
        expect(screen.getByRole('button', { name: String(num) })).toBeInTheDocument();
      });
    });

    it('クリックするとonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<NumberInput {...quickButtonProps} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: '4' }));
      expect(onChange).toHaveBeenCalledWith(4);
    });

    it('クイックボタン未設定時はドロップダウンのみ', () => {
      render(<NumberInput {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('クイックボタンが空配列でもエラーにならない', () => {
      render(<NumberInput {...defaultProps} quickButtons={[]} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });
  });

  describe('複合パターンとエッジケース', () => {
    it('ドロップダウンとクイックボタンを同時に扱える', () => {
      render(
        <NumberInput
          {...defaultProps}
          selectOptions={[20, 30, 40]}
          quickButtons={[2, 4]}
        />
      );

      expect(screen.getByRole('button', { name: /30/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    });

    it('selectOptionsが空でもリストを開ける', () => {
      render(<NumberInput {...defaultProps} selectOptions={[]} />);

      fireEvent.click(screen.getByRole('button', { name: /30/ }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('値が0でも正しく表示される', () => {
      render(<NumberInput {...defaultProps} value={0} />);
      expect(screen.getByRole('button', { name: /0/ })).toBeInTheDocument();
    });

    it('非常に大きな値でも表示できる', () => {
      render(<NumberInput {...defaultProps} value={999999} selectOptions={[999999]} />);
      expect(screen.getByRole('button', { name: /999999/ })).toBeInTheDocument();
    });
  });
});
