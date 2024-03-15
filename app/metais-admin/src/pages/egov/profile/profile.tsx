import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useStoreUnValid, useStoreValid1 } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EntityFilterData } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ProfileListContainer } from '@/components/containers/Egov/Profile/ProfileListContainer'
import { EntityFilter } from '@/components/filters/EntityFilter'
import { EgovTable } from '@/components/table/EgovTable'

const Profiles = () => {
    const defaultFilterValues: EntityFilterData = { name: '', technicalName: '', type: '', valid: '' }
    const { t } = useTranslation()
    const invalidateEntity = useStoreValid1()
    const validateEntity = useStoreUnValid()
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
                            <QueryFeedback
                                loading={props.isLoading || invalidateEntity.isLoading || validateEntity.isLoading || (props.isFetching ?? false)}
                                error={false}
                                withChildren
                            >
                                <FlexColumnReverseWrapper>
                                    <TextHeading size={'L'}>{t('egov.routing.profileList')}</TextHeading>
                                    <QueryFeedback error={props.isError || invalidateEntity.isError || validateEntity.isError} loading={false} />
                                </FlexColumnReverseWrapper>
                                <EntityFilter defaultFilterValues={defaultFilterValues} />
                                <EgovTable
                                    isFetching={props?.isFetching}
                                    refetch={props?.refetch}
                                    data={props?.data}
                                    entityName={'profile'}
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

export default Profiles
