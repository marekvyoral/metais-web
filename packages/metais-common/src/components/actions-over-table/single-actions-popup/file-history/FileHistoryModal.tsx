import { BaseModal } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'

import { FileHistoryView } from './FileHistoryView'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetHistory } from '@isdd/metais-common/api/generated/dms-swagger'
import { useGetIdentitiesByLoginsBulk } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export interface IFileHistoryModalProps {
    onClose: () => void
    item: ConfigurationItemUi
}

export const FileHistoryModal: React.FC<IFileHistoryModalProps> = ({ item, onClose }) => {
    const { data, isLoading } = useGetHistory(item.uuid ?? '')
    const [tableData, setTableData] = useState(data?.versions ?? [])
    const [pageSize, setPageSize] = useState(10)
    const {
        state: { user },
    } = useAuth()
    const { data: identitiesData } = useGetIdentitiesByLoginsBulk(uniq(data?.versions?.map((itemName) => itemName.lastModifiedBy ?? '') ?? []), {
        query: { enabled: !!data && user !== null },
    })

    const namesData = identitiesData?.map((itemName) => {
        return { login: itemName.input ?? '', fullName: (itemName.identity?.firstName ?? '') + ' ' + (itemName.identity?.lastName ?? '') }
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
