import UserTable from "@/components/layout/admin/UserTable";



export default function Users () {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full h-full">

                <div className="flex flex-col gap-4 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> Users Overview Table </h1>
                    <UserTable />
                </div>

            </section>
        </main>
    )
}




