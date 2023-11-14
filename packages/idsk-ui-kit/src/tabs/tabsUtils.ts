import { Tab } from './Tabs'

export const changeTabOrder = (element: Tab, index: number, newTabList: Tab[], setNewTabList: React.Dispatch<React.SetStateAction<Tab[]>>) => {
    const localTablist = [...newTabList]
    if (index < 0 || index >= localTablist.length) {
        return localTablist
    }
    localTablist.splice(localTablist.indexOf(element), 1)
    localTablist.splice(index, 0, element)

    setNewTabList(localTablist)
}
