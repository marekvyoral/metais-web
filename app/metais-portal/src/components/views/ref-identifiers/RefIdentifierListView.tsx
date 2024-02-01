import { Filter, Input, MultiSelect, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { ActionsOverTable, CreateEntityButton, MutationFeedback, QueryFeedback, RefIdentifierTypeEnum } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { refIdentifierColumns, refIdentifierStateOptions, refIdentifierTypeOptions, refIdentifierViewOptions } from './refIdentifierListProps'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { RefIdentifierListFilterData, RefIdentifiersContainerViewProps } from '@/components/containers/ref-identifiers/RefIdentifiersContainer'

export const RefIdentifierListView: React.FC<RefIdentifiersContainerViewProps> = ({
    data,
    registrationState,
    defaultFilter,
    pagination,
    filter,
    isLoggedIn,
    isError,
    isLoading,
    handleFilterChange,
}) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const {
        isActionSuccess: { value: isExternalSuccess },
    } = useActionSuccess()

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('refIdentifiers.title')}</TextHeading>
                {isError && <QueryFeedback error={isError} loading={false} />}
                {isExternalSuccess && <MutationFeedback success error={false} />}
            </FlexColumnReverseWrapper>

            <Filter<RefIdentifierListFilterData>
                heading={t('codeList.filter.title')}
                defaultFilterValues={defaultFilter}
                form={({ filter: formFilter, register, setValue }) => (
                    <div>
                        <MultiSelect
                            name="type"
                            label={t('refIdentifiers.filter.type')}
                            options={refIdentifierTypeOptions(t)}
                            onChange={(values) => setValue('type', values as RefIdentifierTypeEnum[])}
                            defaultValue={formFilter.type || defaultFilter.type}
                        />
                        <SimpleSelect
                            label={t('refIdentifiers.filter.state')}
                            options={refIdentifierStateOptions(registrationState, i18n.language)}
                            setValue={setValue}
                            defaultValue={formFilter?.state || defaultFilter.state}
                            name="state"
                        />

                        <Input label={t('refIdentifiers.filter.createdAtFrom')} id={'createdAtFrom'} {...register('createdAtFrom')} type="date" />
                        <Input label={t('refIdentifiers.filter.createdAtTo')} id={'createdAtTo'} {...register('createdAtTo')} type="date" />

                        {isLoggedIn && (
                            <SimpleSelect
                                label={t('refIdentifiers.filter.view')}
                                options={refIdentifierViewOptions(t)}
                                setValue={setValue}
                                isClearable={false}
                                defaultValue={formFilter?.view}
                                name="view"
                            />
                        )}
                    </div>
                )}
            />
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: data?.configurationItemSet?.length ?? 0,
                }}
                entityName=""
                createButton={
                    <CreateEntityButton
                        // ciTypeName={i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}
                        onClick={() => navigate(RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS_CREATE, { state: { from: location } })}
                    />
                }
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table
                rowHref={(row) => `./${row?.original?.uuid}`}
                data={data?.configurationItemSet as ColumnsOutputDefinition[]}
                columns={refIdentifierColumns(t, i18n.language, registrationState)}
                sort={filter.sort ?? []}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}

export default RefIdentifierListView
