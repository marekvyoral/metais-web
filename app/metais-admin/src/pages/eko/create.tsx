import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { EkoCreateContainer } from '@/components/containers/Eko/EkoCreateContainer'
import { EkoCreateView } from '@/components/views/eko/eko-create-views/EkoCreateView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateEko = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.eko'), href: AdminRouteNames.EKO },
                    { label: t('eko.createdCode'), href: AdminRouteNames.EKO + '/create' },
                ]}
            />
            <MainContentWrapper>
                <EkoCreateContainer
                    View={(props) => <EkoCreateView data={props.data} mutate={props?.mutate} isError={props.isError} isLoading={props.isLoading} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateEko
