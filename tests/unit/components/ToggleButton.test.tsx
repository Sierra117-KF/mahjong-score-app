import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButton } from '@/components/ToggleButton';

describe('ToggleButton', () => {
  const defaultOptions = [
    { value: 'option1', label: 'オプション1' },
    { value: 'option2', label: 'オプション2' },
    { value: 'option3', label: 'オプション3' },
  ];

  const defaultProps = {
    options: defaultOptions,
    value: 'option1' as const,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('すべてのオプションが表示される', () => {
      render(<ToggleButton {...defaultProps} />);

      expect(screen.getByText('オプション1')).toBeInTheDocument();
      expect(screen.getByText('オプション2')).toBeInTheDocument();
      expect(screen.getByText('オプション3')).toBeInTheDocument();
    });

    it('ラベルが渡された場合に表示される', () => {
      render(<ToggleButton {...defaultProps} label="テストラベル" />);

      expect(screen.getByText('テストラベル')).toBeInTheDocument();
    });

    it('ラベルが渡されない場合は表示されない', () => {
      render(<ToggleButton {...defaultProps} />);

      // ラベル用のspan要素が存在しないことを確認
      const labels = screen.queryByText(/テストラベル/);
      expect(labels).not.toBeInTheDocument();
    });

    it('すべてのオプションがボタンとして表示される', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('各ボタンが正しいラベルを表示する', () => {
      render(<ToggleButton {...defaultProps} />);

      const button1 = screen.getByRole('button', { name: 'オプション1' });
      const button2 = screen.getByRole('button', { name: 'オプション2' });
      const button3 = screen.getByRole('button', { name: 'オプション3' });

      expect(button1).toBeInTheDocument();
      expect(button2).toBeInTheDocument();
      expect(button3).toBeInTheDocument();
    });
  });

  describe('選択状態のスタイル', () => {
    it('選択されたオプションにアクセントカラーが適用される', () => {
      render(<ToggleButton {...defaultProps} value="option2" />);

      const selectedButton = screen.getByRole('button', { name: 'オプション2' });
      expect(selectedButton).toHaveClass('bg-accent');
      expect(selectedButton).toHaveClass('text-primary-bg');
      expect(selectedButton).toHaveClass('shadow-md');
    });

    it('選択されていないオプションに通常スタイルが適用される', () => {
      render(<ToggleButton {...defaultProps} value="option1" />);

      const unselectedButton = screen.getByRole('button', { name: 'オプション2' });
      expect(unselectedButton).toHaveClass('bg-card');
      expect(unselectedButton).toHaveClass('text-gray-300');
      expect(unselectedButton).toHaveClass('hover:bg-card-hover');
    });

    it('選択を変更するとスタイルが正しく更新される', () => {
      const { rerender } = render(<ToggleButton {...defaultProps} value="option1" />);

      let button1 = screen.getByRole('button', { name: 'オプション1' });
      let button2 = screen.getByRole('button', { name: 'オプション2' });

      expect(button1).toHaveClass('bg-accent');
      expect(button2).toHaveClass('bg-card');

      rerender(<ToggleButton {...defaultProps} value="option2" />);

      button1 = screen.getByRole('button', { name: 'オプション1' });
      button2 = screen.getByRole('button', { name: 'オプション2' });

      expect(button1).toHaveClass('bg-card');
      expect(button2).toHaveClass('bg-accent');
    });
  });

  describe('クリックイベント', () => {
    it('ボタンをクリックするとonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} />);

      const button = screen.getByRole('button', { name: 'オプション2' });
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('クリックしたボタンの値でonChangeが呼ばれる', () => {
      const onChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} />);

      const button = screen.getByRole('button', { name: 'オプション2' });
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('各ボタンが正しい値でonChangeを呼ぶ', () => {
      const onChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} />);

      const button1 = screen.getByRole('button', { name: 'オプション1' });
      const button2 = screen.getByRole('button', { name: 'オプション2' });
      const button3 = screen.getByRole('button', { name: 'オプション3' });

      fireEvent.click(button1);
      expect(onChange).toHaveBeenLastCalledWith('option1');

      fireEvent.click(button2);
      expect(onChange).toHaveBeenLastCalledWith('option2');

      fireEvent.click(button3);
      expect(onChange).toHaveBeenLastCalledWith('option3');

      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('同じボタンを複数回クリックできる', () => {
      const onChange = vi.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} />);

      const button = screen.getByRole('button', { name: 'オプション2' });

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('アクセシビリティ', () => {
    it('すべてのボタンがtype="button"を持っている', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('最小タッチターゲットサイズを満たしている', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('min-h-[44px]');
        expect(button).toHaveClass('min-w-[44px]');
      });
    });

    it('トランジション効果が設定されている', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all');
        expect(button).toHaveClass('duration-200');
        expect(button).toHaveClass('ease-in-out');
      });
    });
  });

  describe('2つのオプション', () => {
    const twoOptions = [
      { value: 'ron', label: 'ロン' },
      { value: 'tsumo', label: 'ツモ' },
    ];

    it('2つのオプションが正しく表示される', () => {
      render(
        <ToggleButton
          options={twoOptions}
          value="ron"
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText('ロン')).toBeInTheDocument();
      expect(screen.getByText('ツモ')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('2つのオプション間で切り替えができる', () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          options={twoOptions}
          value="ron"
          onChange={onChange}
        />
      );

      const tsumoButton = screen.getByRole('button', { name: 'ツモ' });
      fireEvent.click(tsumoButton);

      expect(onChange).toHaveBeenCalledWith('tsumo');
    });
  });

  describe('多数のオプション', () => {
    const manyOptions = Array.from({ length: 10 }, (_, i) => ({
      value: `option${i}`,
      label: `オプション${i}`,
    }));

    it('多数のオプションが正しく表示される', () => {
      render(
        <ToggleButton
          options={manyOptions}
          value="option0"
          onChange={vi.fn()}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(10);
    });

    it('多数のオプションでも正しく選択できる', () => {
      const onChange = vi.fn();
      render(
        <ToggleButton
          options={manyOptions}
          value="option0"
          onChange={onChange}
        />
      );

      const button5 = screen.getByRole('button', { name: 'オプション5' });
      fireEvent.click(button5);

      expect(onChange).toHaveBeenCalledWith('option5');
    });
  });

  describe('エッジケース', () => {
    it('空のoptionsでもエラーにならない', () => {
      render(
        <ToggleButton
          options={[]}
          value=""
          onChange={vi.fn()}
        />
      );

      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('単一のオプションでも動作する', () => {
      const onChange = vi.fn();
      const singleOption = [{ value: 'only', label: '唯一のオプション' }];

      render(
        <ToggleButton
          options={singleOption}
          value="only"
          onChange={onChange}
        />
      );

      expect(screen.getByText('唯一のオプション')).toBeInTheDocument();

      const button = screen.getByRole('button', { name: '唯一のオプション' });
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledWith('only');
    });

    it('valueが選択肢に含まれていない場合でもレンダリングされる', () => {
      // 型安全性を保ちながら、存在しない値をテストする
      type TestValue = 'option1' | 'option2' | 'option3';
      const nonexistentValue = 'nonexistent' as unknown as TestValue;

      render(
        <ToggleButton
          {...defaultProps}
          value={nonexistentValue}
        />
      );

      // すべてのボタンが選択されていない状態でレンダリングされる
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('bg-card');
        expect(button).not.toHaveClass('bg-accent');
      });
    });

    it('数値型の値でも動作する', () => {
      const numericOptions = [
        { value: '1', label: '1人' },
        { value: '2', label: '2人' },
        { value: '3', label: '3人' },
      ];

      const onChange = vi.fn();
      render(
        <ToggleButton
          options={numericOptions}
          value="2"
          onChange={onChange}
        />
      );

      const button3 = screen.getByRole('button', { name: '3人' });
      fireEvent.click(button3);

      expect(onChange).toHaveBeenCalledWith('3');
    });

    it('特殊文字を含むラベルも正しく表示される', () => {
      const specialOptions = [
        { value: 'special1', label: '親（オヤ）' },
        { value: 'special2', label: '子（コ）' },
        { value: 'special3', label: '4人/3人' },
      ];

      render(
        <ToggleButton
          options={specialOptions}
          value="special1"
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText('親（オヤ）')).toBeInTheDocument();
      expect(screen.getByText('子（コ）')).toBeInTheDocument();
      expect(screen.getByText('4人/3人')).toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('各ボタンがフレックス成長する', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('flex-1');
      });
    });

    it('ボタンに角丸が適用されている', () => {
      render(<ToggleButton {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('rounded-md');
      });
    });

    it('ラベルのスタイルが正しく適用されている', () => {
      render(<ToggleButton {...defaultProps} label="テストラベル" />);

      const label = screen.getByText('テストラベル');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-gray-300');
      expect(label).toHaveClass('text-center');
    });
  });
});
