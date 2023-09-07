import { EkoCode } from '@isdd/metais-common'

export type TEkoCodeDecorated = EkoCode & {
    selected?: boolean
}

export interface IEkoEditView {
    data?: TEkoCodeDecorated
    mutate: (ekoCode: EkoCode) => Promise<void>
}

export interface IEkoCreateView {
    data: EkoCodeDecorated[]
    editData?: TEkoCodeDecorated
    mutate: (ekoCode: EkoCode) => Promise<void>
}

export interface IForm {
    name: string
    ekoCode: string
}

export interface IEkoDetailView {
    data: EkoCodeDecorated | undefined
}

type IListData = {
    data: EkoCodeDecorated[]
    entityName?: string
}

export interface IRowSelectionState {
    rowSelection: Record<string, EkoCodeDecorated>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, EkoCodeDecorated>>>
}
