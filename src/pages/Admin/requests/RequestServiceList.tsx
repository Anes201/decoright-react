
import RequestServiceTable from "@components/layout/admin/RequestServiceTable";

export default function Users () {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full h-full md:py-8 mb-40">

                <div className="flex flex-col gap-4 h-full">
                    <h1 className="font-semibold text-lg md:text-2xl mb-6"> Service Requests Table </h1>
                    <RequestServiceTable />
                </div>

            </section>
        </main>
    )
}