

import { Link } from "react-router-dom"
import { orders } from "../../constants"

export function CustomerOrderItem ({order}:any){
    return (
        <tr role="row" data-order-id={order.id} className="p-4 bg-surface rounded-lg">
            <td role="cell">#{order.id}</td>
            <td role="cell">{ order.projectType }</td>
            <td role="cell"><time>{ order.date }</time></td>
            <td role="cell" data-status={order.status}>{order.status}</td>
            <td role="cell">
                <Link to={order.url} data-action="view-details" data-order-id={order.id}>View</Link>
            </td>
        </tr>
    )
}

export function CustomerOrderList(){
    return (
        <table id="orders-table" role="table" aria-label="Your orders"
        className="w-full">
            <thead>
                <tr role="row" className="">
                    <th role="columnheader" scope="col" data-sort-key="number" aria-sort="none">Order ID</th>
                    <th role="columnheader" scope="col" data-sort-key="type" aria-sort="none">Project Type</th>
                    <th role="columnheader" scope="col" data-sort-key="createdAt" aria-sort="none">Date</th>
                    <th role="columnheader" scope="col" data-sort-key="status" aria-sort="none">Status</th>
                </tr>
            </thead>


            <tbody>
                {orders.map((order) => (
                    <CustomerOrderItem order={order} />
                ))}
            </tbody>
        </table>
    )
}

export function CustomerOrders(){
    return (
        <section className=" content-container relative flex flex-col items-center gap-80 w-full my-18 ">
            <div className="flex flex-col gap-2 w-full">
                <h2 className="font-semibold text-lg sm:text-xl md:text-2xl"> My Orders  </h2>
                <p className="text-xs md:text-sm text-muted">Recent purchases and current order status.</p>
            </div>

            <div className="relative w-full h-full p-2 sm:p-4">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 -z-10 mask-b-to-transparent"></div>

                <CustomerOrderList/>
            </div>
        </section>
    )
}