import Table from "@/components/ui/DataTable";

const columns = [
  { key: 'id', title: 'ID', searchable: true },
  { key: 'name', title: 'Name', searchable: true },
  { key: 'vendor', title: 'Vendor' },
];

const data = [
  { id: 'P123', name: 'Enterprise Server', vendor: 'TechPro' },
  { id: 'P234', name: 'Executive Office Suite', vendor: 'Ergonomic Solutions' },
  { id: 'P123', name: 'Enterprise Server', vendor: 'TechPro' },
  { id: 'P234', name: 'Executive Office Suite', vendor: 'Ergonomic Solutions' },
  { id: 'P123', name: 'Enterprise Server', vendor: 'TechPro' },
  { id: 'P234', name: 'Executive Office Suite', vendor: 'Ergonomic Solutions' },
  { id: 'P123', name: 'Enterprise Server', vendor: 'TechPro' },
  { id: 'P234', name: 'Executive Office Suite', vendor: 'Ergonomic Solutions' },
  { id: 'P123', name: 'Enterprise Server', vendor: 'TechPro' },
  { id: 'P234', name: 'Executive Office Suite', vendor: 'Ergonomic Solutions' },
];




export default function UserTable(){
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