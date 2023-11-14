import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { FindView } from '@/components/views/public-authorities/FindView'
import { FindContainer } from '@/components/containers/public-authorities/FindContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Find = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES },
                    { label: t('publicAuthorities.find.new') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES_FIND },
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
