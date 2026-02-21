import Spinner from "../common/Spinner";

export function Button({ type, children, className, loading, disabled, ...props }: any) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`flex items-center justify-center gap-2 font-semibold text-sm text-center min-w-max px-3 py-2 rounded-lg disabled:cursor-not-allowed transition-all active:scale-[0.98] ${className}`}
            {...props}
        >
            <Spinner status={loading} size="sm" className="!bg-transparent">
                {children}
            </Spinner>
        </button>
    )
}

// Primary CTA Link (Primary-CTA-Link)
export function PButton({ type, children, className, loading, ...props }: any) {
    return (
        <Button type={type} loading={loading} className={`text-white bg-primary disabled:bg-primary/15 ${className}`} {...props}>
            {children}
        </Button>
    )
}

// Secondary CTA Link (Secondary-CTA-Link)
export function SButton({ type, children, className, ...props }: any) {
    return (
        <Button type={type} className={`text-foreground bg-emphasis/75 border border-emphasis ${className}`} {...props}>{children}</Button>
    )
}