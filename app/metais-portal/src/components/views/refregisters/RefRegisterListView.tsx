import { ButtonLink, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import { getRefRegsDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { ActionsOverTable, BulkPopup, CreateEntityButton, MutationFeedback, QueryFeedback, Reference_Registers } from '@isdd/metais-common/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { RefRegistersFilter } from './RefRegistersFilter'

import { CiTable } from '@/components/ci-table/CiTable'
import { RefRegisterListContainerView } from '@/components/containers/refregisters/RefRegisterListContainer'

export const RefRegisterListView = ({
    data: { referenceRegisters, columnListData, guiAttributes, unitsData, ciTypeData, constraintsData, attributeProfiles },
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
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()
    const { isActionSuccess } = useActionSuccess()
    return (
        <QueryFeedback loading={isLoading || isBulkLoading} error={isError} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('refRegisters.title')}</TextHeading>
                <ElementToScrollTo trigger={isActionSuccess.value || !!bulkActionResult?.isSuccess}>
                    <MutationFeedback
                        success={isActionSuccess.value || bulkActionResult?.isSuccess}
                        successMessage={((): string | undefined => {
                            if (bulkActionResult?.isSuccess) {
                                return bulkActionResult?.successMessage
                            }
                            return isActionSuccess.additionalInfo?.type === 'create'
                                ? t('mutationFeedback.successfulCreated')
                                : t('mutationFeedback.successfulRemoved')
                        })()}
                        error={bulkActionResult?.isError}
                        errorMessage={bulkActionResult?.errorMessage}
                        onMessageClose={() => setBulkActionResult(undefined)}
                    />
                </ElementToScrollTo>
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
                attributes={guiAttributes}
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
                    entityStructure: { ...ciTypeData, attributes: guiAttributes },
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
