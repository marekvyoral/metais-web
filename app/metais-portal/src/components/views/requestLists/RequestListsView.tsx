import {
    BaseModal,
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    Filter,
    HomeIcon,
    Input,
    MultiSelect,
    PaginatorWrapper,
    SimpleSelect,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { ApiCodelistItemName, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, RequestListState } from '@isdd/metais-common/constants'
import { ActionsOverTable, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RequestListActions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { TextClickable } from '@/components/views/codeLists/components/TextClickable/TextClickable'
import { CodeListFilterOnlyBase, CodeListListFilterData, defaultFilterValues } from '@/components/containers/CodeListListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RequestListViewProps } from '@/components/containers/RequestListContainer'

const selectBasedOnLanguage = (languageData: Array<ApiCodelistItemName>, appLanguage: string) => {
    const translatedName = languageData?.find((item) => item.language === appLanguage)?.value
    return translatedName ?? languageData?.find(() => true)?.value
}

export const RequestListsView: React.FC<RequestListViewProps> = ({ data, filter, handleFilterChange, isLoading, entityName }) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        state: { userInfo: user },
    } = useAuth()
    const userAbility = useAbilityContext()

    const [lockedDialogData, setLockedDialogData] = useState<{ id?: number; lockedBy?: string; isOpened: boolean }>({ isOpened: false })
    const {
        isActionSuccess: { value: isSuccess },
    } = useActionSuccess()

    const columns: Array<ColumnDef<ApiCodelistPreview>> = [
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

                return locked && user?.login !== lockedBy ? (
                    <TextClickable
                        onClick={() => {
                            setLockedDialogData({ lockedBy, id, isOpened: true })
                        }}
                    >
                        {name}
                    </TextClickable>
                ) : (
                    <TextLink to={`${RouteNames.REQUESTLIST}/${id}`}>{name}</TextLink>
                )
            },
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
        {
            id: 'codelistState',
            header: t('state'),
            accessorFn: (row) => row.codelistState,
            enableSorting: true,
            cell: (row) => {
                return t(`codeListList.state.${row.getValue()}`)
            },
        },
    ]

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.CODELISTS },
                    { label: t('codeList.breadcrumbs.requestList'), href: RouteNames.REQUESTLIST },
                ]}
            />
            {userAbility.can(RequestListActions.SHOW, entityName) && (
                <MainContentWrapper>
                    {isSuccess && <MutationFeedback success error={false} />}
                    <QueryFeedback loading={isLoading} error={false} withChildren>
                        <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>

                        <Filter<CodeListListFilterData>
                            heading={t('codeListList.filter.title')}
                            defaultFilterValues={defaultFilterValues}
                            form={({ filter: formFilter, register, setValue }) => (
                                <div>
                                    <MultiSelect
                                        id="wfState"
                                        name="wfState"
                                        label={t('codeListList.filter.state')}
                                        options={Object.values(RequestListState).map((state) => ({
                                            value: state,
                                            label: t(`codeListList.state.${state}`),
                                        }))}
                                        setValue={setValue}
                                        defaultValue={[...(formFilter.wfState || defaultFilterValues.wfState)]}
                                    />
                                    <Input {...register('code')} type="text" label={t('codeListList.filter.code')} />
                                    <Input {...register('name')} type="text" label={t('codeListList.filter.name')} />
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
                                </div>
                            )}
                        />
                        <ActionsOverTable
                            entityName="requestList"
                            createButton={
                                userAbility.can(RequestListActions.CREATE, entityName) && (
                                    <CreateEntityButton
                                        onClick={() => navigate(`${RouteNames.CREATEREQUEST}`, { state: { from: location } })}
                                        label={t('codeListList.requestCreate.addItemBtn')}
                                    />
                                )
                            }
                            handleFilterChange={handleFilterChange}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                        />
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
                                    onClick={() => navigate(`${RouteNames.CODELISTS}/${lockedDialogData.id}/detail`)}
                                />
                                <Button
                                    label={t('codeListList.lockedModal.button.currentRevision')}
                                    onClick={() => navigate(`${RouteNames.CODELISTS}/${lockedDialogData.id}/detail`)}
                                />
                            </ButtonGroupRow>
                        </BaseModal>
                    </QueryFeedback>
                </MainContentWrapper>
            )}
        </>
    )
}

export default RequestListsView
