import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { RelationListContainer } from '@/components/containers/Egov/Relation/RelationsListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Relation = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.egov.relations'), href: AdminRouteNames.EGOV_RELATION },
                ]}
            />
            <MainContentWrapper>
                <RelationListContainer
                    defaultFilterValues={defaultFilterValues}
                    View={(props) => {
                        return (
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="L">{t('navMenu.egov.relations')}</TextHeading>
                                    {props.isError && <QueryFeedback error loading={false} />}
                                </FlexColumnReverseWrapper>
                                <EntityFilter defaultFilterValues={defaultFilterValues} />
                                <EgovTable data={props?.data} entityName={'relation'} setSort={props.setSort} sort={props.sort} />
                            </QueryFeedback>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default Relation
