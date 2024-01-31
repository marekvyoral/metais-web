import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'

import { RefIdentifierDetailInfoViewProps } from '@/components/containers/ref-identifiers/RefIdentifierDetailContainer'
import { getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

export const RefDataItemInfoView: React.FC<RefIdentifierDetailInfoViewProps> = ({
    ciItemData,
    attributes,
    ciList,
    dataItemTypeState,
    registrationState,
    gestorName,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const infoAttributeList = [ATTRIBUTE_NAME.Gen_Profil_nazov, ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const stateItem = registrationState?.enumItems?.find(
        (item) => item.code === ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie],
    )
    const dataTypeItem = dataItemTypeState?.enumItems?.find(
        (item) => item.code === ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku],
    )
    const stateValue = language === Languages.SLOVAK ? stateItem?.value : stateItem?.engValue
    const dataTypeValue = language === Languages.SLOVAK ? dataTypeItem?.value : dataTypeItem?.engValue

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

            <InformationGridRow hideIcon label={t('refIdentifiers.detail.uri')} value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id]} />

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
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod),
                )}
                value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]}
            />

            {ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti] && (
                <InformationGridRow
                    hideIcon
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                    )}
                    value={t('date', { date: ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti] })}
                />
            )}

            {ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti] && (
                <InformationGridRow
                    hideIcon
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti),
                    )}
                    value={t('date', { date: ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti] })}
                />
            )}

            <InformationGridRow
                hideIcon
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku),
                )}
                value={ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]}
            />

            <InformationGridRow
                hideIcon
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku),
                )}
                value={dataTypeValue}
            />

            <InformationGridRow
                hideIcon
                label={t('refIdentifiers.detail.dataItemElements')}
                value={
                    <>
                        {ciList?.map((item, index) => (
                            <li key={index}>
                                {item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                {item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie] !== 'c_stav_registracie.4' && (
                                    <span>{` (${item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id]})`}</span>
                                )}
                            </li>
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
