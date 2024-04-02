import { PaginatorWrapper, Table, Tabs } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MetainformationColumns } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { DEFAULT_PAGESIZE_OPTIONS, ENTITY_AGENDA, ENTITY_ZS } from '@isdd/metais-common/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Link } from 'react-router-dom'

import { KrisData, KrisKeysToDisplayType, KrisRelatedPagination } from '@/components/containers/KrisRelatedContainer'
import { LangWrapper } from '@/components/lang-wrapper/LangWrapper'

type Props = {
    handleFilterChange: (pageNumber: number, pageSize: number, krisTabType: string) => void
    pagination: KrisRelatedPagination
    isError: boolean
    isLoading: boolean
    isListLoading: boolean
    data: KrisData
    keysToDisplay: KrisKeysToDisplayType[]
    currentTab: string
}

export const KrisRelatedItemsView: React.FC<Props> = ({
    pagination,
    isLoading,
    isError,
    handleFilterChange,
    data,
    keysToDisplay,
    currentTab,
    isListLoading,
}) => {
    const { t } = useTranslation()
    const { zsData, agendaData, ciListData } = data
    const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
    const endOfList = pagination.pageNumber * pagination.pageSize
    const tableRef = useRef<HTMLTableElement>(null)

    const columns: Array<ColumnDef<ConfigurationItemUi>> = [
        {
            id: ATTRIBUTE_NAME.Gen_Profil_nazov,
            accessorFn: (row) => row.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            header: t('KRIS.table.name'),
            cell: (ctx: CellContext<ConfigurationItemUi, unknown>) => (
                <LangWrapper lang={setEnglishLangForAttr(ATTRIBUTE_NAME.Gen_Profil_nazov)}>
                    <Link to={`/ci/${currentTab}/${ctx.row.original.uuid}`}>{ctx.getValue() as string}</Link>
                </LangWrapper>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) => {
                    ctx.getValue() as string
                },
            },
            enableSorting: true,
        },
        {
            id: ATTRIBUTE_NAME.Gen_Profil_kod_metais,
            accessorFn: (row) => row.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
            header: t('KRIS.table.code'),
            cell: (ctx: CellContext<ConfigurationItemUi, unknown>) => (
                <LangWrapper lang={setEnglishLangForAttr(ATTRIBUTE_NAME.Gen_Profil_nazov)}>{ctx.getValue() as string}</LangWrapper>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) => {
                    ctx.getValue() as string
                },
            },
            enableSorting: true,
        },
        {
            id: MetainformationColumns.STATE,
            accessorFn: (row) => row.metaAttributes?.[MetainformationColumns.STATE],
            header: t('KRIS.table.state'),
            cell: (ctx: CellContext<ConfigurationItemUi, unknown>) => (
                <LangWrapper lang={setEnglishLangForAttr(ATTRIBUTE_NAME.Gen_Profil_nazov)}>{t(`metaAttributes.state.${ctx.getValue()}`)}</LangWrapper>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) => {
                    t(`metaAttributes.state.${ctx.getValue()}`)
                },
            },
            enableSorting: true,
        },
    ]

    return (
        <QueryFeedback loading={isLoading} error={false}>
            <Tabs
                tabList={keysToDisplay?.map((key) => {
                    const isZs = key.technicalName === ENTITY_ZS
                    const isAgenda = key.technicalName === ENTITY_AGENDA

                    const dataForTable = isAgenda
                        ? agendaData?.slice(startOfList, endOfList)
                        : isZs
                        ? zsData?.slice(startOfList, endOfList)
                        : ciListData?.configurationItemSet

                    const totalItems = (isAgenda ? agendaData?.length : isZs ? zsData?.length : ciListData?.pagination?.totaltems) ?? 0

                    return {
                        id: key.technicalName,
                        title: key?.title + `(${key.count ?? 0})`,
                        content: (
                            <QueryFeedback
                                loading={isListLoading}
                                error={isError}
                                errorProps={{ errorMessage: t('feedback.failedFetch') }}
                                withChildren
                            >
                                <ActionsOverTable
                                    entityName=""
                                    pagination={{ ...pagination, dataLength: totalItems }}
                                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    hiddenButtons={{ SELECT_COLUMNS: true }}
                                    handleFilterChange={({ pageNumber, pageSize }) => {
                                        handleFilterChange(pageNumber ?? pagination.pageNumber, pageSize ?? pagination.pageSize, key.technicalName)
                                    }}
                                />
                                <Table tableRef={tableRef} isLoading={isListLoading} error={isError} columns={columns} data={dataForTable} />
                                <PaginatorWrapper
                                    pageNumber={pagination.pageNumber}
                                    pageSize={pagination.pageSize}
                                    dataLength={totalItems}
                                    handlePageChange={({ pageNumber }) => {
                                        handleFilterChange(pageNumber ?? BASE_PAGE_NUMBER, pagination.pageSize, key.technicalName)
                                        tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                />
                            </QueryFeedback>
                        ),
                    }
                })}
                onSelect={(selected) => {
                    handleFilterChange(BASE_PAGE_NUMBER, BASE_PAGE_SIZE, selected.id)
                }}
            />
        </QueryFeedback>
    )
}
