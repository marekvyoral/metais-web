import { BaseModal } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'

import { FileHistoryView } from './FileHistoryView'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetHistory } from '@isdd/metais-common/api/generated/dms-swagger'
import { useGetIdentitiesByLoginsBulkHook } from '@isdd/metais-common/api/generated/iam-swagger'

export interface IFileHistoryModalProps {
    onClose: () => void
    item: ConfigurationItemUi
}

export const FileHistoryModal: React.FC<IFileHistoryModalProps> = ({ item, onClose }) => {
    const { data, isLoading } = useGetHistory(item.uuid ?? '')
    const [tableData, setTableData] = useState(data?.versions ?? [])
    const [pageSize, setPageSize] = useState(10)
    const getNames = useGetIdentitiesByLoginsBulkHook()
    const [namesData, setNamesData] = useState<{ login: string; fullName: string }[]>()

    const loadNames = async (names: string[]) => {
        const getNamesData = await getNames(names)
        setNamesData(
            getNamesData.map((itemName) => {
                return { login: itemName.input ?? '', fullName: (itemName.identity?.firstName ?? '') + ' ' + (itemName.identity?.lastName ?? '') }
            }),
        )
    }

    useEffect(() => {
        if (data !== undefined && namesData === undefined) {
            const names = uniq(data?.versions?.map((itemName) => itemName.lastModifiedBy ?? '') ?? [])
            loadNames(names)
        }
    })
    const handlePagingSelect = (page: string) => {
        setPageSize(Number(page))
    }

    useEffect(() => {
        setTableData(data?.versions?.slice(0, pageSize) ?? [])
    }, [data?.versions, pageSize])

    return (
        <BaseModal isOpen close={onClose}>
            <FileHistoryView
                data={tableData}
                onClose={onClose}
                item={item}
                handlePagingSelect={handlePagingSelect}
                isLoading={isLoading}
                namesData={namesData}
            />
        </BaseModal>
    )
}
