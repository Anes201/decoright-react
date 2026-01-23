import Table from "@/components/ui/DataTable";
import { PATHS } from "@/routers/Paths";
import { Link } from "react-router-dom";

const columns = [
    { key: 'id', title: 'ID', searchable: true, render:(row:any)=> (
        <Link to={PATHS.ADMIN.requestService(row.id)} className="font-medium hover:underline">
            {row.id}
        </Link>
    ) },
    { key: 'full_name', title: 'Client', searchable: true },
    { key: 'serviceType', title: 'Service Type' },
    { key: 'spaceType', title: 'Space Type' },
    { key: 'status_label', title: 'Status', render: (row:any) => (
        <span className={`px-2 py-1 text-xs font-medium min-w-max whitespace-nowrap rounded-full request-status-${row.status}`}>
            {row.status_label}
        </span>
    )},
    { key: 'areaSqm', title: 'Total Area', render: (row:any) => (<span className="font-medium"> {row.areaSqm} m² </span> )},
    { key: 'date', title: 'Date Requested' },
];

const data = [
    { id: '#REQ-5948', full_name: 'Sunny Humphrey', status_label: 'Pending', status: 'pending', date: '6 hours ago', serviceType: 'Project Management', spaceType: 'Shops', areaSqm:'22', chatId: '123'},
    { id: '#REQ-5949', full_name: 'John Doe', status_label:'In Progress', status: 'in_progress', date: '2 hours ago', serviceType: 'Restructuring Redesign', spaceType: 'Children\'s rooms', areaSqm:'74', chatId: '124'},
    { id: '#REQ-5945', full_name: 'Roland Johnson', status_label:'Completed', status: 'completed', date: '6 hours ago', serviceType: 'Color Consultation', spaceType: 'Cafes and small businesses', areaSqm:'89', chatId: '123'},
    { id: '#REQ-5149', full_name: 'Gavin Pace', status_label:'Rejected', status: 'rejected', date: '12 hours ago', serviceType: 'Exterior Design', spaceType: 'Clinics', areaSqm:'30', chatId: '124'},
    { id: '#REQ-5968', full_name: 'Charles Bonilla', status_label:'Pending', status: 'pending', date: '2 days ago', serviceType: 'Space Planning', spaceType: 'Offices', areaSqm:'16', chatId: '123'},
    { id: '#REQ-1949', full_name: 'Damari Marin', status_label:'In Progress', status: 'in_progress', date: '4 minutes ago', serviceType: 'Restructuring Redesign', spaceType: 'Private schools and nurseries', areaSqm:'30', chatId: '124'},
    { id: '#REQ-4948', full_name: 'Ellis Conner', status_label:'Completed', status: 'completed', date: '1 week ago', serviceType: 'Project Management', spaceType: 'Shops', areaSqm:'20', chatId: '123'},
    { id: '#REQ-9149', full_name: 'Kian Tate', status_label:'Rejected', status: 'rejected', date: '2 hours ago', serviceType: 'Restructuring Redesign', spaceType: 'Children\'s rooms', areaSqm:'30', chatId: '124'},
    { id: '#REQ-1148', full_name: 'Rylan Dyer', status_label:'Pending', status: 'pending', date: '6 hours ago', serviceType: 'Project Management', spaceType: 'Shops', areaSqm:'41', chatId: '123'},
    { id: '#REQ-4449', full_name: 'Alfredo Bryan', status_label:'Pending', status: 'pending', date: '2 hours ago', serviceType: 'Restructuring Redesign', spaceType: 'Children\'s rooms', areaSqm:'480', chatId: '124'},
    { id: '#REQ-5918', full_name: 'Kyler Conley', status_label:'Pending', status: 'pending', date: '6 hours ago', serviceType: 'Project Management', spaceType: 'Shops', areaSqm:'68', chatId: '123'},
    { id: '#REQ-5943', full_name: 'Lochlan Terrell', status_label:'In Progress', status: 'in_progress', date: '2 hours ago', serviceType: 'Restructuring Redesign', spaceType: 'Children\'s rooms', areaSqm:'33', chatId: '124'},
    { id: '#REQ-5947', full_name: 'Micah Galindo', status_label:'Pending', status: 'pending', date: '6 hours ago', serviceType: 'Project Management', spaceType: 'Shops', areaSqm:'160', chatId: '123'},
    { id: '#REQ-2479', full_name: 'Kinslee Mendez', status_label:'In Progress', status: 'in_progress', date: '2 hours ago', serviceType: 'Restructuring Redesign', spaceType: 'Children\'s rooms', areaSqm:'112', chatId: '124'},
];


export default function RequestServiceTable(){
    return (
        <Table columns={columns} data={data} options={{
                selectable: true, filterOptions: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Rejected', value: 'rejected' },
                    { label: 'Completed', value: 'completed' },
                ],
                filterField: 'status',
                renderActions: () => (
                    <div className="flex flex-col gap-2 w-full">
                        <button className="px-2 py-1 w-full text-sm text-start">Edit</button>
                        <button className="px-2 py-1 w-full text-sm text-start">Delete</button>
                        <button className="px-2 py-1 w-full text-sm text-start">Manage</button>
                    </div>
                ),
                bulkActions: [
                    { label: 'Delete', onClick: (selected) => console.log('delete', selected) },
                    { label: 'Export', onClick: (selected) => console.log('export', selected) },
                ],
                onSelectionChange: (selected) => console.log('selected rows', selected),
                searchPlaceholder: 'Search by names or ids',
            }}
        />
    );
}