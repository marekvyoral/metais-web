import { CheckBox, ISelectColumnType, ISelectSectionType } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, IFilter, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { INeighboursFilter, mapFilterToRelationApi } from '@isdd/metais-common/api/filter/filterApi'
import {
    ConfigurationItemUiAttributes,
    NeighbourPairUi,
    NeighbourSetUi,
    useGetRoleParticipantBulk,
    useReadCiNeighboursHook,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CiType, RelationshipTypePreviewList, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { GENERIC_NAMES, useGetRelationColumnData } from '@isdd/metais-common/api/hooks/containers/relationContainerHelpers'
import { RelationSelectedRowType } from '@isdd/metais-common/api/userConfigKvRepo'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { RELATIONSHIP_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { IRelationshipTabFilters, useEntityRelationshipTabFilters } from '@isdd/metais-common/hooks/useEntityRelationshipTabFilters'
import { useListRelatedCiTypesWrapper } from '@isdd/metais-common/hooks/useListRelatedCiTypes.hook'
import { CellContext, ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getOwnerInformation } from '@/componentHelpers/ci/ciTableHelpers'
import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'
import { LangWrapper } from '@/components/lang-wrapper/LangWrapper'
import { NeighboursApiType } from '@/components/views/relationships/RelationshipsAccordion'

interface ICallReadCiNeighbours {
    fullTextSearch?: string
    pageNumber?: number
    reset?: boolean
    sort?: ColumnSort[]
}

export interface ICiNeighboursListContainerView {
    data?: NeighbourPairUi[]
    ciTypeData?: CiType
    relationList?: RelationshipTypePreviewList
    pagination: Pagination
    filter?: IFilter
    columns: ColumnDef<NeighbourPairUi>[]
    selectedColumns: ISelectColumnType[]
    rowSelections: RelationSelectedRowType
    resetRowSelection: () => void
    sectionsConfig: ISelectSectionType[]
    callReadCiNeighbours: (params: ICallReadCiNeighbours) => void
    saveSelectedColumns: (columnSelection: ISelectColumnType[]) => void
    resetSelectedColumns: () => Promise<void>
    apiFilterData?: IRelationshipTabFilters
    handleFilterChange: (filter: INeighboursFilter) => void
    isLoading: boolean
    isError: boolean
    isSource: boolean
    uiFilterState: INeighboursFilter
}

interface ICiNeighboursListContainer {
    configurationItemId?: string
    View: React.FC<ICiNeighboursListContainerView>
    apiType: NeighboursApiType
    entityName: string
}

export const CiNeighboursListContainer: React.FC<ICiNeighboursListContainer> = ({
    configurationItemId,
    View,
    apiType = NeighboursApiType.source,
    entityName,
}) => {
    const { selectedColumns, configSections, columnEnumList, enumData, storeColumns, restoreColumns } = useGetRelationColumnData(
        entityName,
        apiType === NeighboursApiType.source,
    )

    const { t, i18n } = useTranslation()

    const defaultValues = useMemo(
        () => ({
            pageNumber: BASE_PAGE_NUMBER,
            pageSize: BASE_PAGE_SIZE,
            sort: [{ orderBy: GENERIC_NAMES.CI_TYPE, sortDirection: SortType.DESC }],
        }),
        [],
    )
    const [uiFilterState, setUiFilterState] = useState<INeighboursFilter>(defaultValues)

    const [isRelationLoading, setIsRelationLoading] = useState<boolean>(false)
    const [isRelationError, setIsRelationError] = useState<boolean>(false)
    const [tableData, setTableData] = useState<NeighbourSetUi>({})

    const [rowSelection, setRowSelection] = useState<RelationSelectedRowType>({})

    const {
        isLoading: isEntityRelationsLoading,
        isError: isEntityRelationsError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    } = useEntityRelationshipTabFilters(entityName ?? '')
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeWrapper(entityName)
    const {
        data: relationData,
        isLoading: isRelationListLoading,
        isError: isRelationListError,
    } = useListRelationshipTypes({ filter: {} }, { query: { queryKey: [RELATIONSHIP_TYPES_QUERY_KEY, i18n.language] } })

    const {
        isLoading: isLoadingRelated,
        isError: isErrorRelated,
        data: relatedTypes,
    } = useListRelatedCiTypesWrapper(entityName, { query: { queryKey: [entityName, i18n.language] } })
    const types = useMemo(() => (relatedTypes?.cisAsSources || []).concat(relatedTypes?.cisAsTargets || []), [relatedTypes])

    const selectedRequestApi = useMemo(
        () => (apiType === NeighboursApiType.source ? defaultSourceRelationshipTabFilter : defaultTargetRelationshipTabFilter),
        [apiType, defaultSourceRelationshipTabFilter, defaultTargetRelationshipTabFilter],
    )

    const readCiNeighbours = useReadCiNeighboursHook()

    const callReadCiNeighbours = useCallback(
        ({ fullTextSearch, pageNumber, reset, sort }: ICallReadCiNeighbours) => {
            setIsRelationLoading(true)
            let filter: INeighboursFilter = {
                ...uiFilterState,
                sort: sort ?? uiFilterState.sort,
                pageNumber: pageNumber ?? uiFilterState.pageNumber,
                neighboursFilter: {
                    ...uiFilterState.neighboursFilter,
                    fullTextSearch: fullTextSearch ?? uiFilterState.neighboursFilter?.fullTextSearch,
                },
            }
            if (sort) {
                setUiFilterState({ ...uiFilterState, sort: sort })
            }
            if (pageNumber) {
                setUiFilterState({ ...uiFilterState, pageNumber: pageNumber })
            }
            if (reset) {
                setUiFilterState(defaultValues)
                filter = defaultValues
            }
            readCiNeighbours(configurationItemId ?? '', mapFilterToRelationApi(filter, selectedRequestApi))
                .then((resp) => setTableData(resp))
                .catch(() => {
                    setIsRelationError(true)
                })
                .finally(() => setIsRelationLoading(false))
        },
        [configurationItemId, defaultValues, readCiNeighbours, selectedRequestApi, uiFilterState],
    )

    useEffect(() => {
        if (configurationItemId && (selectedRequestApi.neighboursFilter.ciType.length || selectedRequestApi.neighboursFilter.relType.length)) {
            callReadCiNeighbours({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configurationItemId, selectedRequestApi])

    const neighbourPairs = tableData?.[apiType === NeighboursApiType.source ? 'fromNodes' : 'toNodes']?.neighbourPairs

    const ownerGids = new Set(neighbourPairs?.map((item) => item.configurationItem?.metaAttributes?.owner ?? ''))
    const {
        data: gestorsData,
        isLoading: isGestorsLoading,
        isError: isGestorsError,
        fetchStatus,
    } = useGetRoleParticipantBulk({ gids: [...ownerGids] }, { query: { enabled: !!tableData && ownerGids && [...ownerGids]?.length > 0 } })

    const pagination =
        apiType === NeighboursApiType.source
            ? mapNeighboursSetSourceToPagination(uiFilterState, tableData)
            : mapNeighboursSetTargetToPagination(uiFilterState, tableData)

    const getColumnsFromApiCellContent = useCallback(
        (ctx: CellContext<NeighbourPairUi, unknown>, technicalName: string) => {
            const isEntityType = technicalName === GENERIC_NAMES.CI_TYPE
            const isState = technicalName === GENERIC_NAMES.RELATION_STATE
            const isRelationType = technicalName === GENERIC_NAMES.RELATION_TYPE
            const isOwner = technicalName === GENERIC_NAMES.CI_OWNER
            const isName = technicalName === GENERIC_NAMES.CI_NAME

            const enumItem = columnEnumList.find((item) => item.technicalName === technicalName)

            const isEnum = !!enumItem

            const enumValues: EnumItem[] = enumData.find((item) => item.code === enumItem?.enumCode)?.enumItems ?? []

            switch (true) {
                case isEntityType: {
                    const entity = types.find((i) => i.ciTypeTechnicalName === ctx.row.original.configurationItem?.type)
                    return entity?.ciTypeName ?? ''
                }
                case isRelationType: {
                    const relation = relationData?.results?.find((i) => i.technicalName === ctx.row.original.relationship?.type)
                    return relation?.name ?? ''
                }
                case isName: {
                    return ctx?.row?.original?.configurationItem?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                }
                case isState: {
                    return t(`metaAttributes.state.${ctx.row.original.relationship?.metaAttributes?.state}`)
                }
                case isOwner: {
                    return getOwnerInformation(ctx?.row?.original?.configurationItem?.metaAttributes?.owner as string, gestorsData)
                        ?.configurationItemUi?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                }
                case isEnum: {
                    return enumValues.find(
                        (item) => item.code === (ctx?.row?.original?.relationship?.attributes as ConfigurationItemUiAttributes)?.[technicalName],
                    )?.value
                }
                default: {
                    return ''
                }
            }
        },
        [columnEnumList, enumData, gestorsData, relationData?.results, t, types],
    )

    const handleCheckboxChange = useCallback(
        (row: Row<NeighbourPairUi>) => {
            if (row.original.relationship?.uuid && rowSelection) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.relationship.uuid]) {
                    delete newRowSelection[row.original.relationship.uuid]
                } else {
                    newRowSelection[row.original.relationship.uuid] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection],
    )

    const handleAllCheckboxChange = useCallback(
        (rows: NeighbourPairUi[]) => {
            const checked = rows.every(({ relationship }) => {
                return relationship ? !!rowSelection[relationship.uuid ?? ''] : false
            })
            const newRowSelection = { ...rowSelection }
            if (checked) {
                rows.forEach(({ relationship }) => relationship && delete newRowSelection[relationship.uuid ?? ''])
                setRowSelection(newRowSelection)
            } else {
                const selectedAllRows = rows.reduce((result: { [key: string]: NeighbourPairUi }, item) => {
                    if (item?.relationship?.uuid) {
                        result[item.relationship.uuid] = item
                    }
                    return result
                }, {})
                setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...selectedAllRows }))
            }
        },
        [rowSelection],
    )

    const columns = useMemo<Array<ColumnDef<NeighbourPairUi>>>(() => {
        const sortableCols: string[] = [GENERIC_NAMES.CI_NAME, GENERIC_NAMES.CI_TYPE, GENERIC_NAMES.RELATION_STATE, GENERIC_NAMES.RELATION_TYPE]
        const list: ColumnDef<NeighbourPairUi>[] = selectedColumns
            .filter((e) => e.selected)
            .map((e) => ({
                id: e.technicalName,
                header: e.name,
                accessorKey: e.technicalName,
                enableSorting: sortableCols.includes(e.technicalName),
                cell: (ctx: CellContext<NeighbourPairUi, unknown>) => (
                    <LangWrapper lang={setEnglishLangForAttr(e.technicalName ?? '')}>
                        {getColumnsFromApiCellContent(ctx, e.technicalName)}
                    </LangWrapper>
                ),
                meta: {
                    getCellContext: (ctx: CellContext<NeighbourPairUi, unknown>) => getColumnsFromApiCellContent(ctx, e.technicalName),
                },
                size: 150,
            }))
        return [
            {
                header: ({ table }: { table: ITable<NeighbourPairUi> }) => {
                    const tableRows = table.getRowModel().rows
                    const checked =
                        tableRows.every((row) => (row.original.relationship?.uuid ? !!rowSelection[row.original.relationship.uuid] : false)) &&
                        tableRows.length > 0
                    return (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id="checkbox-all"
                                value="checkbox-all"
                                onChange={(event) => {
                                    event.stopPropagation()
                                    handleAllCheckboxChange(neighbourPairs ?? [])
                                }}
                                onClick={(event) => event.stopPropagation()}
                                checked={checked}
                                title={t('table.selectAllItems')}
                            />
                        </div>
                    )
                },
                id: CHECKBOX_CELL,
                cell: ({ row }: { row: Row<NeighbourPairUi> }) => (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            title={`checkbox_${row.id}`}
                            name="checkbox"
                            id={`checkbox_${row.id}`}
                            value="true"
                            onChange={(event) => {
                                event.stopPropagation()
                                handleCheckboxChange(row)
                            }}
                            onClick={(event) => event.stopPropagation()}
                            checked={row.original.relationship?.uuid ? !!rowSelection[row.original.relationship.uuid] : false}
                        />
                    </div>
                ),
            },
            ...list,
        ]
    }, [getColumnsFromApiCellContent, handleAllCheckboxChange, handleCheckboxChange, rowSelection, selectedColumns, t, neighbourPairs])

    const isGestorsLoadingCombined = isGestorsLoading && fetchStatus != 'idle'
    const isLoading = [
        isRelationLoading,
        isCiTypeDataLoading,
        isLoadingRelated,
        isRelationListLoading,
        isGestorsLoadingCombined,
        isEntityRelationsLoading && isRelationLoading,
    ].some((item) => item)
    const isError = [
        isRelationError,
        isCiTypeDataError,
        isErrorRelated,
        isRelationListError,
        isGestorsError,
        isEntityRelationsError,
        isRelationError,
    ].some((item) => item)

    if (!configurationItemId)
        return (
            <View
                pagination={pagination}
                columns={columns}
                ciTypeData={ciTypeData}
                isSource
                selectedColumns={selectedColumns}
                sectionsConfig={configSections}
                rowSelections={rowSelection}
                resetRowSelection={() => setRowSelection({})}
                callReadCiNeighbours={callReadCiNeighbours}
                uiFilterState={uiFilterState}
                saveSelectedColumns={storeColumns}
                resetSelectedColumns={restoreColumns}
                handleFilterChange={setUiFilterState}
                isLoading={false}
                isError
            />
        )
    return (
        <View
            data={neighbourPairs}
            pagination={pagination}
            filter={uiFilterState}
            columns={columns}
            selectedColumns={selectedColumns}
            sectionsConfig={configSections}
            isSource
            ciTypeData={ciTypeData}
            rowSelections={rowSelection}
            uiFilterState={uiFilterState}
            resetRowSelection={() => setRowSelection({})}
            callReadCiNeighbours={callReadCiNeighbours}
            saveSelectedColumns={storeColumns}
            resetSelectedColumns={restoreColumns}
            apiFilterData={selectedRequestApi}
            handleFilterChange={setUiFilterState}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
