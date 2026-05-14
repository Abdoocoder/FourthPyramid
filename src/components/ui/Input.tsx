import { ChevronDown } from "lucide-react";
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

const inputBase = "w-full bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary transition-colors placeholder:text-on-surface-variant/60 disabled:opacity-50 disabled:cursor-not-allowed";

function RequiredMark() {
  return <span aria-hidden="true" className="text-error ml-0.5">*</span>;
}

export function Input({ label, id, required, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}{required && <RequiredMark />}
      </label>
      <input id={id} className={inputBase} required={required} {...props} />
    </div>
  );
}

export function Textarea({ label, id, required, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}{required && <RequiredMark />}
      </label>
      <textarea id={id} className={`${inputBase} resize-y`} rows={5} required={required} {...props} />
    </div>
  );
}

export function Select({ label, id, required, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold">
        {label}{required && <RequiredMark />}
      </label>
      <div className="relative">
        <select id={id} className={`${inputBase} appearance-none cursor-pointer pr-10`} required={required} {...props}>
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center select-chevron">
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </div>
      </div>
    </div>
  );
}
