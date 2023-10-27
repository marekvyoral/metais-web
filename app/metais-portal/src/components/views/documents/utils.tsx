import { NeighbourPairUi } from '@isdd/metais-common/api'
import { IDocType } from '@isdd/metais-common/index'
import { Row, Table } from '@tanstack/react-table'

import { TableCols } from '@/components/containers/DocumentListContainer'
const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
export const downloadFile = (link: string, fileName: string) => {
    const anchor: HTMLAnchorElement = document.createElement('a')
    anchor.href = link
    anchor.download = fileName
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
}

export const isMeta = async (id: string, accessToken: string | null) => {
    const response = await fetch(baseURL + '/file/meta/' + id, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    if (response.ok) return true
    return false
}
export const filterAsync = async <T,>(array: T[], asyncPredicate: (item: T) => Promise<boolean>): Promise<T[]> => {
    const results = await Promise.all(
        array.map(async (item) => {
            if (await asyncPredicate(item)) {
                return item
            }
        }),
    )
    return results.filter(Boolean) as T[]
}

const invalidStates = ['INVALIDATED', 'Zneplatnené', 'Invalidated']

export const isInvalid = (row: Row<IDocType>) =>
    invalidStates.includes(
        row
            .getAllCells()
            .find((cell) => cell.column.id == 'state')
            ?.getValue() as string,
    )

export const downloadFiles = (fileDataArray: { link: string; fileName: string }[]) => {
    const downloadFileTmp = (url: string, name: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = name
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const downloadNext = (index: number) => {
        if (index < fileDataArray.length) {
            const { link, fileName } = fileDataArray[index]
            downloadFileTmp(link, fileName)
            setTimeout(() => {
                downloadNext(index + 1)
            }, 200)
        }
    }

    downloadNext(0)
}
const updatableDocuments = ['CI_HAS_DOCUMENT', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS']

export const isDocumentUpdatable = (document: NeighbourPairUi) => {
    if (document.relationship?.type !== undefined) {
        return updatableDocuments.includes(document.relationship?.type)
    } else {
        return false
    }
}

export const isDocumentsUpdatable = (documents: NeighbourPairUi[]) => {
    return documents.every((document) => isDocumentUpdatable(document))
}

export const listToMap = (data: TableCols[] | undefined, list: TableCols[]): Record<string, boolean> => {
    const map: Record<string, boolean> = {}
    if (data !== undefined)
        for (const item of list) {
            map[data?.indexOf(item)] = true
        }

    return map
}

export const allChecked = (table: Table<IDocType>) => {
    return table.getRowModel().rows.filter((row) => row.original.uuid).length > 0
        ? table
              .getRowModel()
              .rows.filter((row) => row.original.uuid)
              .every((row) => row.getIsSelected())
        : false
}

export const checkAll = (table: Table<IDocType>, newValue: React.ChangeEvent<HTMLInputElement>) => {
    return table
        .getRowModel()
        .rows.filter((row) => row.original.uuid)
        .forEach((row) => {
            row.toggleSelected(newValue.target.checked)
        })
}
