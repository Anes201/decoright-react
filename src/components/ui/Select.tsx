
import Select from 'react-select'

export function SelectMenu({...props}) {
    return (
        <Select classNamePrefix="react-select" classNames={{ menuList: () => "min-scrollbar"}} unstyled {...props} />
    )
}

export function SelectDropDownMenu({...props}) {
    return (
        <Select classNamePrefix="react-select-dropdown" classNames={{ menuList: () => "min-scrollbar"}} unstyled {...props} />
    )
}
