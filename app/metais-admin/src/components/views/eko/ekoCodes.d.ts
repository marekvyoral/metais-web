import { EkoCode } from '@isdd/metais-common'

export type TEkoCodeDecorated = EkoCode & {
    selected?: boolean
}

export interface IEkoEditView {
    data?: TEkoCodeDecorated
    mutate: (ekoCode: EkoCode) => Promise<void>
    isLoading: boolean
    isError: boolean
}

export interface IEkoCreateView {
    data: TEkoCodeDecorated[]
    editData?: TEkoCodeDecorated
    mutate: (ekoCode: EkoCode) => Promise<void>
    isLoading: boolean
    isError: boolean
}

export interface IForm {
    name: string
    ekoCode: string
}

export interface IEkoDetailView {
    data: TEkoCodeDecorated | undefined
    isLoading: boolean
    isError: boolean
}

type IListData = {
    data: TEkoCodeDecorated[]
    entityName?: string
}

export interface IRowSelectionState {
    rowSelection: Record<string, TEkoCodeDecorated>
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, TEkoCodeDecorated>>>
}
