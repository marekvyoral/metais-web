import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IColumn, Input, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemSetUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import {
    BulkPopup,
    ChangeOwnerBulkModal,
    CreateEntityButton,
    InvalidateBulkModal,
    ReInvalidateBulkModal,
} from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { ExportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import { ImportButton } from '@isdd/metais-common/components/actions-over-table/actions-default/ImportButton'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { Languages } from '@isdd/metais-common/localization/languages'
import { CiType, AttributeProfile, Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { CiTable } from '@isdd/metais-common/components/ci-table/CiTable'
import { ColumnsOutputDefinition, IStoreColumnSelection } from '@isdd/metais-common/components/ci-table/ciTableHelpers'

import { CIFilterData } from '@/pages/ci/[entityName]/entity'

interface IListWrapper {
    defaultFilterValues: CIFilterData
    ciType: string | undefined
    columnListData: IColumn | undefined
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: IStoreColumnSelection) => void
    resetUserSelectedColumns: () => Promise<void>
    refetch: () => void
    ciTypeData: CiType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    attributes: Attribute[] | undefined
    tableData: ConfigurationItemSetUi | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    pagination: Pagination
    sort: ColumnSort[]
    isLoading: boolean
    isError: boolean
    gestorsData: RoleParticipantUI[] | undefined
}

export const ListWrapper: React.FC<IListWrapper> = ({
    defaultFilterValues,
    ciType,
    columnListData,
    handleFilterChange,
    storeUserSelectedColumns,
    resetUserSelectedColumns,
    ciTypeData,
    attributeProfiles,
    attributes,
    tableData,
    constraintsData,
    unitsData,
    pagination,
    sort,
    refetch,
    gestorsData,
    isLoading,
    isError,
}) => {
    const { t, i18n } = useTranslation()

    const {
        isError: isCiTypeConstraintsError,
        isLoading: isCiTypeConstraintsLoading,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, tableData?.configurationItemSet ?? [])

    const { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleChangeOwner } = useBulkAction()

    const navigate = useNavigate()
    const location = useLocation()
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    const checkedRowItems = Object.keys(rowSelection).length
    const isDisabledBulkButton = checkedRowItems === 0

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)

    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const checkedItemList = tableData?.configurationItemSet?.filter((i) => Object.keys(rowSelection).includes(i.uuid || '')) || []

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        refetch()
        setBulkActionResult(actionResult)
    }

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}</TextHeading>
                {(isError || isCiTypeConstraintsError) && (
                    <QueryFeedback loading={false} error errorProps={{ errorMessage: t('feedback.failedFetch') }} />
                )}
                {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                    <MutationFeedback
                        success={bulkActionResult?.isSuccess}
                        successMessage={bulkActionResult?.successMessage}
                        error={bulkActionResult?.isError ? bulkActionResult?.errorMessage || t('feedback.mutationErrorMessage') : ''}
                    />
                )}
            </FlexColumnReverseWrapper>

            <Filter<CIFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ register, filter, setValue }) => {
                    return (
                        <div>
                            <Input
                                id="name"
                                label={t(`filter.${ciType}.name`)}
                                placeholder={t(`filter.namePlaceholder`)}
                                {...register('Gen_Profil_nazov')}
                            />
                            <Input
                                id="metais-code"
                                label={t('filter.metaisCode.label')}
                                placeholder={ciTypeData?.codePrefix}
                                {...register('Gen_Profil_kod_metais')}
                            />
                            <DynamicFilterAttributes
                                setValue={setValue}
                                defaults={defaultFilterValues}
                                filterData={{
                                    attributeFilters: filter.attributeFilters ?? {},
                                    metaAttributeFilters: filter.metaAttributeFilters ?? {},
                                }}
                                attributes={attributes}
                                attributeProfiles={attributeProfiles}
                                constraintsData={constraintsData}
                            />
                        </div>
                    )
                }}
            />

            <ActionsOverTable
                pagination={pagination}
                metaAttributesColumnSection={getCiDefaultMetaAttributes({ t })}
                handleFilterChange={handleFilterChange}
                storeUserSelectedColumns={storeUserSelectedColumns}
                resetUserSelectedColumns={resetUserSelectedColumns}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={ciTypeData?.name ?? ''}
                attributeProfiles={attributeProfiles ?? []}
                attributes={attributes ?? []}
                columnListData={columnListData}
                ciTypeData={ciTypeData}
                createButton={
                    <CreateEntityButton ciType={ciType ?? ''} onClick={() => navigate(`/ci/${ciType}/create`, { state: { from: location } })} />
                }
                importButton={<ImportButton ciType={ciType ?? ''} />}
                exportButton={<ExportButton />}
                bulkPopup={
                    <Tooltip
                        descriptionElement={errorMessage}
                        position={'center center'}
                        tooltipContent={(open) => (
                            <div>
                                <BulkPopup
                                    disabled={isDisabledBulkButton}
                                    checkedRowItems={checkedRowItems}
                                    items={() => [
                                        <ButtonLink
                                            key={'invalidate'}
                                            className={styles.buttonLinkWithIcon}
                                            onClick={() => {
                                                handleInvalidate(checkedItemList, () => setShowInvalidate(true), open)
                                            }}
                                            icon={CrossInACircleIcon}
                                            label={t('actionOverTable.invalidateItems')}
                                        />,
                                        <ButtonLink
                                            key={'reInvalidate'}
                                            className={styles.buttonLinkWithIcon}
                                            onClick={() => {
                                                handleReInvalidate(checkedItemList, () => setShowReInvalidate(true), open)
                                            }}
                                            icon={CheckInACircleIcon}
                                            label={t('actionOverTable.validateItems')}
                                        />,
                                        <ButtonLink
                                            key={'changeOwner'}
                                            className={styles.buttonLinkWithIcon}
                                            onClick={() => {
                                                handleChangeOwner(checkedItemList, () => setShowChangeOwner(true), open)
                                            }}
                                            icon={ChangeIcon}
                                            label={t('actionOverTable.changeOwner')}
                                        />,
                                    ]}
                                />
                            </div>
                        )}
                    />
                }
            />

            {isBulkLoading && <LoadingIndicator fullscreen />}

            <ReInvalidateBulkModal
                items={checkedItemList}
                open={showReInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowReInvalidate)}
                onClose={() => setShowReInvalidate(false)}
            />
            <InvalidateBulkModal
                items={checkedItemList}
                open={showInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                onClose={() => setShowInvalidate(false)}
            />
            <ChangeOwnerBulkModal
                items={checkedItemList}
                open={showChangeOwner}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowChangeOwner)}
                onClose={() => setShowChangeOwner(false)}
                ciRoles={ciTypeData?.roleList ?? []}
            />

            <CiTable
                data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                handleFilterChange={handleFilterChange}
                pagination={pagination}
                sort={sort}
                rowSelectionState={{ rowSelection, setRowSelection }}
                storeUserSelectedColumns={storeUserSelectedColumns}
                isLoading={isLoading || isCiTypeConstraintsLoading}
                isError={isError || isCiTypeConstraintsError}
                uuidsToMatchedCiItemsMap={uuidsToMatchedCiItemsMap}
            />
        </QueryFeedback>
    )
}
