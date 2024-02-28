import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'

import { RefIdentifierDetailInfoViewProps } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'
import { getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

export const RefCatalogInfoView: React.FC<RefIdentifierDetailInfoViewProps> = ({ ciItemData, attributes, registrationState, gestorName, ciList }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const infoAttributeList = [ATTRIBUTE_NAME.Gen_Profil_nazov, ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const stateItem = registrationState?.enumItems?.find(
        (item) => item.code === ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie],
    )
    const stateValue = language === Languages.SLOVAK ? stateItem?.value : stateItem?.engValue

    return (
        <>
            {infoAttributeList.map((technicalName) => (
                <InformationGridRow
                    key={technicalName}
                    hideIcon
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === technicalName),
                    )}
                    value={ciItemData?.attributes?.[technicalName]}
                />
            ))}

            <InformationGridRow
                hideIcon
                label={t('refIdentifiers.detail.uri')}
                value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_uri]}
            />

            <InformationGridRow hideIcon label={t('refIdentifiers.detail.gestor')} value={gestorName} />
            <InformationGridRow hideIcon label={t('refIdentifiers.detail.type')} value={t(`refIdentifiers.type.${ciItemData?.type}`)} />
            <InformationGridRow
                hideIcon
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie),
                )}
                value={stateValue}
            />
            <InformationGridRow
                hideIcon
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis),
                )}
                value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_popis]}
            />
            <InformationGridRow
                hideIcon
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_historicky_kod),
                )}
                value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_historicky_kod]}
            />

            {ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_od] && (
                <InformationGridRow
                    hideIcon
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od),
                    )}
                    value={t('date', { date: ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_od] })}
                />
            )}

            {ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_do] && (
                <InformationGridRow
                    hideIcon
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_do),
                    )}
                    value={t('date', { date: ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_do] })}
                />
            )}

            <InformationGridRow
                hideIcon
                label={t('refIdentifiers.detail.datasets')}
                value={
                    <>
                        {ciList?.map((item, index) => (
                            <li key={index}>{item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}</li>
                        ))}
                    </>
                }
            />

            <InformationGridRow
                hideIcon
                label={t('refIdentifiers.detail.createdAt')}
                value={t('date', { date: ciItemData?.metaAttributes?.createdAt })}
            />

            <InformationGridRow hideIcon label={t('refIdentifiers.detail.createdBy')} value={ciItemData?.metaAttributes?.createdBy} />

            {ciItemData?.metaAttributes?.lastModifiedAt && (
                <InformationGridRow
                    hideIcon
                    label={t('refIdentifiers.detail.lastModifiedAt')}
                    value={t('date', { date: ciItemData?.metaAttributes?.lastModifiedAt })}
                />
            )}
            {ciItemData?.metaAttributes?.lastModifiedBy && (
                <InformationGridRow hideIcon label={t('refIdentifiers.detail.modifiedBy')} value={ciItemData?.metaAttributes?.lastModifiedBy} />
            )}
        </>
    )
}
