
import { useState } from "react";

import { ICONS } from "../../icons";

export function Input({className='', ...props}:any) {
    return (
        <>
            <input className={`text-sm h-10 w-full px-2 py-1.5 md:py-2 border border-muted/15 outline-0 bg-emphasis rounded-lg focus:border-primary/45 ${className}`} {...props} />
        </>
    )
}

export function PasswordInput({ id = 'password', label = 'Password', ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center">
      <Input id={id} type={show ? 'text' : 'password'} placeholder={label} className="pr-10 md:pr-12" {...props} />
      <button type="button" onClick={() => setShow(s => !s)}
        aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute px-1.5 sm:px-2 right-1 sm:right-1.5 border-l border-muted/15"
      >
        {show ? ICONS.eyeSlash({className:'text-muted/75'}) : ICONS.eye({className:'text-muted/75'})}
      </button>
    </div>
  );
}
