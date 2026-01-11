import Table from "@/components/ui/DataTable";

const columns = [
    { key: 'id', title: 'ID', searchable: true },
    { key: 'name', title: 'Name', searchable: true },
    { key: 'status', title: 'Status' },
    { key: 'age', title: 'Age' },
    { key: 'thumbnail', title: 'Image', render: (row:any) => <img src={row.image} alt={row.name} className="w-12 h-8 object-cover rounded" />},
    { key: 'hello', title: 'Hello' },
];

const data = [
    { id: '1', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '2', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },
    { id: '3', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '4', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },
    { id: '5', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '6', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },
    { id: '7', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '8', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },
    { id: '9', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '10', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },
    { id: '11', name: 'Johnson', hello: 'test', status: 'Cardiologist', image: '/images/1.jpg', color: 'red', them: 'red', age: 'red' },
    { id: '12', hello: 'test', name: 'Alice', status: 'Nurse', image: '/images/2.jpg', them: 'red', age: 'red' },

];


export default function ServiceRequestTable(){
    return (
        <Table columns={columns} data={data} options={{
                selectable: true, filterOptions: [
                    { label: 'Red', value: 'red' },
                    { label: 'Blue', value: 'blue' },
                ],
                filterField: 'color',
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