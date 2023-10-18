import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/index'

import { InformationGridRowWrapper } from '@/components/views/codeLists/components/InformationGridRowWrapper/InformationGridRowWrapper'
import { selectBasedOnLanguageAndDate, getDescription, getName, getGestorName } from '@/components/views/codeLists/CodeListDetailUtils'
import { CodeListDetailData } from '@/components/containers/CodeListDetailContainer'

export interface BasicInfoTabViewProps {
    data?: CodeListDetailData
    workingLanguage: string
}

export const BasicInfoTabView: React.FC<BasicInfoTabViewProps> = ({ data, workingLanguage }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { codeList, attributeProfile, gestors } = data || {}

    if (!codeList || !attributeProfile) return <></>

    return (
        <InformationGridRowWrapper>
            <InformationGridRow
                key={'isBase'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_zakladny_ciselnik', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_zakladny_ciselnik', language)}
                value={codeList.base ? t('radioButton.yes') : t('radioButton.no')}
            />
            <InformationGridRow
                key={'name'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_nazov_ciselnika', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_nazov_ciselnika', language)}
                value={
                    <InfoIconWithText
                        tooltip={codeList.codelistNames
                            ?.filter((item) => item.language === workingLanguage)
                            .map(
                                (item) =>
                                    `${item.value} (${t('date', { date: item.effectiveFrom })} - ${
                                        item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')
                                    })`,
                            )
                            .join('\n')}
                    >
                        {selectBasedOnLanguageAndDate(codeList.codelistNames, workingLanguage, true)}
                    </InfoIconWithText>
                }
            />
            <InformationGridRow
                key={'code'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_kod_ciselnika', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_kod_ciselnika', language)}
                value={codeList.code}
            />
            <InformationGridRow
                key={'resortCode'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_rezort', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_rezort', language)}
                value={codeList.resortCode}
            />
            <InformationGridRow
                key={'uri'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                value={codeList.uri}
            />
            <InformationGridRow
                key={'mainGestor'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_hlavny_gestor', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_hlavny_gestor', language)}
                value={
                    !!codeList.mainCodelistManagers?.length && (
                        <InfoIconWithText
                            tooltip={codeList.mainCodelistManagers
                                ?.map(
                                    (item) =>
                                        `${getGestorName(gestors, item.value)} (${
                                            item.effectiveFrom ? t('date', { date: item.effectiveFrom }) : t('codeListDetail.unlimited')
                                        } - ${item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')})\n`,
                                )
                                .join('<br />')}
                        >
                            {getGestorName(gestors, codeList.mainCodelistManagers?.[0]?.value)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'gestor'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_vedlajsi_gestor', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_vedlajsi_gestor', language)}
                value={
                    !!codeList.codelistManagers?.length && (
                        <InfoIconWithText
                            tooltip={codeList.codelistManagers
                                ?.map(
                                    (item) =>
                                        `${getGestorName(gestors, item.value)} (${
                                            item.effectiveFrom ? t('date', { date: item.effectiveFrom }) : t('codeListDetail.unlimited')
                                        } - ${item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')})\n`,
                                )
                                .join('<br />')}
                        >
                            {codeList.codelistManagers?.map((gestor) => (
                                <p key={gestor.id}>{getGestorName(gestors, gestor.value)}</p>
                            ))}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'sourceCodelist'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_zdrojovy_ciselnik', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_zdrojovy_ciselnik', language)}
                value={codeList.codelistSource?.map((source, index) => (
                    <p key={index}>{source}</p>
                ))}
            />
            <InformationGridRow
                key={'validFrom'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                value={codeList.validFrom ? t('date', { date: codeList.validFrom }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'effectiveFrom'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language)}
                value={codeList.effectiveFrom ? t('date', { date: codeList.effectiveFrom }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'effectiveTo'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_koniec_ucinnosti_polozky', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_koniec_ucinnosti_polozky', language)}
                value={codeList.effectiveTo ? t('date', { date: codeList.effectiveTo }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'notes'}
                label={getDescription(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_ciselnik', language)}
                tooltip={getName(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_ciselnik', language)}
                value={selectBasedOnLanguageAndDate(codeList.codelistNotes, workingLanguage)}
            />
        </InformationGridRowWrapper>
    )
}
