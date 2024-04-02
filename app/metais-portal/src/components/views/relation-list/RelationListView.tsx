import { BaseModal, BreadCrumbs, Filter, HomeIcon, IOption, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useRef, useState } from 'react'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { Trans, useTranslation } from 'react-i18next'
import { RelationshipUi } from '@isdd/metais-common/api/generated/iam-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, HowTo } from '@isdd/metais-common/constants'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable, ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { getHowToTranslate } from '@isdd/metais-common/utils/utils'
import { useGetRoleParticipant, useReadConfigurationItem, useReadRelationship } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { useGetRelationshipTypeWrapper } from '@isdd/metais-common/hooks/useRelationshipType.hook'

import { RelationDetailModalView } from './RelationDetailModalView'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationshipsFilterData, defaultFilterValues } from '@/components/containers/relation-list/RelationListContainer'

export interface IRelationListView {
    relTypeOptions: IOption<string>[]
    ciTypeOptions: IOption<string>[]
    relations: RelationshipUi[]
    filter: RelationshipsFilterData
    totalItems: number
    isLoadingRelations: boolean
    handleFilterChange: (changedFilter: IFilter) => void
    onSourceTypeChange: (val: string | undefined) => void
    onTargetTypeChange: (val: string | undefined) => void
    seed: number
}

export const RelationListView: React.FC<IRelationListView> = ({
    relTypeOptions,
    ciTypeOptions,
    relations,
    filter: defFilter,
    totalItems,
    isLoadingRelations,
    handleFilterChange,
    onSourceTypeChange,
    onTargetTypeChange,
    seed,
}) => {
    const { t } = useTranslation()
    const tableRef = useRef<HTMLTableElement>(null)
    const [relationData, setRelationData] = useState<RelationshipUi | null>(null)

    const {
        data: relationshipData,
        isLoading: isRelationshipLoading,
        isError: isRelationshipError,
        refetch: refetchRelationship,
    } = useReadRelationship(relationData?.uuid ?? '')
    const {
        data: ciTargetData,
        isLoading: isCiTargetDataLoading,
        isError: isCiTargetDataError,
    } = useReadConfigurationItem(relationData?.endUuid ?? '', { query: { enabled: !!relationData?.endUuid } })
    const {
        data: ciSourceData,
        isLoading: isCiSourceDataLoading,
        isError: isCiSourceDataError,
    } = useReadConfigurationItem(relationData?.startUuid ?? '', { query: { enabled: !!relationData?.startUuid } })

    const {
        data: relationTypeData,
        isLoading: isRelationTypeDataLoading,
        isError: isRelationTypeDataError,
    } = useGetRelationshipTypeWrapper(relationData?.type ?? '', {
        query: { enabled: !!relationData?.uuid },
    })

    const {
        isLoading: isDetailDataLoading,
        isError: isDetailDataError,
        constraintsData,
        unitsData,
    } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const {
        data: ownerData,
        isLoading: isOwnerLoading,
        isError: isOwnerError,
    } = useGetRoleParticipant(relationData?.metaAttributes?.owner ?? '', { query: { enabled: !!relationData?.metaAttributes?.owner } })

    const columns: Array<ColumnDef<RelationshipUi>> = [
        {
            id: 'summary',
            header: t('relationshipList.summary'),
            accessorFn: (row) => row,
            cell: (row) => (
                <a
                    href="#"
                    onClick={(event) => {
                        event.preventDefault()
                        setRelationData(row.row.original)
                    }}
                >
                    <Trans
                        i18nKey="relationshipList.summaryValue"
                        components={{
                            strong: <strong />,
                        }}
                        values={{
                            startName: row.row.original.startName,
                            endName: row.row.original.endName,
                        }}
                    />
                </a>
            ),
            size: 300,
            enableSorting: false,
        },
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
            size: 200,
            accessorFn: (row) => row.startName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
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
            size: 200,
            accessorFn: (row) => row.endName,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
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
            size: 150,
            accessorFn: (row) => row.type,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: false,
        },
    ]

    const isLoading = [isRelationshipLoading, isCiTargetDataLoading, isCiSourceDataLoading, isDetailDataLoading, isOwnerLoading].some((item) => item)
    const isError = [isRelationshipError, isCiTargetDataError, isCiSourceDataError, isDetailDataError, isOwnerError].some((item) => item)

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: '/', icon: HomeIcon },
                    { label: getHowToTranslate(HowTo.EGOV_HOWTO, t), href: RouteNames.HOW_TO_EGOV_COMPONENTS },
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
                                key={seed}
                                id="relType"
                                name="relType"
                                label={t('relationshipList.relType')}
                                options={relTypeOptions}
                                setValue={setValue}
                                defaultValue={filter.relType}
                                //onChange={onRelTypeChange}
                            />

                            <SimpleSelect
                                key={seed + 1}
                                id="sourceType"
                                name="sourceType"
                                label={t('relationshipList.startTypeName')}
                                options={ciTypeOptions}
                                setValue={setValue}
                                defaultValue={filter.sourceType}
                                onChange={onSourceTypeChange}
                                disabled={!!watch('relType')}
                            />

                            <SimpleSelect
                                key={seed + 2}
                                id="targetType"
                                name="targetType"
                                label={t('relationshipList.endTypeName')}
                                options={ciTypeOptions}
                                setValue={setValue}
                                onChange={onTargetTypeChange}
                                defaultValue={filter.targetType}
                                disabled={!!watch('relType')}
                            />
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
                        tableRef={tableRef}
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
                        handlePageChange={(filter) => {
                            handleFilterChange(filter)
                            tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    />
                </QueryFeedback>
            </MainContentWrapper>
            <BaseModal isOpen={relationData !== null} close={() => setRelationData(null)}>
                <div>
                    {relationData && (
                        <>
                            <RelationDetailModalView
                                data={{ relationshipData, relationTypeData, constraintsData, ciSourceData, ciTargetData, ownerData, unitsData }}
                                isLoading={isLoading}
                                isError={isError}
                                refetchRelationship={refetchRelationship}
                            />
                        </>
                    )}
                </div>
                <ModalButtons onClose={() => setRelationData(null)} />
            </BaseModal>
        </>
    )
}
