import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, useApproveChange, useRejectChange } from '@isdd/metais-common/api/generated/iam-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { PublicAuthoritiesMassUpdateContainer } from '@/components/containers/Egov/Entity/PublicAuthoritiesMassUpdateContainer'
import { PublicAuthoritiesMassUpdateFilter, PublicAuthorityStateEnum } from '@/components/filters/PublicAuthoritiesMassUpdateFilter'
import { PublicAuthoritiesMassUpdateTable } from '@/components/table/PublicAuthoritiesMassUpdateTable'

export interface ColumnsOutputDefinition extends ConfigurationItemUi {
    checked?: boolean
}

export interface PublicAuthoritiesMassUpdateFilterData extends IFilterParams {
    pageNumber: number
    pageSize: number
    state: string
    cmdbId?: string[]
}

const MassUpdate = () => {
    const entityName = 'PO'
    const defaultFilterValues: PublicAuthoritiesMassUpdateFilterData = {
        pageNumber: 1,
        pageSize: BASE_PAGE_SIZE,
        state: PublicAuthorityStateEnum.NEW,
        cmdbId: [],
    }
    const { t } = useTranslation()

    const { mutateAsync: approveChange, isSuccess: isApproveSuccess, isError: isApproveError } = useApproveChange()
    const { mutateAsync: rejectChange, isSuccess: isRejectSuccess, isError: isRejectError } = useRejectChange()

    const [isActionLoading, setActionLoading] = useState<boolean>(false)

    const handleApproveChanges = async (uuids: string[]) => {
        if (uuids.length === 0) return
        setActionLoading(true)
        await Promise.allSettled(uuids.map(async (uuid) => approveChange({ uuid })))
        setActionLoading(false)
    }

    const handleRejectChanges = async (uuids: string[]) => {
        if (uuids.length === 0) return
        setActionLoading(true)
        await Promise.allSettled(uuids.map(async (uuid) => rejectChange({ uuid })))
        setActionLoading(false)
    }

    const isActionSuccess = isApproveSuccess || isRejectSuccess
    const isActionError = isApproveError || isRejectError

    const successMessage = isApproveSuccess
        ? t('publicAuthorities.massUpdate.feedback.approve.success')
        : isRejectSuccess
        ? t('publicAuthorities.massUpdate.feedback.reject.success')
        : undefined
    const errorMessage = isApproveError
        ? t('publicAuthorities.massUpdate.feedback.approve.error')
        : isRejectError
        ? t('publicAuthorities.massUpdate.feedback.reject.error')
        : undefined

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES },
                    { label: t('navMenu.publicAuthorities.massUpdate') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES_MASS_UPDATE },
                ]}
            />
            <PublicAuthoritiesMassUpdateContainer<PublicAuthoritiesMassUpdateFilterData>
                entityName={entityName}
                defaultFilterValues={defaultFilterValues}
                ListComponent={({
                    data: { tableData, ciData, attributeProfiles, attributes, unitsData, constraintsData },
                    handleFilterChange,
                    pagination,
                    sort,
                    isError,
                    isLoading,
                    rowSelection,
                    setRowSelection,
                    refetch,
                }) => (
                    <MainContentWrapper>
                        <QueryFeedback withChildren loading={isLoading || isActionLoading} error={false}>
                            <MutationFeedback
                                success={isActionSuccess}
                                successMessage={successMessage}
                                error={isActionError}
                                errorMessage={errorMessage}
                            />

                            <FlexColumnReverseWrapper>
                                <TextHeading size="XL">{t('publicAuthorities.massUpdate.title')}</TextHeading>
                                <QueryFeedback error={isError} loading={false} />
                            </FlexColumnReverseWrapper>
                            <PublicAuthoritiesMassUpdateFilter entityName={entityName} defaultFilterValues={defaultFilterValues} />
                            <PublicAuthoritiesMassUpdateTable
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                data={tableData}
                                ciData={ciData}
                                defaultFilterValues={defaultFilterValues}
                                attributeProfiles={attributeProfiles}
                                attributes={attributes}
                                unitsData={unitsData}
                                constraintsData={constraintsData}
                                handleFilterChange={handleFilterChange}
                                onApprove={handleApproveChanges}
                                onReject={handleRejectChanges}
                                pagination={pagination}
                                sort={sort}
                                isLoading={isLoading}
                                error={isError}
                                refetch={refetch}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                )}
            />
        </>
    )
}

export default MassUpdate
