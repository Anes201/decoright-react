

import { ICONS } from '@/icons';
// components/Table.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react';

type Column<T = any> = {
  key: string;                  // unique key in data or virtual key
  title?: React.ReactNode;      // header label
  render?: (row: T) => React.ReactNode; // custom cell renderer
  searchable?: boolean;         // whether this column is included in search
  className?: string;           // additional classes for <td>
  width?: string;               // optional style width
};

type FilterOption = { label: string; value: string };
type ActionOptions = { label: string; value: string };

type BulkAction<T = any> = {
  label: string;
  onClick: (selected: T[]) => void;
};

type TableOptions<T = any> = {
  selectable?: boolean;                       // show checkboxes
  filterOptions?: FilterOption[];             // items for filter menu
  filterField?: string;
  renderActions?: (row: T) => React.ReactNode; // custom cell renderer for actions (optional)                       // row[field] to match filter option value
  ActionOptions?: ActionOptions[]; // for each item action: delete, edit, etc.
  searchPlaceholder?: string;
  onSelectionChange?: (selected: T[]) => void;
  pageSize?: number; // reserved for future pagination (not implemented)
  noResults?: React.ReactNode;
  bulkActions?: BulkAction<T>[]; // defaults to empty
  idField?: string;
};

export default function Table<T extends Record<string, any>>(props: {
  columns: Column<T>[];
  data: T[];
  options?: TableOptions<T>;
  className?: string;
}) {
  const { columns, data, options = {}, className = '' } = props;
  const {
    selectable = false,
    filterOptions,
    filterField,
    renderActions,
    ActionOptions,
    searchPlaceholder = 'Search',
    onSelectionChange,
    noResults,
    bulkActions = [], // defaults to empty
    idField,
  } = options;

  // controlled UI state
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // header checkbox ref so we can set `indeterminate` properly
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

  // selection state: store ids (we use index-based uid if there's no id)
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});


  // ---- helpers ----
  const getRowId = (row: T, fallbackIndex?: number) => {
    if (idField && row[idField] !== undefined && row[idField] !== null) {
      return String(row[idField]);
    }
    // fallback to index if idField not provided - still string to be keys
    return String(fallbackIndex ?? JSON.stringify(row));
  };


  // utility: compute list of keys to search through
  const searchableKeys: string[] = useMemo(() => {
    const marked = columns.filter(c => c.searchable).map(c => c.key);
    if (marked.length) return marked;
    // fallback: any string fields in first row
    const sample = data[0] || {};
    return Object.keys(sample).filter(k => typeof sample[k] === 'string');
  }, [columns, data]);

  // derived filtered data
  const filteredData = useMemo(() => {
    let rows = [...data];

    if (filterOptions && filterValue != null && filterField) {
      rows = rows.filter(r => String(r[filterField]) === String(filterValue));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        searchableKeys.some(key => {
          const val = row[key];
          if (val == null) return false;
          return String(val).toLowerCase().includes(q);
        })
      );
    }

    return rows;
  }, [data, filterOptions, filterValue, filterField, search, searchableKeys]);

  // ---- selection derived values ----
  const selectedIds = useMemo(
    () =>
      Object.keys(selectedMap).filter((id) => {
        // ensure the id is still in filteredData
        return selectedMap[id];
      }),
    [selectedMap]
  );

  // compute booleans for header checkbox state
  const filteredIds = useMemo(() => filteredData.map((r, i) => getRowId(r, i)), [filteredData]);
  const selectionCount = selectedIds.length;
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => !!selectedMap[id]);
  const someSelected = selectionCount > 0 && !allSelected;

  // ---- keep header checkbox indeterminate in sync ----
  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (!el) return;
    el.indeterminate = someSelected;
  }, [someSelected]);


  // selection helpers
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = Object.entries(selectedMap)
        .filter(([, v]) => v)
        .map(([index]) => filteredData[Number(index)])
        .filter(Boolean);
      onSelectionChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMap, filteredData]);

  useEffect(() => {
    // when data or filter/search changes, drop selection indexes that no longer exist
    setSelectedMap(prev => {
      const next: Record<number, boolean> = {};
      Object.keys(prev).forEach(k => {
        const idx = Number(k);
        if (filteredData[idx]) next[idx] = prev[idx];
      });
      return next;
    });
  }, [filteredData]);

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) return setSelectedMap({});
    const allMap: Record<number, boolean> = {};
    filteredData.forEach((_, idx) => (allMap[idx] = true));
    setSelectedMap(allMap);
  };

  const toggleRow = (index: number, checked?: boolean) => {
    setSelectedMap(prev => {
      const next = { ...prev };
      if (checked === false || (checked === undefined && prev[index])) {
        delete next[index];
      } else {
        next[index] = true;
      }
      return next;
    });
  };

  // ---- Row action dropdown state (per-row) ----
  const [openRowActionId, setOpenRowActionId] = useState<string | null>(null);

  // small UI components inside file (keeps exports minimal and readable)
  function RowActions({ row, index }: { row: T; index: number }) {
    const id = getRowId(row, index);
    const isOpen = openRowActionId === id;

    // default menu — you can override whole cell with `renderActions(row)` prop in options
    const defaultMenu = (
      <ul className="p-2 text-sm text-body font-medium">
        <li>
          <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">View</button>
        </li>
        <li>
          <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Duplicate</button>
        </li>
        <li>
          <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Delete</button>
        </li>
        <li>
          <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Edit</button>
        </li>
      </ul>
    );

    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={(e) => {
            e.stopPropagation();
            setOpenRowActionId((prev) => (prev === id ? null : id));
          }}
          className={`p-1 rounded-full ring-muted/15 hover:ring-1 hover:bg-emphasis/75 ${isOpen && 'ring-1 bg-emphasis/75'}`}
          title="Row actions"
        >
          {/* simple 3-dot icon */}
          <ICONS.ellipsisHorizontal className="size-5 text-muted"/>
        </button>

        {isOpen && (
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-1 min-w-40 w-max bg-surface border border-muted/15 rounded-lg shadow-md z-30"
          >
              {renderActions ? (
                <div className="flex gap-4 p-2">{renderActions(row)}</div>
              ) : (
                defaultMenu
              )}
          </div>
        )}
      </div>
    );
  }

  function BulkActionsHeader() {
    const selectedRows = data.filter((row, idx) => {
      const id = getRowId(row, idx);
      return !!selectedMap[id];
    });

    const [open, setOpen] = useState(false);
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="shrink-0 inline-flex items-center justify-center text-body hover:text-heading font-medium leading-5 rounded-base text-sm focus:outline-none"
        >
          Actions ({selectionCount})
          <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="z-30 absolute right-0 top-full min-w-40 w-max mt-2 bg-surface border border-muted/15 rounded-lg shadow-md ">
            <ul className="flex flex-col gap-2 p-2 text-sm text-body font-medium">
              {/* default bulk actions (delete/export) */}
              {bulkActions.length === 0 ? (
                <>
                  <li>
                    <p> No actions for bulk </p>
                  </li>
                </>
              ) : (
                bulkActions.map((b, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        b.onClick(selectedRows);
                        setOpen(false);
                      }}
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      {b.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // wrap clicks so row dropdowns close when user clicks elsewhere
  useEffect(() => {
    const cb = () => {
      setOpenRowActionId(null);
    };
    window.addEventListener("click", cb);
    return () => window.removeEventListener("click", cb);
  }, []);


  return (
    <div className={`relative w-full h-full mb-60 border border-muted/25 bg-surface rounded-xl ${className}`}>
      <div className="p-3 md:p-4 flex items-center justify-between space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <ICONS.magnifyingGlass className=" size-4 text-muted" />
            </div>
            <input
              id="table-search" value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder={searchPlaceholder}
              className="block w-full max-w-96 ps-9 pe-3 py-2 bg-emphasis/75 border border-muted/25 text-heading text-sm rounded-lg focus:outline-1 outline-muted/45 shadow-xs placeholder:text-body"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          {filterOptions && filterOptions.length > 0 ? (
            <div className="relative">
              <button id="dropdownDefaultButton" onClick={() => setDropdownOpen(v => !v)} type="button"
                className="space-x-1 shrink-0 inline-flex items-center justify-center text-body bg-emphasis/75 box-border border border-muted/25 hover:text-heading shadow-xs focus:outline-1 outline-muted/45 font-medium leading-5 rounded-lg text-sm px-3 py-2"
              >
                <ICONS.funnel className="size-4 text-muted" />
                <span className="max-md:hidden"> Filter by </span>
                <ICONS.chevronDown className="size-4 text-muted" />
              </button>

              {dropdownOpen && (
                <div className="z-30 absolute right-0 mt-2 bg-surface border border-muted/25 rounded-xl shadow-lg w-60">
                  <ul className="p-2 text-sm text-body font-medium">
                    <li>
                      <button
                        onClick={() => { setFilterValue(null); setDropdownOpen(false); }}
                        className="inline-flex items-center w-full p-2 hover:text-heading rounded"
                      >
                        All
                      </button>
                    </li>

                    {filterOptions.map(opt => (
                      <li key={opt.value}>
                        <button
                          onClick={() => { setFilterValue(opt.value); setDropdownOpen(false); }}
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                          aria-pressed={String(filterValue) === String(opt.value)}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <table className="w-full h-full py-20 text-sm text-left rtl:text-right text-body">
        <thead className="text-sm text-body bg-emphasis/75 border-y border-muted/75">
          <tr>
            {/* selectable header */}
            {selectable && (
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id={`table-checkbox-all`}
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 border border-muted/15 rounded-xs"
                  />
                  <label htmlFor={`table-checkbox-all`} className="sr-only">
                    Select all
                  </label>
                </div>
              </th>
            )}

            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-6 py-3 font-medium ${col.className ?? ""}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </th>
            ))}

            {/* Actions / Bulk actions header */}
            <th scope="col" className="px-6 py-3 font-medium text-end">
              {selectable && selectionCount > 0 ? (
                <BulkActionsHeader />
              ) : (
                <span className="text-muted">Actions</span>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr className="border-b last:border-none">
              <td colSpan={(columns.length) + (selectable ? 1 : 0) + (ActionOptions ? 1 : 0)}>
                {noResults ?? <div className="font-medium text-sm text-muted py-6 text-center">No results</div>}
              </td>
            </tr>
          ) : filteredData.map((row, idx) => {
            // idx relates to filteredData index; we store selection by this index
            return (
              <tr key={idx} className="border-b last:border-none border-muted/30 hover:bg-neutral-secondary-medium">
                {selectable && (
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id={`table-checkbox-${idx}`} type="checkbox" checked={!!selectedMap[idx]} onChange={(e) => toggleRow(idx, e.target.checked)}
                        className="w-4 h-4 bg-primary rounded-xl"
                      />
                      <label htmlFor={`table-checkbox-${idx}`} className="sr-only">Select row</label>
                    </div>
                  </td>
                )}

                {columns.map(col => (
                  <td key={col.key} className={`px-6 py-4 ${col.className ?? ''}`} style={col.width ? { width: col.width } : undefined}>
                    {col.render ? col.render(row) : (row[col.key] ?? '')}
                  </td>
                ))}

                <td className="px-6 py-4 text-end">
                  <RowActions row={row} index={idx} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}



// ########################################################################################################################################


// type Column<T = any> = {
//   key: string;
//   title?: React.ReactNode;
//   render?: (row: T) => React.ReactNode;
//   searchable?: boolean;
//   className?: string;
//   width?: string;
//   // mobile meta omitted here
// };

// type FilterOption = { label: string; value: string };

// type BulkAction<T = any> = {
//   label: string;
//   onClick: (selected: T[]) => void;
// };

// type TableOptions<T = any> = {
//   selectable?: boolean;
//   filterOptions?: FilterOption[];
//   filterField?: string;
//   renderActions?: (row: T) => React.ReactNode; // custom cell renderer for actions (optional)
//   searchPlaceholder?: string;
//   onSelectionChange?: (selected: T[]) => void;
//   noResults?: React.ReactNode;
//   // NEW: bulk actions that appear when user selects rows in header
//   bulkActions?: string;;
//   // idField to uniquely identify rows (recommended)
//   idField?: string;
// };

// export function Table2<T extends Record<string, any>>(props: {
//   columns: Column<T>[];
//   data: T[];
//   options?: TableOptions<T>;
//   className?: string;
// }) {
//   const { columns, data, options = {}, className = "" } = props;
//   const {
//     selectable = false,
//     filterOptions,
//     filterField,
//     renderActions,
//     searchPlaceholder = "Search",
//     onSelectionChange,
//     noResults,
//     bulkActions = [], // defaults to empty
//     idField,
//   } = options;

//   // ---- UI state ----
//   const [search, setSearch] = useState("");
//   const [filterValue, setFilterValue] = useState<string | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // selectedMap keyed by rowId (string)
//   const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

//   // header checkbox ref so we can set `indeterminate` properly
//   const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

//   // ---- helpers ----
//   const getRowId = (row: T, fallbackIndex?: number) => {
//     if (idField && row[idField] !== undefined && row[idField] !== null) {
//       return String(row[idField]);
//     }
//     // fallback to index if idField not provided - still string to be keys
//     return String(fallbackIndex ?? JSON.stringify(row));
//   };

//   // searchable keys (if none marked, fallback to string fields)
//   const searchableKeys = useMemo(() => {
//     const marked = columns.filter((c) => c.searchable).map((c) => c.key);
//     if (marked.length) return marked;
//     const sample = data[0] || {};
//     return Object.keys(sample).filter((k) => typeof sample[k] === "string");
//   }, [columns, data]);

//   // ---- derived filtered data ----
//   const filteredData = useMemo(() => {
//     let rows = [...data];

//     if (filterOptions && filterValue != null && filterField) {
//       rows = rows.filter((r) => String(r[filterField]) === String(filterValue));
//     }

//     if (search.trim()) {
//       const q = search.toLowerCase();
//       rows = rows.filter((row) =>
//         searchableKeys.some((key) => {
//           const val = row[key];
//           if (val == null) return false;
//           return String(val).toLowerCase().includes(q);
//         })
//       );
//     }

//     return rows;
//   }, [data, filterOptions, filterValue, filterField, search, searchableKeys]);

//   // ---- selection derived values ----
//   const selectedIds = useMemo(
//     () =>
//       Object.keys(selectedMap).filter((id) => {
//         // ensure the id is still in filteredData
//         return selectedMap[id];
//       }),
//     [selectedMap]
//   );

//   // compute booleans for header checkbox state
//   const filteredIds = useMemo(() => filteredData.map((r, i) => getRowId(r, i)), [filteredData]);
//   const selectionCount = selectedIds.length;
//   const allSelected = filteredIds.length > 0 && filteredIds.every((id) => !!selectedMap[id]);
//   const someSelected = selectionCount > 0 && !allSelected;

//   // ---- keep header checkbox indeterminate in sync ----
//   useEffect(() => {
//     const el = headerCheckboxRef.current;
//     if (!el) return;
//     el.indeterminate = someSelected;
//   }, [someSelected]);

//   // ---- keep selectedMap consistent when filtered data changes ----
//   useEffect(() => {
//     setSelectedMap((prev) => {
//       // only keep keys still present in current data set (not globally - we keep selection only for displayed rows)
//       const next: Record<string, boolean> = {};
//       Object.keys(prev).forEach((k) => {
//         if (prev[k] && filteredIds.includes(k)) next[k] = true;
//       });
//       return next;
//     });
//   }, [filteredIds]);

//   // ---- call external selection callback ----
//   useEffect(() => {
//     if (!onSelectionChange) return;
//     const selectedRows = data.filter((row, idx) => {
//       const id = getRowId(row, idx);
//       return !!selectedMap[id];
//     });
//     onSelectionChange(selectedRows);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedMap]);

//   // ---- selection actions ----
//   const toggleSelectAll = (checked: boolean) => {
//     if (!checked) {
//       setSelectedMap({});
//       return;
//     }
//     const map: Record<string, boolean> = {};
//     filteredData.forEach((row, idx) => {
//       const id = getRowId(row, idx);
//       map[id] = true;
//     });
//     setSelectedMap(map);
//   };

//   const toggleRow = (row: T, checked?: boolean, idx?: number) => {
//     const id = getRowId(row, idx);
//     setSelectedMap((prev) => {
//       const next = { ...prev };
//       if (checked === false || (checked === undefined && prev[id])) {
//         delete next[id];
//       } else {
//         next[id] = true;
//       }
//       return next;
//     });
//   };

//   // ---- Row action dropdown state (per-row) ----
//   const [openRowActionId, setOpenRowActionId] = useState<string | null>(null);

//   // small UI components inside file (keeps exports minimal and readable)
//   function RowActions({ row, index }: { row: T; index: number }) {
//     const id = getRowId(row, index);
//     const isOpen = openRowActionId === id;

//     // default menu — you can override whole cell with `renderActions(row)` prop in options
//     const defaultMenu = (
//       <ul className="p-2 text-sm text-body font-medium">
//         <li>
//           <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">View</button>
//         </li>
//         <li>
//           <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Duplicate</button>
//         </li>
//         <li>
//           <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Delete</button>
//         </li>
//         <li>
//           <button className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Edit</button>
//         </li>
//       </ul>
//     );

//     return (
//       <div className="relative inline-flex items-center">
//         <button
//           type="button"
//           aria-expanded={isOpen}
//           aria-haspopup="menu"
//           onClick={(e) => {
//             e.stopPropagation();
//             setOpenRowActionId((prev) => (prev === id ? null : id));
//           }}
//           className="p-2 rounded-sm hover:bg-neutral-secondary-medium"
//           title="Row actions"
//         >
//           {/* simple 3-dot icon */}
//           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
//             <circle cx="5" cy="12" r="1.5" fill="currentColor" />
//             <circle cx="12" cy="12" r="1.5" fill="currentColor" />
//             <circle cx="19" cy="12" r="1.5" fill="currentColor" />
//           </svg>
//         </button>

//         {isOpen && (
//           <div
//             role="menu"
//             onClick={(e) => e.stopPropagation()}
//             className="z-20 absolute right-0 top-full mt-2 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-40"
//           >
//             {renderActions ? (
//               <div className="p-2">{renderActions(row)}</div>
//             ) : (
//               defaultMenu
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   function BulkActionsHeader() {
//     const selectedRows = data.filter((row, idx) => {
//       const id = getRowId(row, idx);
//       return !!selectedMap[id];
//     });

//     const [open, setOpen] = useState(false);
//     return (
//       <div className="relative inline-flex items-center">
//         <button
//           type="button"
//           onClick={(e) => {
//             e.stopPropagation();
//             setOpen((v) => !v);
//           }}
//           className="shrink-0 inline-flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none"
//         >
//           Actions ({selectionCount})
//           <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
//           </svg>
//         </button>

//         {open && (
//           <div className="z-10 absolute right-0 mt-2 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
//             <ul className="p-2 text-sm text-body font-medium">
//               {/* default bulk actions (delete/export) */}
//               {bulkActions.length === 0 ? (
//                 <>
//                   <li>
//                     <button
//                       onClick={() => {
//                         // default: console log (you should override)
//                         console.log("Delete", selectedRows);
//                         setOpen(false);
//                       }}
//                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
//                     >
//                       Delete selected
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         console.log("Export", selectedRows);
//                         setOpen(false);
//                       }}
//                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
//                     >
//                       Export selected
//                     </button>
//                   </li>
//                 </>
//               ) : (
//                 bulkActions.map((b, i) => (
//                   <li key={i}>
//                     <button
//                       onClick={() => {
//                         b.onClick(selectedRows);
//                         setOpen(false);
//                       }}
//                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
//                     >
//                       {b.label}
//                     </button>
//                   </li>
//                 ))
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // wrap clicks so row dropdowns close when user clicks elsewhere
//   useEffect(() => {
//     const cb = () => {
//       setOpenRowActionId(null);
//     };
//     window.addEventListener("click", cb);
//     return () => window.removeEventListener("click", cb);
//   }, []);

//   // ---- render ----
//   return (
//     <div className={`relative w-full border border-muted/25 rounded-xl ${className}`}>
//       <div className="p-4 flex items-center justify-between space-x-4">
//         {/* Search */}
//         <div className="flex-1 max-w-2xl">
//           <label htmlFor="table-search" className="sr-only">
//             Search
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//               <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                 <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
//               </svg>
//             </div>
//             <input
//               id="table-search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               type="text"
//               className="block w-full max-w-96 ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
//               placeholder={searchPlaceholder}
//             />
//           </div>
//         </div>

//         {/* Filter (unchanged) */}
//         <div className="flex items-center gap-3">
//           {filterOptions && filterOptions.length > 0 ? (
//             <div className="relative">
//               <button
//                 id="dropdownDefaultButton"
//                 onClick={() => setDropdownOpen((v) => !v)}
//                 className="shrink-0 inline-flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none"
//                 type="button"
//               >
//                 <svg className="w-4 h-4 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                   <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
//                 </svg>
//                 Filter by
//                 <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="z-10 absolute right-0 mt-2 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-40">
//                   <ul className="p-2 text-sm text-body font-medium">
//                     <li>
//                       <button
//                         onClick={() => {
//                           setFilterValue(null);
//                           setDropdownOpen(false);
//                         }}
//                         className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
//                       >
//                         All
//                       </button>
//                     </li>

//                     {filterOptions.map((opt) => (
//                       <li key={opt.value}>
//                         <button
//                           onClick={() => {
//                             setFilterValue(opt.value);
//                             setDropdownOpen(false);
//                           }}
//                           className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
//                           aria-pressed={String(filterValue) === String(opt.value)}
//                         >
//                           {opt.label}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : null}
//         </div>
//       </div>

//       {/* Table */}
//       <table className="w-full text-sm text-left rtl:text-right text-body">
//         <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-t border-default-medium">
//           <tr>
//             {selectable && (
//               <th scope="col" className="p-4">
//                 <div className="flex items-center">
//                   <input
//                     id={`table-checkbox-all`}
//                     ref={headerCheckboxRef}
//                     type="checkbox"
//                     checked={allSelected}
//                     onChange={(e) => toggleSelectAll(e.target.checked)}
//                     className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
//                   />
//                   <label htmlFor={`table-checkbox-all`} className="sr-only">
//                     Select all
//                   </label>
//                 </div>
//               </th>
//             )}

//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 scope="col"
//                 className={`px-6 py-3 font-medium ${col.className ?? ""}`}
//                 style={col.width ? { width: col.width } : undefined}
//               >
//                 {col.title}
//               </th>
//             ))}

//             {/* Actions / Bulk actions header */}
//             <th scope="col" className="px-6 py-3 font-medium text-end">
//               {selectable && selectionCount > 0 ? (
//                 <BulkActionsHeader />
//               ) : (
//                 <span className="text-muted">Actions</span>
//               )}
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredData.length === 0 ? (
//             <tr className="bg-neutral-primary-soft border-b last:border-none hover:bg-neutral-secondary-medium">
//               <td colSpan={(columns.length) + (selectable ? 1 : 0) + 1} className="px-6 py-4">
//                 {noResults ?? <div className="text-sm text-muted py-6 text-center">No results</div>}
//               </td>
//             </tr>
//           ) : (
//             filteredData.map((row, idx) => {
//               const rowId = getRowId(row, idx);
//               return (
//                 <tr key={rowId} className="bg-neutral-primary-soft border-b last:border-none hover:bg-neutral-secondary-medium">
//                   {selectable && (
//                     <td className="w-4 p-4">
//                       <div className="flex items-center">
//                         <input
//                           id={`table-checkbox-${rowId}`}
//                           type="checkbox"
//                           checked={!!selectedMap[rowId]}
//                           onChange={(e) => toggleRow(row, e.target.checked, idx)}
//                           className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
//                         />
//                         <label htmlFor={`table-checkbox-${rowId}`} className="sr-only">Select row</label>
//                       </div>
//                     </td>
//                   )}

//                   {columns.map((col) => (
//                     <td key={col.key} className={`px-6 py-4 ${col.className ?? ""}`} style={col.width ? { width: col.width } : undefined}>
//                       {col.render ? col.render(row) : (row[col.key] ?? "")}
//                     </td>
//                   ))}

//                   <td className="px-6 py-4 text-end">
//                     <RowActions row={row} index={idx} />
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
