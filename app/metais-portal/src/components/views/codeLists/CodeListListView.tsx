import { BreadCrumbs, CheckBox, Filter, HomeIcon, Input, PaginatorWrapper, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { RoleParticipantUI } from '@isdd/metais-common/api'
import { ApiCodelistItemName, ApiCodelistManager, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SelectFilterOrganization } from './components/SelectFilterMainGestor/SelectFilterMainGestor'

import { CodeListListFilterData, CodeListListViewProps, defaultFilterValues } from '@/components/containers/CodeListListContainer'

export const CodeListListView: React.FC<CodeListListViewProps> = ({ data, filter, handleFilterChange }) => {
    const { t, i18n } = useTranslation()

    const selectBasedOnLanguage = (languageData: Array<ApiCodelistItemName>, appLanguage: string) => {
        const translatedName = languageData?.find((item) => item.language === appLanguage)?.value
        return translatedName ?? languageData?.find(() => true)?.value
    }

    const getMainGestor = (codeListManager: ApiCodelistManager[], roleParticipants: RoleParticipantUI[]) => {
        const id = codeListManager?.[0].value
        const participant = roleParticipants.find((item) => item.gid === id)
        return participant?.configurationItemUi?.attributes?.Gen_Profil_nazov
    }

    const columns: Array<ColumnDef<ApiCodelistPreview>> = [
        {
            id: 'code',
            header: t('codeList.table.code'),
            accessorFn: (row) => row.code,
            enableSorting: true,
        },
        {
            id: 'name',
            header: t('codeList.table.name'),
            accessorFn: (row) => row.codelistNames,
            enableSorting: true,
            cell: (row) => {
                const { id } = row.row.original
                const name = selectBasedOnLanguage(row.getValue() as ApiCodelistItemName[], i18n.language)
                return <TextLink to={`${RouteNames.CODELISTS}/${id}/detail`}>{name}</TextLink>
            },
        },
        {
            id: 'mainGestor',
            header: t('codeList.table.mainGestor'),
            accessorFn: (row) => row.mainCodelistManagers,
            enableSorting: true,
            cell: (row) => getMainGestor(row.getValue() as ApiCodelistManager[], data?.roleParticipants || []),
        },
        {
            id: 'effectiveFrom',
            header: t('codeList.table.effectiveFrom'),
            accessorFn: (row) => row.effectiveFrom,
            enableSorting: true,
            cell: (row) => t('date', { date: row.getValue() as string }),
        },
        {
            id: 'isBase',
            header: t('codeList.table.isBase'),
            accessorFn: (row) => row.base,
            enableSorting: true,
            cell: (row) => {
                return row.getValue() ? t('radioButton.yes') : t('radioButton.no')
            },
        },
    ]

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    { label: t('codeList.breadcrumbs.publicCodeLists'), href: NavigationSubRoutes.CISELNIKY },
                ]}
            />
            <TextHeading size="XL">{t('codeList.title')}</TextHeading>
            <TextHeading size="L">{t('codeList.publicCodelistSubtitle')}</TextHeading>
            <Filter<CodeListListFilterData>
                heading={t('codeList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter: formFilter, register, setValue }) => (
                    <div>
                        <SelectFilterOrganization filter={formFilter} setValue={setValue} />
                        <Input {...register('toDate')} type="date" label={t('codeList.filter.toDate')} />
                        <CheckBox {...register('onlyBase')} id="onlyBase" label={t('codeList.filter.onlyBase')} />
                    </div>
                )}
            />
            <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
            <Table
                data={data?.list}
                columns={columns}
                sort={filter.sort ?? []}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={data?.dataLength || 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}

export default CodeListListView
