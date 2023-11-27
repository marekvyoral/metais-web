import { Tab } from './Tabs'

export const changeTabOrder = (element: Tab, index: number, newTabList: Tab[], setNewTabList: React.Dispatch<React.SetStateAction<Tab[]>>): void => {
    const localTablist = [...newTabList]
    if (index < 0 || index >= localTablist.length) {
        return
    }
    localTablist.splice(localTablist.indexOf(element), 1)
    localTablist.splice(index, 0, element)

    setNewTabList(localTablist)
}
