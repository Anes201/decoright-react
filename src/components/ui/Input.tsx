
import { useLayoutEffect, useRef, useState } from "react";

import { ICONS } from "@/icons";
import { useTranslation } from "react-i18next";

export function Input({ className, children, ...props }: any) {

  return (

    <div dir={ props.dir } className="relative flex flex-col gap-1 w-full">
      <div className="relative flex items-center">
        <input dir={ props.dir }
          className={`content-center text-sm h-12 w-full px-2 py-1.5 md:py-2 border border-muted/15
          ${props.readOnly && 'ltr:pr-8 ltr:sm:pr-10 rtl:pl-8 rtl:sm:pl-10'}
          ${props.value && props.error ? 'outline-danger/45' : 'outline-muted/15'}
          bg-emphasis/75 rounded-lg outline-0 focus:outline-1 placeholder:max-md:text-sm
          border ${props.error ? 'border-danger/45' : 'border-muted/15'}
          ${className}`}

          {...props} />
          {children}
      </div>
      {props.readOnly &&
        <span title="Locked for viewing only" aria-label="error" className="absolute content-center end-2 h-full">
          <ICONS.lockClosed className="size-5 text-muted" />
        </span>}

      {props.error && <p title={props.error} aria-label="error" className="text-xs text-danger/75 px-0.5"> {props.error} </p>}
    </div>
  )
}

export function EmailInput({ id = 'email_field', label, className, ...props }: any) {
  const { t } = useTranslation();
  // const displayLabel = label || t('auth.email');
  return (
    <Input id={id} type="email" placeholder={t('auth.placeholders.email')} className={`${className} text-left ltr:pl-8 ltr:sm:pl-10 rtl:pr-8 rtl:sm:pr-10`} {...props}>
      {/* Email Icon Placeholder */}
      <span className="absolute px-1.5 start-1 sm:start-1.5"> <ICONS.envelope className="size-5 text-muted/75"/> </span>
    </Input>
  );
}

export function PhoneInput({ id = 'phone_field', label, className, ...props }: any) {
  // const displayLabel = label || t('auth.phone');
  return (
    <Input id={id} type="tel" placeholder="+213 123456789" className={`${className} ltr:pl-8 ltr:sm:pl-10 rtl:pr-8 rtl:sm:pr-10 lang-ar:placeholder:text-left`} {...props}>
      {/* Password Icon Placeholder */}
      <span className="absolute px-1.5 start-1 sm:start-1.5"> <ICONS.phone className="size-5 text-muted/75"/> </span>
      {/* ltr:left-1 ltr:sm:left-1.5 rtl:right-1 rtl:sm:right-1.5 */}
    </Input>
  );
}

export function PasswordInput({ id = 'password_field', label, value, onChange, error, ...props }: any) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const displayLabel = label || t('auth.password');

  return (
    <Input
      id={id}
      type={show ? 'text' : 'password'}
      placeholder={displayLabel}
      className="px-9 sm:px-10 ltr:md:pr-12 rtl:md:pl-12"
      error={error}
      value={value}
      onChange={onChange}
      {...props}
    >
      {/* Password Icon Placeholder */}
      <span className="absolute px-2 start-1 sm:start-1.5"> <ICONS.key className="size-5 text-muted/75"/> </span>

      {/* Show/Hide Icon Placeholder */}
      <button type="button" onClick={() => setShow(s => !s)}
        aria-pressed={show} aria-label={show ? t('auth.hide_password') : t('auth.show_password')}
        className="absolute w-fit px-2 end-1 sm:end-1.5 border-s border-muted/15"
      >
        {!show ? <ICONS.eyeSlash className='size-5 text-muted/75' /> : <ICONS.eye className='size-5 text-muted/75' />}
      </button>
    </Input>
  );
}

export function EmailOrPhoneInput({ id = 'email_or_phone_field', label = 'Email Or Phone', value = '', onChange, error, ...props }: any) {
  const { t } = useTranslation();
  const getIcon = (val: string) => {
    // Simple check for numbers or a '+' at the start for Phone
    const phonePattern = /^\+?[0-9]*$/;
    // Basic check for '@' for Email
    const isEmail = val.includes('@');
    const iconProps = { className: 'size-5 text-muted/75' };

    if (isEmail) return ICONS.envelope(iconProps);
    if (val.length > 0 && phonePattern.test(val)) return ICONS.phone(iconProps);
    return ICONS.user(iconProps);
  }

  return (
    <Input id={id} type="text" placeholder={ t('auth.placeholders.email_or_phone') } value={value} onChange={onChange} className="px-9 sm:px-10 md:pr-12" error={error} {...props}>
      <span className="absolute px-2 ltr:left-1 ltr:sm:left-1.5 rtl:right-1 rtl:sm:right-1.5"> {getIcon(value)} </span>
    </Input>
  );
};

export function TextArea({ ...props }: any) {
  return (
    <>
      <textarea
        dir="auto"
        className={
          `w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1
        hover:outline-muted/25 focus:outline-muted/45
        ${props.error ? 'outline-danger/45' : 'outline-muted/15'}
        ${props.className}`
        }

        {...props}
      />
      {props.error && <p className="text-xs text-danger">{props.error}</p>}
    </>
  )
}

// Unused AutoResizeTextareaProps removed to clear lint error

export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  minRows = 1,
  maxRows = 5,
  ...props
}: any) {
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
      {...props}
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
