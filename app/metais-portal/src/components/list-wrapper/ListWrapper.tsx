import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { getReadCiList1QueryKey } from '@isdd/metais-common/api/generated/cmdb-swagger'
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
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { DEFAULT_PAGESIZE_OPTIONS, ENTITY_PROJECT, ENTITY_TRAINING, ROLES } from '@isdd/metais-common/constants'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { ICiListContainerView } from '@/components/containers/CiListContainer'
import { getRowSelectionUuids } from '@/componentHelpers/ci/ciTableHelpers'
import { CiTable } from '@/components/ci-table/CiTable'
import { CIFilterData } from '@/pages/ci/[entityName]/entity'

interface IListWrapper extends ICiListContainerView<CIFilterData> {
    isNewRelationModal?: boolean
}

export const ListWrapper: React.FC<IListWrapper> = ({
    defaultFilterValues,
    entityName,
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
    isNewRelationModal,
    rowSelection,
    setRowSelection,
}) => {
    const { t, i18n } = useTranslation()

    const {
        isError: isCiTypeConstraintsError,
        isLoading: isCiTypeConstraintsLoading,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, tableData?.configurationItemSet ?? [])
    const {
        state: { user },
    } = useAuth()
    const { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleChangeOwner } = useBulkAction()
    const queryKey = getReadCiList1QueryKey({})
    const navigate = useNavigate()
    const location = useLocation()

    const checkedRowItems = Object.keys(rowSelection).length
    const isDisabledBulkButton = checkedRowItems === 0

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showChangeOwner, setShowChangeOwner] = useState<boolean>(false)

    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const checkedItemList = tableData?.configurationItemSet?.filter((i) => Object.keys(rowSelection).includes(i.uuid || '')) || []
    const queryClient = useQueryClient()
    const typeTraining = entityName === ENTITY_TRAINING
    const typeProject = entityName === ENTITY_PROJECT
    const isUserTrainer = user?.roles?.includes(ROLES.SKOLITEL)
    const isUserAdminEgov = user?.roles?.includes(ROLES.R_EGOV)
    const isUserAdmin = user?.roles?.includes(ROLES.R_ADMIN)
    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        queryClient.invalidateQueries([queryKey[0]])
        refetch()
        setBulkActionResult(actionResult)
    }
    const showCreateEntityButton = useMemo(() => {
        if (typeTraining) {
            return isUserTrainer ? true : false
        }
        if (typeProject) {
            return isUserAdminEgov || isUserAdmin ? true : false
        } else return true
    }, [isUserAdmin, isUserAdminEgov, isUserTrainer, typeProject, typeTraining])

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [bulkActionResult, scrollToMutationFeedback])

    const ciName = useMemo(
        () => (i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName),
        [ciTypeData?.engName, ciTypeData?.name, i18n.language],
    )

    useEffect(() => {
        document.title = `${t('titles.ciList', { ci: ciName })} | MetaIS`
    }, [ciName, t])

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{ciName}</TextHeading>
                {(isError || isCiTypeConstraintsError) && (
                    <QueryFeedback loading={false} error errorProps={{ errorMessage: t('feedback.failedFetch') }} />
                )}
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
            <Filter<CIFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ register, filter, setValue }) => {
                    return (
                        <div>
                            <Input
                                id="name"
                                label={t(`filter.${entityName}.name`)}
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
                                ciName={ciName}
                                attributes={attributes}
                                attributeProfiles={attributeProfiles}
                                constraintsData={constraintsData}
                            />
                        </div>
                    )
                }}
            />
            {!isNewRelationModal && (
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
                        showCreateEntityButton && (
                            <CreateEntityButton
                                ciTypeName={i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}
                                onClick={() => navigate(`/ci/${entityName}/create`, { state: { from: location } })}
                            />
                        )
                    }
                    importButton={<ImportButton ciType={entityName ?? ''} />}
                    exportButton={
                        <ExportButton
                            defaultFilterValues={defaultFilterValues}
                            checkedItemsUuids={getRowSelectionUuids(rowSelection)}
                            pagination={pagination}
                        />
                    }
                    bulkPopup={
                        <Tooltip
                            descriptionElement={errorMessage}
                            on={'click'}
                            position={'center center'}
                            tooltipContent={(open) => (
                                <div>
                                    <BulkPopup
                                        disabled={isDisabledBulkButton}
                                        checkedRowItems={checkedRowItems}
                                        items={(closePopup) => [
                                            <ButtonLink
                                                key={'invalidate'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleInvalidate(checkedItemList, () => setShowInvalidate(true), open)
                                                    closePopup()
                                                }}
                                                icon={CrossInACircleIcon}
                                                label={t('actionOverTable.invalidateItems')}
                                            />,
                                            <ButtonLink
                                                key={'reInvalidate'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleReInvalidate(checkedItemList, () => setShowReInvalidate(true), open)
                                                    closePopup()
                                                }}
                                                icon={CheckInACircleIcon}
                                                label={t('actionOverTable.validateItems')}
                                            />,
                                            <ButtonLink
                                                key={'changeOwner'}
                                                className={styles.buttonLinkWithIcon}
                                                onClick={() => {
                                                    handleChangeOwner(checkedItemList, () => setShowChangeOwner(true), open)
                                                    closePopup()
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
            )}
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
