import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'

const CreateITVSExceptionsPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName ?? '', href: `/ci/${entityName}` },
                    { label: `${t('breadcrumbs.ciCreate', { entityName: t('ITVSExceptions.vynimky_ITVS') })}`, href: `/ci/create` },
                ]}
            />
            <MainContentWrapper>
                <CiCreateEntityContainer entityName={entityName ?? ''} View={(props) => <ITVSExceptionsCreateContainer {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default CreateITVSExceptionsPage
