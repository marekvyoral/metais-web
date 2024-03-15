import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'
import { getCiHowToBreadCrumb } from '@/componentHelpers/ci'

const POIsListPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_IS')} ${META_IS_TITLE}`
    const PO = 'PO'
    const PO_IS = 'PO_IS'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: [],
        EA_Profil_PO_typ_osoby: [],
        EA_Profil_PO_je_kapitola: undefined,
        evidence_status: ['DRAFT'],
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    ...getCiHowToBreadCrumb(PO_IS, t),
                    { label: t('ciType.PO_IS_Heading') ?? '', href: `/ci/${PO_IS}` },
                ]}
            />
            <MainContentWrapper>
                <CiListContainer<POFilterData>
                    entityName={PO}
                    POType={PO_IS}
                    defaultFilterValues={defaultFilterValues}
                    ListComponent={(props) => <POView {...props} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default POIsListPage
