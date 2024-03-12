import { mapFilterToExecuteParams } from '@isdd/metais-common/componentHelpers'
import { ReportExportButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS, REPORTS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { ReportsDetailContainer } from '@/components/containers/ReportsDetailContainer'
import { ReportTable } from '@/components/views/reports/ReportTable'
import { ReportsCard } from '@/components/views/reports/ReportsCard'
import { ReportsFilterParameterWrapper } from '@/components/views/reports/ReportsFilterParameterWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const ReportsDetailPage: React.FC = () => {
    const { t } = useTranslation()

    const defaultFilterValues: IFilterParams & { [key: string]: string } = {}

    return (
        <ReportsDetailContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('reports.heading') ?? '', href: `/ci/${REPORTS}` },
                            ]}
                        />
                        <MainContentWrapper>
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="XL">{props.data?.name}</TextHeading>
                                    {props.isError && <QueryFeedback loading={false} error={props.isError} />}
                                    <MutationFeedback
                                        success={!!props?.reportResult}
                                        successMessage={t('mutationFeedback.runMutationSuccess')}
                                        error={props.isError ? <>{t('mutationFeedback.runMutationError')}</> : undefined}
                                    />
                                </FlexColumnReverseWrapper>
                                <ReportsCard data={props.data} />
                                <ReportsFilterParameterWrapper
                                    defaultFilterValues={defaultFilterValues}
                                    parameters={props.data?.parameters}
                                    filterEnumData={props.filterEmumData}
                                />

                                <ActionsOverTable
                                    pagination={props.pagination}
                                    handleFilterChange={props.handleFilterChange}
                                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    entityName={props?.data?.lookupKey ?? ''}
                                    hiddenButtons={{ SELECT_COLUMNS: true }}
                                    exportButton={
                                        <ReportExportButton
                                            entityId={props?.data?.id ?? 0}
                                            filter={mapFilterToExecuteParams(props.filterParams ?? {}, props.data?.parameters, props.filterEmumData)}
                                        />
                                    }
                                />

                                <ReportTable
                                    data={props?.reportResult}
                                    sort={props?.filterParams?.sort ?? []}
                                    handleFilterChange={props?.handleFilterChange}
                                    pagination={props.pagination}
                                />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
