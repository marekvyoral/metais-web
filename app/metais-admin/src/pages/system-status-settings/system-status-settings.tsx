import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { SystemStatusContainer } from '@/components/system-status/SystemStatusContainer'
import { SystemStatusView } from '@/components/views/system-status/SystemStatusView'

const SystemStatusSettingsPage = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.systemState.heading'), href: `${AdminRouteNames.SYSTEM_STATUS_SETTINGS}` },
                ]}
            />
            <MainContentWrapper>
                <SystemStatusContainer View={(props) => <SystemStatusView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default SystemStatusSettingsPage
