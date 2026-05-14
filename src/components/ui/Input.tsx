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

const inputBase = "w-full min-h-11 bg-surface-bright border border-outline-variant rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface shadow-[inset_0_1px_0_rgba(26,43,72,0.03)] focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/35 focus:shadow-[inset_0_1px_0_rgba(26,43,72,0.03),0_0_0_4px_rgba(74,144,226,0.06)] transition-[background-color,border-color,box-shadow] duration-200 ease-out-strong placeholder:text-on-surface-variant/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-container-low";

function RequiredMark() {
  return <span aria-hidden="true" className="text-error ms-0.5">*</span>;
}

export function Input({ label, id, required, ...props }: InputProps) {
  return (
    <div className="input-group flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold transition-colors">
        {label}{required && <RequiredMark />}
      </label>
      <input id={id} className={inputBase} required={required} {...props} />
    </div>
  );
}

export function Textarea({ label, id, required, ...props }: TextareaProps) {
  return (
    <div className="input-group flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold transition-colors">
        {label}{required && <RequiredMark />}
      </label>
      <textarea id={id} className={`${inputBase} resize-y`} rows={5} required={required} {...props} />
    </div>
  );
}

export function Select({ label, id, required, children, ...props }: SelectProps) {
  return (
    <div className="input-group flex flex-col gap-2">
      <label htmlFor={id} className="font-body-sm text-body-sm text-on-surface font-semibold transition-colors">
        {label}{required && <RequiredMark />}
      </label>
      <div className="relative">
        <select id={id} className={`${inputBase} appearance-none cursor-pointer pe-10`} required={required} {...props}>
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center select-chevron">
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </div>
      </div>
    </div>
  );
}
