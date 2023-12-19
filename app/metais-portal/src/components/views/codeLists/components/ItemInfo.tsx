import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { ApiCodelistItem, ApiCodelistItemLegislativeValidity } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/index'

import { InformationGridRowWrapper } from './InformationGridRowWrapper/InformationGridRowWrapper'

import { findClosestDateInterval, getDescription, getName, selectBasedOnLanguageAndDate } from '@/components/views/codeLists/CodeListDetailUtils'

interface CodeListItemInfoProps {
    workingLanguage: string
    codelistItem: ApiCodelistItem
    attributeProfile?: AttributeProfile
}

export const CodeListItemInfo: React.FC<CodeListItemInfoProps> = ({ workingLanguage, attributeProfile, codelistItem }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const getTooltipText = (list?: { value?: string; effectiveFrom?: string; effectiveTo?: string }[]) => {
        return list
            ?.map(
                (item) =>
                    `${item.value} (${item.effectiveFrom ? t('date', { date: item.effectiveFrom }) : t('codeListDetail.unlimited')} - ${
                        item.effectiveTo ? t('date', { date: item.effectiveTo }) : t('codeListDetail.unlimited')
                    })\n`,
            )
            .join('')
    }

    return (
        <InformationGridRowWrapper>
            <InformationGridRow
                key={'itemCode'}
                label={getDescription('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_kod_polozky', language, attributeProfile)}
                value={codelistItem.itemCode}
            />
            <InformationGridRow
                key={'itemName'}
                label={getDescription('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_nazov_polozky', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemNames?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemNames)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemNames, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemShortName'}
                label={getDescription('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemShortenedNames?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemShortenedNames)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemShortenedNames, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemAbbreviation'}
                label={getDescription('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemAbbreviatedNames?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemAbbreviatedNames)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemAbbreviatedNames, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemUri'}
                label={getDescription('Gui_Profil_ZC_uri', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_uri', language, attributeProfile)}
                value={codelistItem.itemUri}
            />
            <InformationGridRow
                key={'itemAdditional'}
                label={getDescription('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_doplnujuci_obsah', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemAdditionalContents?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemAdditionalContents)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemAdditionalContents, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemMeasureUnit'}
                label={getDescription('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemUnitsOfMeasure?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemUnitsOfMeasure)}>
                            {(() => {
                                const closestInterval = findClosestDateInterval(codelistItem.codelistItemUnitsOfMeasure ?? [])
                                return closestInterval ? closestInterval.value : ''
                            })()}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemNote'}
                label={getDescription('Gui_Profil_ZC_poznamka_pre_polozku', workingLanguage, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_poznamka_pre_polozku', workingLanguage, attributeProfile)}
                value={codelistItem.codelistItemNotes
                    ?.filter((item) => item.language === workingLanguage)
                    .map((item) => (
                        <div key={item.id}>{item.value}</div>
                    ))}
            />
            <InformationGridRow
                key={'itemIncludes'}
                label={getDescription('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_zahrna', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemIncludes?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemIncludes)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludes, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemIncludesAlso'}
                label={getDescription('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemIncludesAlso?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemIncludesAlso)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludesAlso, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemExcludes'}
                label={getDescription('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemExcludes?.length && (
                        <InfoIconWithText tooltip={getTooltipText(codelistItem.codelistItemExcludes)}>
                            {selectBasedOnLanguageAndDate(codelistItem.codelistItemExcludes, workingLanguage)}
                        </InfoIconWithText>
                    )
                }
            />
            <InformationGridRow
                key={'itemValidFrom'}
                label={getDescription('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                value={t('date', { date: codelistItem.validFrom })}
            />
            <InformationGridRow
                key={'itemValidities'}
                label={getDescription('Gui_Profil_ZC_ucinnost_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_ucinnost_polozky', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemValidities?.length &&
                    (() => {
                        const closestInterval = findClosestDateInterval(codelistItem.codelistItemValidities ?? [])
                        if (closestInterval) {
                            return `${t('date', { date: closestInterval.effectiveFrom })} - ${
                                closestInterval?.effectiveTo ? t('date', { date: closestInterval.effectiveTo }) : t('codeListDetail.unlimited')
                            }`
                        }
                        return ''
                    })()
                }
            />
            <InformationGridRow
                key={'logicalOrder'}
                label={getDescription('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_logicke_poradie_polozky', language, attributeProfile)}
                value={codelistItem.codelistItemLogicalOrders
                    ?.filter((item) => item.language === workingLanguage)
                    .map((item) => (
                        <div key={item.id}>{item.value}</div>
                    ))}
            />
            <InformationGridRow
                key={'itemLegislativeValidities'}
                label={getDescription('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                tooltip={getName('Gui_Profil_ZC_legislativna_uznatelnost', language, attributeProfile)}
                value={
                    !!codelistItem.codelistItemLegislativeValidities?.length &&
                    (() => {
                        const closestInterval = findClosestDateInterval(
                            codelistItem.codelistItemLegislativeValidities ?? [],
                        ) as ApiCodelistItemLegislativeValidity
                        if (closestInterval) {
                            return closestInterval.validityValue ? t('radioButton.yes') : t('radioButton.no')
                        }
                        return ''
                    })()
                }
            />
        </InformationGridRowWrapper>
    )
}
