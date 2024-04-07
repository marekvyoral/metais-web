import { ButtonLink, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import { getRefRegsDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAddFavorite } from '@isdd/metais-common/hooks/useAddFavorite'
import { ActionsOverTable, BulkPopup, CreateEntityButton, MutationFeedback, QueryFeedback, Reference_Registers } from '@isdd/metais-common/index'
import { useMemo } from 'react'
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
    const { isActionSuccess } = useActionSuccess()
    const {
        addFavorite,
        error: errorAddToFavorite,
        isLoading: isLoadingAddToFavorite,
        isSuccess: isSuccessAddToFavorite,
        resetState,
        successMessage,
    } = useAddFavorite()

    const selectedUuids = useMemo(() => {
        return Object.values(rowSelection).map((i) => i.uuid)
    }, [rowSelection])

    const handleAddToFavorite = () => {
        addFavorite(
            selectedUuids.map((item) => String(item)),
            FollowedItemItemType.REF_REGISTER,
        )
    }

    return (
        <QueryFeedback loading={isLoading || isLoadingAddToFavorite} error={isError} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('refRegisters.title')}</TextHeading>
                <ElementToScrollTo trigger={isActionSuccess.value || !!isSuccessAddToFavorite}>
                    <MutationFeedback
                        success={isActionSuccess.value || isSuccessAddToFavorite}
                        successMessage={((): string | undefined => {
                            if (isSuccessAddToFavorite) {
                                return successMessage
                            }
                            return isActionSuccess.additionalInfo?.type === 'create'
                                ? t('mutationFeedback.successfulCreated')
                                : t('mutationFeedback.successfulRemoved')
                        })()}
                        error={!!errorAddToFavorite}
                        errorMessage={t('userProfile.notifications.feedback.error')}
                        onMessageClose={() => resetState()}
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
                                    handleAddToFavorite()
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
