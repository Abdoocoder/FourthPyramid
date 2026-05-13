import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const inputBase = "w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-on-surface-variant/60";

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}
      </label>
      <input id={id} className={inputBase} {...props} />
    </div>
  );
}

export function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}
      </label>
      <textarea id={id} className={`${inputBase} resize-y`} rows={5} {...props} />
    </div>
  );
}

export function Select({ label, id, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}
      </label>
      <select id={id} className={`${inputBase} appearance-none cursor-pointer`} {...props}>
        {children}
      </select>
    </div>
  );
}
