import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { EkoDetailContainer } from '@/components/containers/Eko/EkoDetailContainer'
import { EkoDetailView } from '@/components/views/eko/eko-detail-views/EkoDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EkoCode = () => {
    const { ekoCode } = useParams()
    const { t } = useTranslation()

    return (
        <>
            <EkoDetailContainer
                ekoCode={ekoCode ?? ''}
                View={({ data, isError, isLoading }) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('navMenu.eko'), href: AdminRouteNames.EKO },
                                { label: data?.name, href: `${AdminRouteNames.EKO}/${ekoCode}` },
                            ]}
                        />
                        <MainContentWrapper>
                            <EkoDetailView data={data} isLoading={isLoading} isError={isError} />
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default EkoCode
