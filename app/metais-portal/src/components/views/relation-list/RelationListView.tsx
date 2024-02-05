import { BreadCrumbs, Filter, HomeIcon, IOption, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { RelationshipUi } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationshipsFilterData, defaultFilterValues } from '@/components/containers/relation-list/RelationListContainer'

export interface IRelationListView {
    relTypeOptions: IOption<string>[]
    ciTypes: CiTypePreview[]
    relations: RelationshipUi[]
    filter: RelationshipsFilterData
    totalItems: number
    isLoadingRelations: boolean
    handleFilterChange: (changedFilter: IFilter) => void
    onSourceTypeChange: (val: string | undefined) => void
    onTargetTypeChange: (val: string | undefined) => void
    //onRelTypeChange: (val: string | undefined) => void
    // relAttributes: Attribute[] | undefined
    // relAttributeProfiles: AttributeProfile[] | undefined
}

export const RelationListView: React.FC<IRelationListView> = ({
    relTypeOptions,
    ciTypes,
    relations,
    filter: defFilter,
    totalItems,
    isLoadingRelations,
    handleFilterChange,
    onSourceTypeChange,
    onTargetTypeChange,
    //onRelTypeChange,
    // relAttributes,
    // relAttributeProfiles,
}) => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<RelationshipUi>> = [
        {
            id: 'startCiTypeName',
            header: t('relationshipList.startTypeName'),
            accessorFn: (row) => row.startTypeName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
        {
            id: 'startCiName',
            header: t('relationshipList.startName'),
            accessorFn: (row) => row.startName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => <Link to={`/ci/${row.row.original.startType}/${row.row.original.startUuid}`}>{row.row.original.startName}</Link>,
            enableSorting: true,
        },
        {
            id: 'startKodMetaIS',
            header: t('relationshipList.startKodMetaIS'),
            accessorFn: (row) => row.startKodMetaIS,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
        {
            id: 'endCiTypeName',
            header: t('relationshipList.endTypeName'),
            accessorFn: (row) => row.endTypeName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
        {
            id: 'endCiName',
            header: t('relationshipList.endName'),
            accessorFn: (row) => row.endName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => <Link to={`/ci/${row.row.original.endType}/${row.row.original.endUuid}`}>{row.row.original.endName}</Link>,
            enableSorting: true,
        },
        {
            id: 'endKodMetaIS',
            header: t('relationshipList.endKodMetaIS'),
            accessorFn: (row) => row.endKodMetaIS,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
        {
            id: 'type',
            header: t('relationshipList.relType'),
            accessorFn: (row) => row.type,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => (
                <Link to={`/relation/${row.row.original.startType}/${row.row.original.startUuid}/${row.row.original.uuid}`}>
                    {row.row.original.type}
                </Link>
            ),
            enableSorting: false,
        },
    ]

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: '/', icon: HomeIcon },
                    { label: t('titles.relationsSearch'), href: RouterRoutes.RELATION_LIST },
                ]}
            />

            <MainContentWrapper>
                <TextHeading size="XL">{t('titles.relationsSearch')}</TextHeading>
                <Filter<RelationshipsFilterData>
                    heading={t('codeList.filter.title')}
                    defaultFilterValues={defaultFilterValues}
                    form={({ filter, setValue, watch }) => (
                        <div>
                            <SimpleSelect
                                id="relType"
                                name="relType"
                                label={t('relationshipList.relType')}
                                options={relTypeOptions}
                                setValue={setValue}
                                defaultValue={filter.relType}
                                //onChange={onRelTypeChange}
                            />
                            <SimpleSelect
                                id="sourceType"
                                name="sourceType"
                                label={t('relationshipList.startTypeName')}
                                options={ciTypes?.map((type) => ({
                                    value: type.technicalName ?? '',
                                    label: type.name ?? '',
                                }))}
                                setValue={setValue}
                                defaultValue={filter.sourceType}
                                onChange={onSourceTypeChange}
                                disabled={!!watch('relType')}
                            />
                            <SimpleSelect
                                id="targetType"
                                name="targetType"
                                label={t('relationshipList.endTypeName')}
                                options={ciTypes?.map((type) => ({
                                    value: type.technicalName ?? '',
                                    label: type.name ?? '',
                                }))}
                                setValue={setValue}
                                onChange={onTargetTypeChange}
                                defaultValue={filter.targetType}
                                disabled={!!watch('relType')}
                            />
                            {/* Zistit ci chceme filter podla attrs kedze ich nezobrazujeme */}
                            {/* {watch('relType') && (
                                <DynamicFilterAttributes
                                    setValue={setValue}
                                    defaults={defaultFilterValues}
                                    filterData={{
                                        attributeFilters: filter.attributeFilters ?? {},
                                        metaAttributeFilters: filter.metaAttributeFilters ?? {},
                                    }}
                                    attributes={relAttributes}
                                    attributeProfiles={relAttributeProfiles}
                                    constraintsData={undefined}
                                    ignoreInputNames={[
                                        MetainformationColumns.OWNER,
                                        MetainformationColumns.CREATED_AT,
                                        MetainformationColumns.STATE,
                                        MetainformationColumns.LAST_MODIFIED_AT,
                                    ]}
                                />
                            )} */}
                        </div>
                    )}
                />
                <QueryFeedback loading={isLoadingRelations} withChildren>
                    <ActionsOverTable
                        pagination={{
                            pageNumber: defFilter.pageNumber ?? BASE_PAGE_NUMBER,
                            pageSize: defFilter.pageSize ?? BASE_PAGE_SIZE,
                            dataLength: totalItems ?? 0,
                        }}
                        entityName=""
                        handleFilterChange={handleFilterChange}
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    />
                    <Table
                        data={relations}
                        columns={columns}
                        isLoading={isLoadingRelations}
                        sort={defFilter.sort}
                        onSortingChange={(columnSort) => {
                            handleFilterChange({ sort: columnSort })
                        }}
                    />
                    <PaginatorWrapper
                        pageNumber={defFilter.pageNumber || BASE_PAGE_NUMBER}
                        pageSize={defFilter.pageSize || BASE_PAGE_SIZE}
                        dataLength={totalItems || 0}
                        handlePageChange={handleFilterChange}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
