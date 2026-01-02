
export function HeroSection({children}:any) {

    return (
        <section className="h-hero min-h-hero content-container relative flex items-center w-full mb-8">

            {/* <div className="bg-linear-10 from-transparent via-primary/15 to-surface/45"></div> */}

            {/* <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] bg-primary/10 rounded-4xl mask-l-to-transparent mask-l-to-10% overflow-hidden"></div> */}
            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-10% overflow-hidden"></div>

            {/* <div className="relative flex w-full h-full max-md:border md:border-s md:border-y border-muted/25 rounded-4xl"> {children} </div> */}
            <div className="relative flex w-full h-full rounded-4xl"> {children} </div>

            {/* <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] bg-primary/10 rounded-4xl mask-r-to-transparent mask-r-to-10% overflow-hidden"></div> */}
            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-10% overflow-hidden"></div>

        </section>
    )
}