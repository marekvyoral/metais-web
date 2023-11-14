import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Profiles = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('egov.routing.attrProfile'), href: AdminRouteNames.EGOV_PROFILE },
                ]}
            />
            <MainContentWrapper>
                <ProfileListContainer
                    defaultFilterValues={defaultFilterValues}
                    View={(props) => {
                        return (
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size={'L'}>{t('egov.routing.profileList')}</TextHeading>
                                    {props.isError && <QueryFeedback error loading={false} />}
                                </FlexColumnReverseWrapper>
                                <EntityFilter defaultFilterValues={defaultFilterValues} />
                                <EgovTable isFetching={props?.isFetching} refetch={props?.refetch} data={props?.data} entityName={'profile'} />
                            </QueryFeedback>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default Profiles
