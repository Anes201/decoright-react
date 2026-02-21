
import { ChevronUpDown } from "@/icons";

function ListItem(props:any) {
    return (
        <li className="flex items-center gap-6 w-full h-25 p-4 border border-muted/25 shadow-xs bg-surface rounded-lg">
            <button type="button"> <ChevronUpDown className="size-6 text-muted/75"/> </button>
            <span className="font-medium text-lg"> {props.item} </span>
        </li>
    )
}

export default function List({items}:{items:[]}) {
    return (
        <ul className="flex flex-col gap-4 w-full">
            {items.map((item) => (
                <ListItem item={item} />
            ))}
        </ul>
    )
}