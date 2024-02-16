import { BaseModal } from '@isdd/idsk-ui-kit/index'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from '@tanstack/react-table'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { ApiStandardRequestPreview, ApiStandardRequestPreviewList } from '@isdd/metais-common/api/generated/standards-swagger'
import { ModalButtons } from '@isdd/metais-common/index'
import { TableWithPagination } from '@isdd/metais-common/components/TableWithPagination/TableWithPagination'

import { standardRequestsListColumns } from './StandardRequestsListColumns'

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
                    <ModalButtons
                        submitButtonLabel={t('votes.type.select')}
                        onSubmit={handleSelectButtonClick}
                        closeButtonLabel={t('votes.type.cancel')}
                        onClose={handleCancel}
                    />
                </div>
            </BaseModal>
        )
    },
)
