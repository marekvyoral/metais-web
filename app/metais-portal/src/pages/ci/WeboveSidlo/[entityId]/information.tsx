import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Link } from 'react-router-dom'
import { baseWikiUrl } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

const WebPortalInformation = () => {
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const { t } = useTranslation()

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(entityId)
    const { constraintsData, ciTypeData, unitsData, isLoading: isAttLoading, isError: isAttError } = useAttributesHook(entityName)

    const Profil_Webove_Sidlo_typ_rozhrania_list = ['c_typ_rozhrania.5', 'c_typ_rozhrania.6']
    const DECLARATION_URL = `${baseWikiUrl}/page/render/webove_sidlo?weboveSidloCode=${ciItemData?.attributes?.Gen_Profil_kod_metais}`

    return (
        <>
            <CiInformationAccordion
                data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }}
                isError={[isCiItemError, isAttError].some((item) => item)}
                isLoading={[isCiItemLoading, isAttLoading].some((item) => item)}
            />
            {Profil_Webove_Sidlo_typ_rozhrania_list.includes(ciItemData?.attributes?.Profil_Webove_Sidlo_typ_rozhrania) && (
                <InformationGridRow
                    label={t('WeboveSidlo.declarationLink')}
                    value={
                        <Link to={DECLARATION_URL} target="_blank">
                            {DECLARATION_URL}
                        </Link>
                    }
                    tooltip={t('WeboveSidlo.declarationLinkTooltip')}
                />
            )}
        </>
    )
}

export default WebPortalInformation
