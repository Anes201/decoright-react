
import { Link } from "react-router-dom";


export function CTALink({to, children, className, ...props}:any) {
    return (
        <Link to={to} className={`font-semibold text-sm text-center min-w-max px-3 py-2 rounded-lg shadow-xs ${className}`} {...props}> {children} </Link>
    )
}

// Primary CTA Link (Primary-CTA-Link)
export function PCTALink({to, children, className, ...props}:any){
    return (
        <CTALink to={to} className={`text-white bg-primary ${className}`} {...props}>{children}</CTALink>
    )
}

// Secondary CTA Link (Secondary-CTA-Link)
export function SCTALink({to, children, className, ...props}:any){
    return (
        <CTALink to={to} className={`text-foreground bg-emphasis/75 border border-emphasis ${className}`} {...props}>{children}</CTALink>
    )
}