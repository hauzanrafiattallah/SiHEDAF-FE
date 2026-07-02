import { useId, useState } from "react";

type AuthInputProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  value: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function AuthInput({
  label,
  name,
  placeholder,
  type = "text",
  value,
  autoComplete,
  required = true,
  onChange,
}: AuthInputProps) {
  const inputId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        className="mb-2 block text-[11px] font-semibold tracking-[-0.02em] text-primary-900"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className="h-12 w-full rounded-full border border-primary-900/10 bg-white px-5 pr-12 text-[11px] font-medium text-primary-900 outline-none transition-colors placeholder:text-primary-900/24 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
          id={inputId}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          type={inputType}
          value={value}
        />
        {isPassword ? (
          <button
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute top-1/2 right-4 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
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
    </div>
  );
}
