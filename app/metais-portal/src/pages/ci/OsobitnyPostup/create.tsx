import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiCreateEntityContainer } from '@/components/containers/CiCreateEntityContainer'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'

const CreateITVSExceptionsPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()
    const { data: ciTypeData } = useGetCiType(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: ciTypeName ?? '', href: `/ci/${entityName}` },
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
