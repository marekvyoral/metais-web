import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'
import { getCiHowToBreadCrumb } from '@/componentHelpers/ci'

const POPOListPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_PO')} ${META_IS_TITLE}`
    const PO = 'PO'
    const PO_PO = 'PO_PO'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: ['c_kategoria_osoba.2'],
        EA_Profil_PO_typ_osoby: [
            'c_typ_osoby.b',
            'c_typ_osoby.c1',
            'c_typ_osoby.c2',
            'c_typ_osoby.d1',
            'c_typ_osoby.d2',
            'c_typ_osoby.d3',
            'c_typ_osoby.d4',
            'c_typ_osoby.e',
            'c_typ_osoby.f',
            'c_typ_osoby.g',
        ],
        EA_Profil_PO_je_kapitola: undefined,
        evidence_status: ['DRAFT'],
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    ...getCiHowToBreadCrumb(PO_PO, t),
                    { label: t('ciType.PO_PO_Heading') ?? '', href: `/ci/${PO_PO}` },
                ]}
            />
            <MainContentWrapper>
                <CiListContainer<POFilterData>
                    entityName={PO}
                    POType={PO_PO}
                    defaultFilterValues={defaultFilterValues}
                    ListComponent={(props) => <POView {...props} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default POPOListPage
