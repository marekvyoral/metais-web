import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { META_IS_TITLE } from '@isdd/metais-common/constants'
import { Languages } from '@isdd/metais-common/localization/languages'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ITVSExceptionsCreateContainer } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { useCiCreateEntityHook } from '@/hooks/useCiCreateEntity.hook'

const CreateITVSExceptionsPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityName } = useGetEntityParamsFromUrl()
    const { data: ciTypeData } = useGetCiTypeWrapper(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    const ciCreateData = useCiCreateEntityHook({ entityName: entityName ?? '' })

    document.title = `${t('titles.ciCreateEntity', { ci: ciCreateData.ciTypeName })} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    ...getCiHowToBreadCrumb(entityName ?? '', t),
                    { label: ciTypeName ?? '', href: `/ci/${entityName}` },
                    { label: `${t('breadcrumbs.ciCreate', { entityName: t('ITVSExceptions.vynimky_ITVS') })}`, href: `/ci/create` },
                ]}
            />
            <MainContentWrapper>
                <ITVSExceptionsCreateContainer {...ciCreateData} />
            </MainContentWrapper>
        </>
    )
}

export default CreateITVSExceptionsPage
