import {
    BaseModal,
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    Filter,
    HomeIcon,
    Input,
    PaginatorWrapper,
    SimpleSelect,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistItemName, ApiCodelistManager, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useNavigate } from 'react-router-dom'
import { SelectFilterOrganization } from '@isdd/metais-common/components/select-organization/SelectFilterOrganization'

import { TextClickable } from './components/TextClickable/TextClickable'

import {
    CodeListFilterOnlyBase,
    CodeListListFilterData,
    CodeListListViewProps,
    CodeListState,
    defaultFilterValues,
} from '@/components/containers/CodeListListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const selectBasedOnLanguage = (languageData: Array<ApiCodelistItemName>, appLanguage: string) => {
    const translatedName = languageData?.find((item) => item.language === appLanguage)?.value
    return translatedName ?? languageData?.find(() => true)?.value
}

const getMainGestor = (codeListManager: ApiCodelistManager[], roleParticipants: RoleParticipantUI[]) => {
    if (!codeListManager.length) {
        return null
    }
    const id = codeListManager?.[0].value
    const participant = roleParticipants.find((item) => item.gid === id)
    return participant?.configurationItemUi?.attributes?.Gen_Profil_nazov
}

export const CodeListListView: React.FC<CodeListListViewProps> = ({
    data,
    filter,
    handleFilterChange,
    isOnlyPublishedPage = false,
    isError,
    isLoading,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { userInfo } = useAuth()

    const [lockedDialogData, setLockedDialogData] = useState<{ id?: number; lockedBy?: string; isOpened: boolean }>({ isOpened: false })

    const columns: Array<ColumnDef<ApiCodelistPreview>> = [
        {
            id: 'codelistName',
            header: t('codeListList.table.name'),
            accessorFn: (row) => row.codelistNames,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => selectBasedOnLanguage(ctx.getValue() as ApiCodelistItemName[], i18n.language),
            },
            cell: (row) => {
                const { id, locked, lockedBy } = row.row.original
                const name = selectBasedOnLanguage(row.getValue() as ApiCodelistItemName[], i18n.language)

                return locked && userInfo?.login !== lockedBy ? (
                    <TextClickable
                        onClick={() => {
                            setLockedDialogData({ lockedBy, id, isOpened: true })
                        }}
                    >
                        {name}
                    </TextClickable>
                ) : (
                    <TextLink to={`${RouteNames.CODELISTS}/${id}`}>{name}</TextLink>
                )
            },
        },
        {
            id: 'code',
            header: t('codeListList.table.code'),
            accessorFn: (row) => row.code,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: true,
        },
        {
            id: 'mainGestor',
            header: t('codeListList.table.mainGestor'),
            accessorFn: (row) => row.mainCodelistManagers,
            meta: {
                getCellContext: (ctx) => getMainGestor(ctx.getValue() as ApiCodelistManager[], data?.roleParticipants || []),
            },
            cell: (row) => getMainGestor(row.getValue() as ApiCodelistManager[], data?.roleParticipants || []),
        },
        {
            id: 'effectiveFrom',
            header: t('codeListList.table.effectiveFrom'),
            accessorFn: (row) => row.effectiveFrom,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => t('date', { date: ctx.getValue() as string }),
            },
            cell: (row) => t('date', { date: row.getValue() as string }),
        },
        {
            id: 'base',
            header: t('codeListList.table.isBase'),
            accessorFn: (row) => row.base,
            enableSorting: true,
            cell: (row) => {
                return row.getValue() ? t('radioButton.yes') : t('radioButton.no')
            },
        },
    ]

    if (!isOnlyPublishedPage) {
        columns.push({
            id: 'codelistState',
            header: t('state'),
            accessorFn: (row) => row.codelistState,
            enableSorting: true,
            cell: (row) => {
                return t(`codeListList.state.${row.getValue()}`)
            },
        })
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    isOnlyPublishedPage
                        ? { label: t('codeList.breadcrumbs.publicCodeListsList'), href: NavigationSubRoutes.PUBLIKOVANE_CISELNIKY }
                        : { label: t('codeList.breadcrumbs.codeListsList'), href: NavigationSubRoutes.CISELNIKY },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('codeListList.title')}</TextHeading>
                        {isError && <QueryFeedback error={isError} loading={false} />}
                    </FlexColumnReverseWrapper>
                    {isOnlyPublishedPage ? (
                        <TextHeading size="L">{t('codeListList.publicCodeListSubtitle')}</TextHeading>
                    ) : (
                        <TextHeading size="L">{t('codeListList.codeListSubtitle')}</TextHeading>
                    )}

                    <Filter<CodeListListFilterData>
                        heading={t('codeList.filter.title')}
                        defaultFilterValues={defaultFilterValues}
                        form={({ filter: formFilter, register, setValue }) => (
                            <div>
                                <SelectFilterOrganization<CodeListListFilterData>
                                    label={t('codeListList.filter.mainGestor')}
                                    name="mainGestorPoUuid"
                                    filter={formFilter}
                                    setValue={setValue}
                                />
                                <Input {...register('toDate')} type="date" label={t('codeListList.filter.toDate')} />
                                <SimpleSelect
                                    id="onlyBase"
                                    name="onlyBase"
                                    label={t('codeListList.filter.onlyBase.label')}
                                    options={[
                                        { value: CodeListFilterOnlyBase.TRUE, label: t('codeListList.filter.onlyBase.true') },
                                        { value: CodeListFilterOnlyBase.FALSE, label: t('codeListList.filter.onlyBase.false') },
                                    ]}
                                    setValue={setValue}
                                    defaultValue={formFilter.onlyBase || defaultFilterValues.onlyBase}
                                />
                                {!isOnlyPublishedPage && (
                                    <>
                                        <SimpleSelect
                                            id="wfState"
                                            name="wfState"
                                            label={t('codeListList.filter.state')}
                                            options={Object.values(CodeListState).map((state) => ({
                                                value: state,
                                                label: t(`codeListList.state.${state}`),
                                            }))}
                                            setValue={setValue}
                                            defaultValue={formFilter.wfState || defaultFilterValues.wfState}
                                        />
                                        <Input {...register('code')} type="text" label={t('codeListList.filter.code')} />
                                        <Input {...register('name')} type="text" label={t('codeListList.filter.name')} />
                                    </>
                                )}
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
                    <BaseModal isOpen={lockedDialogData.isOpened} close={() => setLockedDialogData({ ...lockedDialogData, isOpened: false })}>
                        <TextBody>{t('codeListList.lockedModal.text', { lockedBy: lockedDialogData.lockedBy })}</TextBody>
                        <ButtonGroupRow>
                            <Button
                                label={t('codeListList.lockedModal.button.lastSavedRevision')}
                                onClick={() => navigate(`${RouteNames.CODELISTS}/${lockedDialogData.id}`)}
                            />
                            <Button
                                label={t('codeListList.lockedModal.button.currentRevision')}
                                onClick={() => navigate(`${RouteNames.CODELISTS}/${lockedDialogData.id}`)}
                            />
                        </ButtonGroupRow>
                    </BaseModal>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default CodeListListView
