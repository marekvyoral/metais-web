import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { FindView } from '@/components/views/organizations/FindView'
import { FindContainer } from '@/components/containers/organizations/FindContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Find = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.organizations') ?? '', href: AdminRouteNames.ORGANIZATIONS },
                    { label: t('organizations.find.new') ?? '', href: AdminRouteNames.ORGANIZATIONS + '/find' },
                ]}
            />
            <FindContainer
                View={(props) => (
                    <MainContentWrapper>
                        <FindView
                            data={props?.data}
                            onSearchIco={props?.onSearchIco}
                            isLoading={props.isLoading}
                            error={props?.error}
                            isSame={props?.isSame}
                        />
                    </MainContentWrapper>
                )}
            />
        </>
    )
}

export default Find
