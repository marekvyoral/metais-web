import { ButtonLink, TextHeading } from '@isdd/idsk-ui-kit/index'
import { getRefRegsDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import {
    ActionsOverTable,
    BulkPopup,
    CreateEntityButton,
    MutationFeedback,
    QueryFeedback,
    Reference_Registers,
    distinctAttributesMetaAttributes,
} from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { useEffect, useState } from 'react'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

import { RefRegistersFilter } from './RefRegistersFilter'

import { CiTable } from '@/components/ci-table/CiTable'
import { RefRegisterListContainerView } from '@/components/containers/refregisters/RefRegisterListContainer'

export const RefRegisterListView = ({
    data: { referenceRegisters, columnListData, guiAttributes, unitsData, ciTypeData, constraintsData, attributeProfiles, renamedAttributes },
    defaultFilterValues,
    pagination,
    saveColumnSelection,
    resetColumns,
    sort,
    handleFilterChange,
    isLoading,
    isError,
    rowSelection,
    setRowSelection,
}: RefRegisterListContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { handleAddToFavorite, isBulkLoading } = useBulkAction()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [bulkActionResult, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading || isBulkLoading} error={isError} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('refRegisters.title')}</TextHeading>
                {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                    <div ref={wrapperRef}>
                        <MutationFeedback
                            success={bulkActionResult?.isSuccess}
                            successMessage={bulkActionResult?.successMessage}
                            error={bulkActionResult?.isError ? bulkActionResult?.errorMessage || t('feedback.mutationErrorMessage') : ''}
                            onMessageClose={() => setBulkActionResult(undefined)}
                        />
                    </div>
                )}
            </FlexColumnReverseWrapper>
            <RefRegistersFilter defaultFilterValues={defaultFilterValues} />
            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={Reference_Registers}
                selectedRowsCount={Object.keys(rowSelection).length}
                bulkPopup={({ selectedRowsCount }) => (
                    <BulkPopup
                        checkedRowItems={selectedRowsCount}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'favorite'}
                                className={actionsOverTableStyles.buttonLinkWithIcon}
                                label={t('codeListList.buttons.addToFavorites')}
                                icon={NotificationBlackIcon}
                                onClick={() => {
                                    const ids = Object.values(rowSelection).map((row) => row.uuid ?? '')
                                    handleAddToFavorite(ids, FollowedItemItemType.REF_REGISTER, (actionResult) => setBulkActionResult(actionResult))
                                    setRowSelection({})
                                    closePopup()
                                }}
                            />,
                        ]}
                    />
                )}
                createButton={
                    <CreateEntityButton
                        label={t('refRegisters.createBtn')}
                        onClick={() => navigate(`/refregisters/create`, { state: { from: location } })}
                    />
                }
                attributeProfiles={attributeProfiles}
                attributes={[...distinctAttributesMetaAttributes(renamedAttributes ?? [], getRefRegsDefaultMetaAttributes(t)), ...guiAttributes]}
                columnListData={columnListData}
                metaAttributesColumnSection={getRefRegsDefaultMetaAttributes(t)}
                storeUserSelectedColumns={saveColumnSelection}
                resetUserSelectedColumns={resetColumns}
            />
            <CiTable
                data={{
                    columnListData,
                    tableData: {
                        configurationItemSet: referenceRegisters?.map((refReg) => ({
                            attributes: { ...refReg },
                            uuid: refReg?.uuid,
                        })),
                    },
                    constraintsData,
                    unitsData,
                    entityStructure: { ...ciTypeData, attributes: [...(renamedAttributes ?? []), ...guiAttributes] },
                    gestorsData: undefined,
                }}
                rowSelectionState={{ rowSelection, setRowSelection }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}
