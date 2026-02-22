import UserTable from "@/components/layout/admin/UserTable";



export default function Users () {
    return (
        <main>
            <section className="relative flex flex-col w-full h-full py-6 mb-10">

                <div className="flex flex-col gap-4 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl mb-6"> Users Overview Table </h1>
                    <UserTable />
                </div>

            </section>
        </main>
    )
}




