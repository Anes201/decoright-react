
import React, { useLayoutEffect, useRef, useState } from "react";

import { ICONS } from "../../icons";

export function Input({ className, children, ...props }: any) {
  return (
    <div className="relative flex flex-col mb-2 w-full">
      <div className="relative flex items-center">
        <input className={`${className} text-sm h-10 w-full px-2 py-1.5 md:py-2 border border-muted/15 ${props.value && props.error ? 'outline-danger/45' : 'outline-muted/15'} bg-emphasis rounded-lg outline-0  focus:outline-1 `} {...props} />
        {children}
      </div>
      {props.value && props.error && <span title={props.error} aria-label="error" className="absolute flex items-center top-full text-xs text-danger/75 px-0.5"> {props.error} </span>}
    </div>
  )
}

export function EmailInput({ id = 'email_field', label = 'Email', className, ...props }: any) {
  return (
    <Input id={id} type={'email'} placeholder="email@example.com" className={`${className} px-9 sm:px-10 md:pr-12`} {...props}>
      {/* Password Icon Placeholder */}
      <span className="absolute px-2 left-1 sm:left-1.5"> {ICONS.envelope({ className: 'size-4 text-muted/75' })} </span>
    </Input>
  );
}

export function PhoneInput({ id = 'phone_field', label = 'Phone', className, ...props }: any) {
  return (
    <Input id={id} type={'tel'} placeholder="Phone Number" className={`${className} px-9 sm:px-10 md:pr-12`} {...props}>
      {/* Password Icon Placeholder */}
      <span className="absolute px-2 left-1 sm:left-1.5"> {ICONS.phone({ className: 'size-4 text-muted/75' })} </span>
    </Input>
  );
}

export function PasswordInput({ id = 'password_field', label = 'Password', value, onChange, error, ...props }: any) {
  const [show, setShow] = useState(false);

  return (
    <Input
      id={id}
      type={show ? 'text' : 'password'}
      placeholder={label}
      className="px-9 sm:px-10 md:pr-12"
      error={error}
      value={value}
      onChange={onChange}
      {...props}
    >
      {/* Password Icon Placeholder */}
      <span className="absolute px-2 left-1 sm:left-1.5"> {ICONS.key({ className: 'size-4 text-muted/75' })} </span>

      {/* Show/Hide Icon Placeholder */}
      <button type="button" onClick={() => setShow(s => !s)}
        aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute px-2 right-1 sm:right-1.5 border-l border-muted/15"
      >
        {show ? ICONS.eyeSlash({ className: 'size-5 text-muted/75' }) : ICONS.eye({ className: 'size-5 text-muted/75' })}
      </button>
    </Input>
  );
}

export function EmailOrPhoneInput({ id = 'email_or_phone_field', label = 'Email Or Phone', value = '', onChange, error, ...props }: any) {
  const getIcon = (val: string) => {
    // Simple check for numbers or a '+' at the start for Phone
    const phonePattern = /^\+?[0-9]*$/;
    // Basic check for '@' for Email
    const isEmail = val.includes('@');
    const iconProps = { className: 'size-4 text-muted/75' };

    if (isEmail) return ICONS.envelope(iconProps);
    if (val.length > 0 && phonePattern.test(val)) return ICONS.phone(iconProps);
    return ICONS.user(iconProps);
  }

  return (
    <Input id={id} type="text" placeholder="Enter email or phone" value={value} onChange={onChange} className="px-9 sm:px-10 md:pr-12" error={error} {...props}>
      <span className="absolute px-2 left-1 sm:left-1.5"> {getIcon(value)} </span>
    </Input>
  );
};

type AutoResizeTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  minRows?: number; // default 1
  maxRows?: number; // default 5
  // optional: pass other textarea props via ...rest if you want
};

export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  minRows = 1,
  maxRows = 5,
}: AutoResizeTextareaProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Resize function: set height based on scrollHeight but cap to maxRows
  const resize = () => {
    const ta = taRef.current;
    if (!ta) return;

    // reset height so scrollHeight is correct for current content
    ta.style.height = "auto";

    // try to read computed line-height, fallback to 20px if not available
    const cs = getComputedStyle(ta);
    let lineHeight = parseFloat(cs.lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight === 0) lineHeight = 20;

    // compute max height allowed
    const maxHeight = lineHeight * maxRows;

    // determine new height (scrollHeight includes padding)
    const newHeight = Math.min(ta.scrollHeight, maxHeight);

    ta.style.height = `${newHeight}px`;
    // show vertical scroll only if content exceeds max height
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  // Resize on mount and whenever value changes
  useLayoutEffect(() => {
    resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, maxRows]);

  return (
    <textarea
      ref={taRef}
      rows={minRows} // initial visible rows
      value={value}
      onChange={onChange}
      onInput={resize} // safe to call again while typing
      placeholder={placeholder}
      className={className}
      aria-label={placeholder ?? "input"}
    />
  );
}

export function DateInput({ ...props }) {
  // Function to get today's date in 'YYYY-MM-DD' format
  const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA');
  };

  return (
    <input type="date" defaultValue={getTodayDateString()} {...props} />
  )
}
