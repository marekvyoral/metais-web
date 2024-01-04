import { BaseModal, Button, GridRow } from '@isdd/idsk-ui-kit/index'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from '@tanstack/react-table'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { ApiStandardRequestPreview, ApiStandardRequestPreviewList } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from './StandardRequestsListModal.module.scss'
import { standardRequestsListColumns } from './StandardRequestsListColumns'

import { TableWithPagination } from '@/components/views/standardization/votes/components/TableWithPagination/TableWithPagination'

type StandardRequestsListModalType = {
    allStandardRequestData: ApiStandardRequestPreviewList | undefined
    handleSelect: (index: number) => void
    selectedRequestId?: number
    setSelectedRequestId: React.Dispatch<React.SetStateAction<number | undefined>>
}

export type StandardRequestsListModalRefType = {
    open: () => boolean
}

export const StandardRequestsListModal = forwardRef<StandardRequestsListModalRefType, StandardRequestsListModalType>(
    ({ allStandardRequestData, handleSelect, selectedRequestId, setSelectedRequestId }, ref) => {
        const { t } = useTranslation()
        const [isStandardRequestsListModalOpen, setIsStandardRequestsListModalOpen] = useState<boolean>(false)

        const tableData = allStandardRequestData?.standardRequests

        const handleOpenStandardRequestListModal = () => {
            setIsStandardRequestsListModalOpen(true)
        }

        useImperativeHandle(ref, () => {
            return {
                open() {
                    handleOpenStandardRequestListModal()
                    return true
                },
            }
        })
        const handleCancel = () => {
            setIsStandardRequestsListModalOpen(false)
        }

        const handleSelectButtonClick = () => {
            if (!selectedRequestId) {
                return
            }
            handleSelect(selectedRequestId)
            handleCancel()
        }

        const handleRowSelected = (row: Row<ApiStandardRequestPreview>) => {
            setSelectedRequestId(row.original.id)
        }

        return (
            <BaseModal isOpen={isStandardRequestsListModalOpen} close={handleCancel}>
                <div>
                    <Spacer vertical />
                    {tableData && (
                        <TableWithPagination
                            tableColumns={standardRequestsListColumns(t, handleRowSelected, selectedRequestId)}
                            tableData={tableData}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                        />
                    )}
                    <Spacer vertical />
                    <GridRow>
                        <Button type="submit" variant="secondary" label={t('votes.type.cancel')} onClick={handleCancel} />
                        <Button type="submit" label={t('votes.type.select')} className={styles.marginLeft} onClick={handleSelectButtonClick} />
                    </GridRow>
                </div>
            </BaseModal>
        )
    },
)
