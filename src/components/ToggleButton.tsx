"use client";

import type { ToggleButtonProps } from "@/types";

/**
 * 複数の選択肢から1つを選ぶトグルボタンコンポーネント
 *
 * @remarks
 * ゲームモード（4人/3人麻雀）、プレイヤータイプ（親/子）、和了種別（ロン/ツモ）の選択に使用します。
 * ジェネリック型パラメータ `T` により、値の型安全性を確保しています。
 *
 * @template T - 選択肢の値の型（string型を継承）
 * @param props - コンポーネントのプロパティ
 * @param props.options - 選択肢の配列
 * @param props.value - 現在選択されている値
 * @param props.onChange - 値変更時のコールバック関数
 * @param props.label - ボタングループのラベル（オプション）
 */
export function ToggleButton<T extends string>({
  options,
  value,
  onChange,
  label,
}: ToggleButtonProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label != null && label !== "" ? (
        <span className="text-sm font-medium text-gray-300 text-center">
          {label}
        </span>
      ) : null}
      <div className="flex gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => {
              onChange(option.value);
            }}
            className={`
              flex-1 px-3 py-2 text-base font-medium rounded-md
              transition-all duration-200 ease-in-out
              min-h-[44px] min-w-[44px]
              ${
                value === option.value
                  ? "bg-accent text-primary-bg shadow-md"
                  : "bg-card text-gray-300 hover:bg-card-hover"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
