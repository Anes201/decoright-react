
import { Link } from "react-router-dom";


export function CTALink({to, children, className, ...props}:any) {
    return (
        <Link to={to} className={`font-semibold text-sm text-center min-w-max px-2 md:px-3 py-1.5 rounded-xl  ${className}`} {...props}> {children} </Link>
    )
}

// Primary CTA Link (Primary-CTA-Link)
export function PCTALink({to, children, className, ...props}:any){
    return (
        <CTALink to={to} className={`text-white/96 bg-primary ${className}`} {...props}>{children}</CTALink>
    )
}

// Secondary CTA Link (Secondary-CTA-Link)
export function SCTALink({to, children, className, ...props}:any){
    return (
        <CTALink to={to} className={`text-foreground bg-muted/10 border border-muted/15 ${className}`} {...props}>{children}</CTALink>
    )
}