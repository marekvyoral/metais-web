import { CheckBox, ISelectColumnType, ISelectSectionType, TextBody } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { INeighboursFilter, mapFilterToRelationApi } from '@isdd/metais-common/api/filter/filterApi'
import {
    ConfigurationItemUiAttributes,
    NeighbourPairUi,
    NeighboursFilterUi,
    useGetRoleParticipantBulk,
    useReadCiNeighbours,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    CiType,
    RelationshipTypePreviewList,
    useGetCiType,
    useListRelatedCiTypes,
    useListRelationshipTypes,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetRelationColumnData } from '@isdd/metais-common/api/hooks/containers/relationContainerHelpers'
import { RelationSelectedRowType } from '@isdd/metais-common/api/userConfigKvRepo'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { useEntityRelationshipTabFilters } from '@isdd/metais-common/hooks/useEntityRelationshipTabFilters'
import { CellContext, ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getOwnerInformation } from '@/componentHelpers/ci/ciTableHelpers'
import { mapNeighboursSetSourceToPagination, mapNeighboursSetTargetToPagination } from '@/componentHelpers/pagination'
import { NeighboursApiType } from '@/components/views/relationships/RelationshipsAccordion'

export interface ICiNeighboursListContainerView {
    data?: NeighbourPairUi[]
    ciTypeData?: CiType
    relationList?: RelationshipTypePreviewList
    pagination: Pagination
    filter?: IFilter
    columns: ColumnDef<NeighbourPairUi>[]
    selectedColumns: ISelectColumnType[]
    rowSelections: RelationSelectedRowType
    sectionsConfig: ISelectSectionType[]
    refetch: () => void
    saveSelectedColumns: (columnSelection: ISelectColumnType[]) => void
    resetSelectedColumns: () => Promise<void>
    apiFilterData?: NeighboursFilterUi
    handleFilterChange: (filter: INeighboursFilter) => void
    isLoading: boolean
    isError: boolean
    isSource: boolean
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

    const { t } = useTranslation()

    const [uiFilterState, setUiFilterState] = useState<INeighboursFilter>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        sort: [],
    })

    const [rowSelection, setRowSelection] = useState<RelationSelectedRowType>({})

    const handleFilterChange = (filter: INeighboursFilter) => {
        setUiFilterState({
            ...uiFilterState,
            ...filter,
        })
    }

    const {
        isLoading: isEntityRelationsLoading,
        isError: isEntityRelationsError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    } = useEntityRelationshipTabFilters(entityName ?? '')

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName)
    const { data: relationData, isLoading: isRelationListLoading, isError: isRelationListError } = useListRelationshipTypes({ filter: {} })
    const { isLoading: isLoadingRelated, isError: isErrorRelated, data: relatedTypes } = useListRelatedCiTypes(entityName)
    const types = useMemo(() => (relatedTypes?.cisAsSources || []).concat(relatedTypes?.cisAsTargets || []), [relatedTypes])

    const selectedRequestApi = apiType === NeighboursApiType.source ? defaultSourceRelationshipTabFilter : defaultTargetRelationshipTabFilter

    const {
        isLoading: isRelationLoading,
        isError: isRelationError,
        data: tableData,
        refetch,
    } = useReadCiNeighbours(configurationItemId ?? '', mapFilterToRelationApi(uiFilterState, selectedRequestApi), {})

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
            const isEntityType = technicalName === 'entityType'
            const isState = technicalName === 'relationState'
            const isRelationType = technicalName === 'relationType'
            const isOwner = technicalName === 'ciOwner'
            const isName = technicalName === 'ciName'

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
                    return t(`metaAttributes.state.${ctx.row.original.configurationItem?.metaAttributes?.state}`)
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
        const list: ColumnDef<NeighbourPairUi>[] = selectedColumns
            .filter((e) => e.selected)
            .map((e) => ({
                id: e.technicalName,
                header: e.name,
                accessorKey: e.technicalName,
                enableSorting: true,
                cell: (ctx: CellContext<NeighbourPairUi, unknown>) => (
                    <TextBody lang={setEnglishLangForAttr(e.technicalName ?? '')} size="S" className={'marginBottom0'}>
                        {getColumnsFromApiCellContent(ctx, e.technicalName)}
                    </TextBody>
                ),
                meta: {
                    getCellContext: (ctx: CellContext<NeighbourPairUi, unknown>) => getColumnsFromApiCellContent(ctx, e.technicalName),
                },
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
                refetch={refetch}
                selectedColumns={selectedColumns}
                sectionsConfig={configSections}
                rowSelections={rowSelection}
                saveSelectedColumns={storeColumns}
                resetSelectedColumns={restoreColumns}
                handleFilterChange={handleFilterChange}
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
            refetch={refetch}
            ciTypeData={ciTypeData}
            rowSelections={rowSelection}
            saveSelectedColumns={storeColumns}
            resetSelectedColumns={restoreColumns}
            apiFilterData={selectedRequestApi.neighboursFilter}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
