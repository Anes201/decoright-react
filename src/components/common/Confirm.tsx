
import React, { useState } from "react";
import useConfirm from "@components/confirm/useConfirm";
import { PATHS } from "@/routers/Paths";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Spinner from "./Spinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

export function LogoutButton({ children, ...props }: Props) {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;

    const ok = await confirm({
      title: "Sign me out",
      description: "Are you sure you want to log out of your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
      variant: "default",
    });

    if (!ok) return;

    setPending(true);
    try {
      // best-effort: sign out via Supabase if available
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // non-fatal — still navigate to login
        console.warn("supabase.signOut() failed:", err);
      }

      // navigate within app (no full reload)
      navigate(PATHS.LOGIN);
    } catch (err) {
      console.error("logout failed", err);
      // TODO: show user-facing toast
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={pending || props.disabled} aria-busy={pending}
      {...props}
    >
      <Spinner status={pending} size="sm" > {children ?? "Logout"} </Spinner>
    </button>
  );
}

export function VerifyPhone({ children, ...props }: Props) {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;

    const ok = await confirm({
      title: "Sign me out",
      description: "Are you sure you want to log out of your account?",
      confirmText: "Logout",
      cancelText: "Cancel",
      variant: "default",
    });

    if (!ok) return;

    setPending(true);
    try {
      // best-effort: sign out via Supabase if available
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // non-fatal — still navigate to login
        console.warn("supabase.signOut() failed:", err);
      }

      // navigate within app (no full reload)
      navigate(PATHS.LOGIN);
    } catch (err) {
      console.error("logout failed", err);
      // TODO: show user-facing toast
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={pending || props.disabled} aria-busy={pending}
      {...props}
    >
      <Spinner status={pending} size="sm" > {children ?? "Logout"} </Spinner>
    </button>
  );
}