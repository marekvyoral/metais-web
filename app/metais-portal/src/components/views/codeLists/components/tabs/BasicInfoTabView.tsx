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

    return (
        <InformationGridRowWrapper>
            <InformationGridRow
                key={'isBase'}
                label={getDescription('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_zakladny_ciselnik', language, attributeProfile)}
                value={codeList?.base ? t('radioButton.yes') : t('radioButton.no')}
            />
            <InformationGridRow
                key={'name'}
                label={getDescription('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_nazov_ciselnika', language, attributeProfile)}
                value={
                    <InfoIconWithText
                        tooltip={codeList?.codelistNames
                            ?.filter((item) => item.language === workingLanguage)
                            .map(
                                (item) =>
                                    `${item.value} (${t('date', { date: item.effectiveFrom })} - ${
                                        item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')
                                    })`,
                            )
                            .join('\n')}
                    >
                        {selectBasedOnLanguageAndDate(codeList?.codelistNames, workingLanguage, true)}
                    </InfoIconWithText>
                }
            />
            <InformationGridRow
                key={'code'}
                label={getDescription('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_kod_ciselnika', language, attributeProfile)}
                value={codeList?.code}
            />
            <InformationGridRow
                key={'resortCode'}
                label={getDescription('Gui_Profil_ZC_rezort', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_rezort', language, attributeProfile)}
                value={codeList?.resortCode}
            />
            <InformationGridRow
                key={'uri'}
                label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                value={codeList?.uri}
            />
            <InformationGridRow
                key={'mainGestor'}
                label={getDescription('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_hlavny_gestor', language, attributeProfile)}
                value={
                    !!codeList?.mainCodelistManagers?.length && (
                        <InfoIconWithText
                            tooltip={codeList?.mainCodelistManagers
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
                label={getDescription('Gui_Profil_ZC_vedlajsi_gestor', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_vedlajsi_gestor', language, attributeProfile)}
                value={
                    !!codeList?.codelistManagers?.length && (
                        <InfoIconWithText
                            tooltip={codeList?.codelistManagers
                                ?.map(
                                    (item) =>
                                        `${getGestorName(gestors, item.value)} (${
                                            item.effectiveFrom ? t('date', { date: item.effectiveFrom }) : t('codeListDetail.unlimited')
                                        } - ${item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')})\n`,
                                )
                                .join('<br />')}
                        >
                            {codeList?.codelistManagers?.map((gestor) => (
                                <p key={gestor.id}>{getGestorName(gestors, gestor.value)}</p>
                            ))}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'sourceCodelist'}
                label={getDescription('Gui_Profil_ZC_zdrojovy_ciselnik', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_zdrojovy_ciselnik', language, attributeProfile)}
                value={codeList?.codelistSource?.map((source, index) => (
                    <p key={index}>{source}</p>
                ))}
            />
            <InformationGridRow
                key={'validFrom'}
                label={getDescription('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                value={codeList?.validFrom ? t('date', { date: codeList?.validFrom }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'effectiveFrom'}
                label={getDescription('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_zaciatok_ucinnosti_polozky', language, attributeProfile)}
                value={codeList?.effectiveFrom ? t('date', { date: codeList?.effectiveFrom }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'effectiveTo'}
                label={getDescription('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_koniec_ucinnosti_polozky', language, attributeProfile)}
                value={codeList?.effectiveTo ? t('date', { date: codeList?.effectiveTo }) : t('codeListDetail.unlimited')}
            />
            <InformationGridRow
                key={'notes'}
                label={getDescription('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_poznamka_pre_ciselnik', language, attributeProfile)}
                value={selectBasedOnLanguageAndDate(codeList?.codelistNotes, workingLanguage)}
            />
        </InformationGridRowWrapper>
    )
}
