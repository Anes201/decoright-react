
export function Button({type, children, className, ...props}:any) {
    return (
        <button type={type} className={`font-semibold text-sm text-center min-w-max px-3 py-2 rounded-lg ${className}`} {...props}> {children} </button>
    )
}

// Primary CTA Link (Primary-CTA-Link)
export function PButton({type, children, className, ...props}:any){
    return (
        <Button type={type} className={`text-white bg-primary disabled:bg-primary/15 ${className}`} {...props}>{children}</Button>
    )
}

// Secondary CTA Link (Secondary-CTA-Link)
export function SButton({type, children, className, ...props}:any){
    return (
        <Button type={type} className={`text-foreground bg-emphasis/75 border border-emphasis ${className}`} {...props}>{children}</Button>
    )
}