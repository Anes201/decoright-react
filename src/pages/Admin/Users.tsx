import UserTable from "@/components/layout/admin/UserTable";



export default function Users () {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full h-full pt-4 md:py-8 mb-40">

                <div className="flex flex-col gap-6 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Users Overview Table </h1>
                    <UserTable />
                </div>

            </section>
        </main>
    )
}




