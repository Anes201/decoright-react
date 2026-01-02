
import { ICONS } from '../../icons';
import { categories } from "../../constants"
import { SectionHeader } from '../ui/SectionHeader';
import { PCTALink, SCTALink } from '../ui/CTA';


export function CategoryChecklist ({ category }: { category: any }) {
    return (

        <ul className='flex flex-col gap-2 w-full'>
            {category.checklist && category.checklist.length > 0 && (
                category.checklist.map((item: string, itemIndex: number) => {
                    const CheckIcon = ICONS.check;
                    return (
                        <li key={itemIndex} className='flex items-center gap-2'>
                            <CheckIcon className={` ${category.primaryDisplay ? 'size-4' : 'size-3'}  text-primary`} />
                            <span className={`${category.primaryDisplay ? 'text-2xs md:text-xs' : 'text-3xs md:text-2xs'}  text-muted`}> {item} </span>
                        </li>
                    )
                })
            )}
        </ul>

    )
}

export function CategoryItem ({ category, index }: { category: any, index: number }) {
    return (

        <>

            {category.primaryDisplay ?

                <li key={index} className='relative primary-category-card flex flex-col gap-2 w-full h-full rounded-2xl cursor-pointer'>
                    {/* <div className='primary-category-card absolute top-0 left-0 w-full h-full border hover:bg-primary/10 rounded-2xl -z-10 mask-b-to-transparent mask-b-to-100%'></div> */}
                    <div className="flex flex-col gap-2">

                        <div className='flex gap-2 w-full'>

                            <div className='flex flex-col gap-3 w-full'>
                                {/* <span className='font-medium text-xs text-primary min-w-max w-fit px-2 py-0.5 bg-primary/15 rounded-full'> Best sales </span> */}
                                <h3 className='font-medium text-xl'> {category.label} </h3>
                            </div>
                            {/* Rating Icon */}
                            <div className='flex content-center gap-1 min-w-max w-fit h-fit'>
                                <ICONS.star className='size-4 text-primary/75'/>
                                <span className='text-2xs md:text-xs text-muted'> 4.9 (120 reviews) </span>
                            </div>
                        </div>

                        <p className='text-2xs md:text-xs text-muted'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur unde excepturi accusamus consequatur? Consequuntur odio similique ratione qui laudantium! Quos atque distinctio, magnam cum labore laboriosam ad obcaecati provident laborum! </p>

                    </div>

                    <div className='flex flex-col sm:flex-row gap-8 md:gap-4 mt-4'>

                        {/* Details & Checklist */}
                        <div className='flex flex-col gap-6 md:gap-8 w-full'>

                            {/* Contents Checklist */}
                            <div>
                                <h4 className='font-semibold text-sm mb-2'> What we offer </h4>
                                <CategoryChecklist category={category} />
                            </div>

                            {/* CTA */}
                            <div className='flex max-sm:flex-col gap-4'>

                                <PCTALink to={'/contact'} className='flex items-center justify-center text-xs bg-primary'> Contact Us </PCTALink>

                                <SCTALink to={'/projects'} className='flex items-center justify-center gap-1 text-xs'> {category.label} Projects {ICONS.chevronRight({className:'size-3'})} </SCTALink>
                            </div>

                        </div>

                        <div className='flex w-full'>
                            <img src={category.images[0]}  className="aspect-4/2 object-cover w-full h-full rounded-lg"/>
                        </div>

                        {/* Images Display Grid
                        <div className='grid grid-cols-2 gap-2'>
                            {category.images && category.images.length > 0 && (
                                category.images.map((imgSrc: string, imgIndex: number) => (
                                    <img key={imgIndex} src={imgSrc} alt={`${category.label} ${imgIndex + 1}`} className="aspect-square object-cover w-full h-full rounded-lg"/>
                                ))
                            )}
                        </div> */}

                    </div>

                </li>

            :

                <li key={index} className='regular-category-card relative flex flex-col gap-2 w-full h-full rounded-2xl cursor-pointer'>
                    <div className="flex flex-col gap-2">

                        <div className='flex gap-2 w-full'>

                            <div className='flex flex-col gap-3 w-full'>
                                {/* <span className='font-medium text-xs text-primary min-w-max w-fit px-2 py-0.5 bg-primary/15 rounded-full'> Best sales </span> */}
                                <h3 className='font-medium text-sm'> {category.label} </h3>
                            </div>
                            {/* Rating Icon */}
                            <div className='flex content-center gap-1 min-w-max w-fit h-fit'>
                                <ICONS.star className='size-4 text-primary/75'/>
                                <span className='text-2xs md:text-xs text-muted'> 4.2 </span>
                            </div>
                        </div>

                        <p className='text-3xs md:text-2xs text-ellipsis-2line text-muted'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur unde excepturi accusamus consequatur? Consequuntur odio similique ratione qui laudantium! Quos atque distinctio, magnam cum labore laboriosam ad obcaecati provident laborum! </p>

                    </div>

                    {/* Offers & CheckList */}
                    <div>
                        <CategoryChecklist category={category} />
                    </div>
                </li>
            }
        </>

    )
}

export function CategoryList () {
    return (
        <ul className="grid justify-items-center md:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] grid-rows-[repeat(auto-fit,minmax(12rem,1fr))] auto-rows-fr gap-6 w-full h-full">
            {categories.map((category, index) => (
                <CategoryItem key={index} category={category} index={index} />
            ))}
        </ul>
    )
}

export function CategoriesHero () {
    return (

        <section className="content-container flex flex-col gap-8 w-full my-16 px-3 sm:px-6 md:px-8">
            {/* Section Header */}

            <SectionHeader
                title="Explore projects by category"
                desc="Discover our diverse portfolio of interior design projects across various categories, each tailored to meet unique styles and needs."
            />

            <CategoryList/>

        </section>
    )
}