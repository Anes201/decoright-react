import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PButton } from './Button';
import { SCTALink } from './CTA';
import { Input } from './Input';
import Spinner from '@/components/common/Spinner';
import { ICONS } from '@/icons';

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

    if (!isOpen) return null;

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
                body: { phone },
            });

            if (fnError || data.error) throw new Error(fnError?.message || data.error || 'Failed to send OTP');

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

            if (fnError || data.error) throw new Error(fnError?.message || data.error || 'Invalid code');

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-muted/15 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Phone Verification</h2>
                        <p className="text-xs text-muted mt-1">
                            {step === 'phone'
                                ? 'Enter your phone number to receive a verification code.'
                                : `Enter the code we sent to ${phone}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted/10 rounded-lg transition-colors">
                        <ICONS.xMark className="size-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-center">
                        <ICONS.exclamationTriangle className="size-4 text-danger shrink-0" />
                        <p className="text-xs text-danger font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-6">
                    {step === 'phone' ? (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted px-1">Phone Number (with country code)</label>
                            <Input
                                placeholder="+213..."
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted px-1">Verification Code</label>
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
                                Change phone number
                            </button>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <PButton type="submit" className="flex-1" disabled={loading}>
                            <Spinner status={loading}>
                                {step === 'phone' ? 'Send Code' : 'Verify Code'}
                            </Spinner>
                        </PButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
