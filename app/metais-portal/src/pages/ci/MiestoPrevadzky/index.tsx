import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useNavigate } from 'react-router-dom'

import { CIFilterData } from '@/pages/ci/[entityName]/entity'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'
import { CiListWizard } from '@/components/wizards/CiListWizard'

const PlaceOfOperationEntityListPage: React.FC = () => {
    const { entityName: ciType } = useGetEntityParamsFromUrl()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        state: { token },
    } = useAuth()

    const defaultFilterValues: CIFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }
    useEffect(() => {
        if (!token) {
            navigate(RouterRoutes.HOME)
        }
    }, [navigate, token])

    return (
        <>
            <CiListContainer<CIFilterData>
                entityName={ciType ?? ''}
                defaultFilterValues={defaultFilterValues}
                ListComponent={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                ...getCiHowToBreadCrumb(props.entityName, t),
                                {
                                    label: t('titles.ciList', { ci: props.ciTypeData?.name }) ?? '',
                                    href: `/ci/${ciType}`,
                                },
                            ]}
                        />
                        {!props.isLoading && <CiListWizard />}
                        <MainContentWrapper>
                            <ListWrapper {...props} />
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default PlaceOfOperationEntityListPage
