import { type Ref, type ClipboardEvent, useId, useState } from "react";

type AuthInputProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  value: string;
  autoComplete?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  required?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
};

export function AuthInput({
  label,
  name,
  placeholder,
  type = "text",
  value,
  autoComplete,
  error,
  inputRef,
  required = true,
  onBlur,
  onChange,
  onPaste,
}: AuthInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        className="mb-2.5 block text-[13px] font-semibold tracking-[-0.02em] text-primary-900"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className="relative">
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`h-14 w-full rounded-full border bg-white px-6 pr-13 text-[14px] font-medium text-primary-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-primary-900/24 focus:ring-4 ${
            error
              ? "border-[#FF4572] focus:border-[#FF4572] focus:ring-[#FFE8EE]"
              : "border-primary-900/10 focus:border-primary-300 focus:ring-primary-100/70"
          }`}
          id={inputId}
          name={name}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          onPaste={onPaste}
          placeholder={placeholder}
          ref={inputRef}
          required={required}
          type={inputType}
          value={value}
        />
        {isPassword ? (
          <button
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute top-1/2 right-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-primary-300 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
              <path
                d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.35"
              />
              <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.35" />
            </svg>
          </button>
        ) : null}
      </div>
      {error ? (
        <p
          className="mt-2 px-4 text-[12px] font-medium text-[#FF4572]"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
