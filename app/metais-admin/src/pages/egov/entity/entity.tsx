import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Entity: React.FC = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
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
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="XL">{t('navMenu.egov.entity')}</TextHeading>
                                    {props.isError && <QueryFeedback error loading={false} />}
                                </FlexColumnReverseWrapper>
                                <EntityFilter defaultFilterValues={defaultFilterValues} />
                                <EgovTable data={props?.data} entityName={'entity'} setSort={props.setSort} sort={props.sort} />
                            </QueryFeedback>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default Entity
