'use client';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  quickButtons?: number[];
  selectOptions?: number[];
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  quickButtons,
  selectOptions,
}: NumberInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>

      {selectOptions ? (
        // セレクトボックス（符用）
        <select
          value={value}
          onChange={handleSelectChange}
          className="
            px-3 py-2 text-sm font-medium rounded-md
            bg-card text-white border-none
            min-h-[44px] appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-accent
          "
        >
          {selectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        // 通常の数値入力（本場用）
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="
            px-3 py-2 text-sm font-medium rounded-md
            bg-card text-white border-none
            min-h-[44px] w-full
            focus:outline-none focus:ring-2 focus:ring-accent
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />
      )}

      {/* クイックボタン（飜用） */}
      {quickButtons && (
        <div className="flex gap-1 mt-1">
          {quickButtons.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => { onChange(num); }}
              className={`
                flex-1 px-2 py-1.5 text-xs font-medium rounded
                transition-all duration-200 ease-in-out
                min-h-[36px]
                ${
                  value === num
                    ? 'bg-accent text-primary-bg'
                    : 'bg-card text-gray-300 hover:bg-card-hover'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
