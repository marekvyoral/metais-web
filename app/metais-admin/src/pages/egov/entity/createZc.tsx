import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import CreateZcEntityContainer from '@/components/containers/Egov/Entity/CreateZcEntityContainer'

const CreateZcEntity = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.egov.entity'), href: AdminRouteNames.EGOV_ENTITY },
                    { label: t('egov.entity.createHeader'), href: AdminRouteNames.EGOV_ENTITY + '/create' },
                ]}
            />
            <MainContentWrapper>
                <CreateZcEntityContainer />
            </MainContentWrapper>
        </>
    )
}

export default CreateZcEntity
