import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useStoreUnvalid, useStoreValid } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Entity: React.FC = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
    const invalidateEntity = useStoreUnvalid()
    const validateEntity = useStoreValid()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_ENTITY },
                ]}
            />
            <MainContentWrapper>
                <EntityListContainer
                    defaultFilterValues={defaultFilterValues}
                    View={(props) => {
                        return (
                            <QueryFeedback
                                loading={props.isLoading || invalidateEntity.isLoading || validateEntity.isLoading}
                                error={false}
                                withChildren
                            >
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="XL">{t('navMenu.egov.entity')}</TextHeading>
                                    <QueryFeedback error={props.isError || invalidateEntity.isError || validateEntity.isError} loading={false} />
                                </FlexColumnReverseWrapper>
                                <EntityFilter defaultFilterValues={defaultFilterValues} />
                                <EgovTable
                                    data={props?.data}
                                    entityName={'entity'}
                                    setSort={props.setSort}
                                    sort={props.sort}
                                    mutateInvalidateFunc={invalidateEntity}
                                    mutateValidateFunc={validateEntity}
                                />
                            </QueryFeedback>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default Entity
