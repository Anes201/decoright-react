import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PButton } from './Button';
import { Input, PhoneInput } from '@components/ui/Input';
import Spinner from '@/components/common/Spinner';
import { ICONS } from '@/icons';
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';

interface PhoneVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PhoneVerificationModal({ isOpen, onClose, onSuccess }: PhoneVerificationModalProps) {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
                body: { phone },
            });

            if (fnError || data.error) throw new Error(fnError?.message || data.error || t('phone_verification.error_send'));

            setStep('code');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('verify-otp', {
                body: { phone, code },
            });

            if (fnError || data.error) throw new Error(fnError?.message || data.error);

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
            console.log(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-muted/15 rounded-3xl p-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">{t('phone_verification.title')}</h2>
                        <p className="text-xs text-muted mt-1">
                            {step === 'phone'
                                ? t('phone_verification.description_phone')
                                : t('phone_verification.description_code', { phone })}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 hover:bg-muted/10 rounded-lg transition-colors">
                        <ICONS.xMark className="size-5" />
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-warning/10 border border-warning/20 rounded-xl">
                        <ICONS.exclamationTriangle className="size-4 text-warning shrink-0" />
                        <p className="text-xs text-warning font-medium"> {t('phone_verification.error_verify')} ({error}) </p>
                    </div>
                )}

                <form className="space-y-6">
                    {step === 'phone' ? (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted px-1">{t('phone_verification.phone_label')}</label>
                            <PhoneInput
                                dir="ltr"
                                placeholder="+213 123456789"
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted px-1">{t('phone_verification.code_label')}</label>
                            <Input
                                placeholder="123456"
                                value={code}
                                onChange={(e: any) => setCode(e.target.value)}
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="text-xs text-primary hover:underline px-1"
                            >
                                {t('phone_verification.change_phone')}
                            </button>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <PButton type="button" onClick={step === 'phone' ? handleSendOTP : handleVerifyOTP} className="flex-1" disabled={loading}>
                            <Spinner status={loading} size="sm">
                                {step === 'phone' ? t('phone_verification.send_code') : t('phone_verification.verify_code')}
                            </Spinner>
                        </PButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
