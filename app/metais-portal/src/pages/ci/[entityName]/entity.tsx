import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'

interface Props {
    importantEntityName?: string
    noSideMenu?: boolean
}
export interface CIFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const CiListPage: React.FC<Props> = ({ importantEntityName, noSideMenu }) => {
    const { entityName: ciType } = useGetEntityParamsFromUrl()
    const { t, i18n } = useTranslation()
    document.title = `${t('titles.ciList', { ci: ciType })} | MetaIS`
    const defaultFilterValues: CIFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    const entityName = importantEntityName ? importantEntityName : ciType ?? ''
    return (
        <CiListContainer<CIFilterData>
            entityName={entityName}
            ciType={ciType ?? ''}
            defaultFilterValues={defaultFilterValues}
            ListComponent={(props) => (
                <>
                    {!importantEntityName && (
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                {
                                    label: (i18n.language === Languages.SLOVAK ? props.ciTypeData?.name : props.ciTypeData?.engName) ?? '',
                                    href: `/ci/${ciType}`,
                                },
                            ]}
                        />
                    )}
                    <MainContentWrapper noSideMenu={noSideMenu}>
                        <ListWrapper isNewRelationModal={!!importantEntityName} {...props} />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default CiListPage
