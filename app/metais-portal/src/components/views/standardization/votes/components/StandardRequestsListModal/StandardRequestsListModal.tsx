import { BaseModal, Button, GridRow } from '@isdd/idsk-ui-kit/index'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from '@tanstack/react-table'
import { ApiStandardRequestPreview, ApiStandardRequestPreviewList } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from './StandardRequestsListModal.module.scss'
import { standardRequestsListColumns } from './StandardRequestsListColumns'

import { Spacer } from '@/components/Spacer/Spacer'
import { TableWithPagination } from '@/components/views/standardization/votes/components/TableWithPagination/TableWithPagination'

type StandardRequestsListModalType = {
    allStandardRequestData: ApiStandardRequestPreviewList | undefined
    handleSelect: (index: number) => void
}

export type StandardRequestsListModalRefType = {
    open: () => boolean
}

export const StandardRequestsListModal = forwardRef<StandardRequestsListModalRefType, StandardRequestsListModalType>(
    ({ allStandardRequestData, handleSelect }, ref) => {
        const { t } = useTranslation()
        const [isStandardRequestsListModalOpen, setIsStandardRequestsListModalOpen] = useState<boolean>(false)
        const [selectedRowId, setSelectedRowId] = useState<number | undefined>(undefined)
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
            if (!selectedRowId) {
                return
            }
            handleSelect(selectedRowId)
            handleCancel()
        }

        const handleRowSelected = useCallback((row: Row<ApiStandardRequestPreview>) => {
            setSelectedRowId(row.index)
        }, [])

        return (
            <BaseModal isOpen={isStandardRequestsListModalOpen} close={handleCancel}>
                <div>
                    <Spacer vertical />
                    {tableData && (
                        <TableWithPagination
                            tableColumns={standardRequestsListColumns(t, handleRowSelected, selectedRowId)}
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
