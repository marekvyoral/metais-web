import React, { useEffect, useState } from 'react'
import { Filter, Input, TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { AddItemsButtonGroup } from '@isdd/metais-common/components/add-items-button-group/AddItemsButtonGroup'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/hooks/useGetCiTypeConstraintsData'
import { useCiListContainer } from '@isdd/metais-common/hooks/useCiListContainer'
import { ConfigurationItemUi, IncidentRelationshipSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ModalButtons } from '@isdd/metais-common/index'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { CIFilterData } from '@/pages/ci/[entityName]/entity'
import { CiTable } from '@/components/ci-table/CiTable'

type Props = {
    ciType: string
    selectedItems: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null
    onSelectedSubmit: (val: ColumnsOutputDefinition[]) => void
    closeOnClick: () => void
    existingRelations: IncidentRelationshipSetUi | undefined
}

export const CiListPageForModal: React.FC<Props> = ({ ciType, selectedItems, onSelectedSubmit, closeOnClick, existingRelations }) => {
    const { t, i18n } = useTranslation()
    const defaultFilterValues: CIFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }
    const [filterValues, setFilterValues] = useState<CIFilterData>(defaultFilterValues)

    const {
        ciTypeData,
        attributes,
        attributeProfiles,
        constraintsData,
        unitsData,
        isError: isAttError,
        isLoading: isAttLoading,
    } = useAttributesHook(ciType)

    const {
        isError: isCiListError,
        isLoading: isCiListLoading,
        tableData,
        // handleFilterChange,
        pagination,
        columnListData,
        storeUserSelectedColumns,
        resetUserSelectedColumns,
        sort,
        gestorsData,
    } = useCiListContainer<CIFilterData>({ entityName: ciType, defaultFilterValues: filterValues })

    const {
        isError: isCiTypeConstraintsError,
        isLoading: isCiTypeConstraintsLoading,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, tableData?.configurationItemSet ?? [])

    const isLoading = isAttLoading || isCiListLoading || isCiTypeConstraintsLoading
    const isError = isAttError || isCiListError || isCiTypeConstraintsError

    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    useEffect(() => {
        if (selectedItems && Array.isArray(selectedItems)) {
            setRowSelection(
                selectedItems.reduce(
                    (acc: Record<string, ColumnsOutputDefinition>, item: ColumnsOutputDefinition) => ({
                        ...acc,
                        [item.uuid ?? '']: item,
                    }),
                    {},
                ),
            )
        }
    }, [selectedItems, setRowSelection])

    const handleRelationItemsChange = () => {
        const selectedItemsKeys = Object.keys(rowSelection)
        onSelectedSubmit(selectedItemsKeys.map((key) => rowSelection[key]))
        closeOnClick()
    }

    const handleFilterChange = (filter: IFilter) => {
        setFilterValues((prevFilter) => {
            return { ...prevFilter, ...filter }
        })
    }

    const itemUuidsWithoutCheckboxes = [
        ...(existingRelations?.endRelationshipSet?.map((rel) => rel.startUuid ?? '') ?? []),
        ...(existingRelations?.startRelationshipSet?.map((rel) => rel.endUuid ?? '') ?? []),
    ]

    return (
        <QueryFeedback loading={isLoading} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="L">{i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}</TextHeading>
                <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
            </FlexColumnReverseWrapper>
            <Filter<CIFilterData>
                handleOnSubmit={(filter) => {
                    setFilterValues((prevFilter) => {
                        return { ...prevFilter, ...filter }
                    })
                }}
                customReset={() => setFilterValues(defaultFilterValues)}
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
                handleFilterChange={handleFilterChange}
                storeUserSelectedColumns={storeUserSelectedColumns}
                resetUserSelectedColumns={resetUserSelectedColumns}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={ciTypeData?.name ?? ''}
                attributeProfiles={attributeProfiles ?? []}
                attributes={attributes ?? []}
                columnListData={columnListData}
                ciTypeData={ciTypeData}
                selectedRowsCount={Object.keys(rowSelection).length}
                bulkPopup={<AddItemsButtonGroup handleItemsChange={handleRelationItemsChange} onCancel={() => closeOnClick()} />}
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
                itemUuidsWithoutCheckboxes={itemUuidsWithoutCheckboxes}
                linkToNewTab
                baseHref={`/ci/${ciType}`}
            />

            <ModalButtons
                submitButtonLabel={t('newRelation.addItems')}
                onSubmit={handleRelationItemsChange}
                closeButtonLabel={t('newRelation.cancel')}
                onClose={closeOnClick}
            />
        </QueryFeedback>
    )
}
