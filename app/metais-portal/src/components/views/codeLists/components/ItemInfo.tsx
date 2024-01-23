import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { ApiCodelistItem, ApiCodelistItemLegislativeValidity } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { InfoIconWithText, TextWarning } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import {
    findClosestDateInterval,
    getDateIntervalString,
    getDescription,
    getName,
    selectBasedOnLanguageAndDate,
} from '@/components/views/codeLists/CodeListDetailUtils'

interface CodeListItemInfoProps {
    workingLanguage: string
    codelistItem: ApiCodelistItem
    attributeProfile?: AttributeProfile
    showDateIntervals?: boolean
}

export const CodeListItemInfo: React.FC<CodeListItemInfoProps> = ({ workingLanguage, attributeProfile, codelistItem, showDateIntervals = false }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const getTooltipText = (list?: { value?: string; effectiveFrom?: string; effectiveTo?: string }[]) => {
        return list?.map((item) => `${item.value} (${getDateIntervalString(item, t)})\n`).join('')
    }

    const getInfoRowContent = (params: { value?: string | boolean | null; tooltip?: string }) => {
        return showDateIntervals ? <InfoIconWithText tooltip={params.tooltip}>{params.value}</InfoIconWithText> : params.value
    }

    return (
        <>
            {codelistItem?.locked && (
                <TextWarning>
                    {t('codeListDetail.warning.itemLocked', { user: codelistItem.lockedBy, date: t('date', { date: codelistItem.lockedFrom }) })}
                </TextWarning>
            )}
            <DefinitionList>
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
                        !!codelistItem.codelistItemNames?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemNames, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemNames),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemShortName'}
                    label={getDescription('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_skrateny_nazov_polozky', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemShortenedNames?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemShortenedNames, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemShortenedNames),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemAbbreviation'}
                    label={getDescription('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_skratka_nazvu_polozky', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemAbbreviatedNames?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemAbbreviatedNames, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemAbbreviatedNames),
                        })
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
                        !!codelistItem.codelistItemAdditionalContents?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemAdditionalContents, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemAdditionalContents),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemMeasureUnit'}
                    label={getDescription('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_merna_jednotka', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemUnitsOfMeasure?.length &&
                        getInfoRowContent({
                            value: findClosestDateInterval(codelistItem.codelistItemUnitsOfMeasure ?? [])?.value ?? '',
                            tooltip: getTooltipText(codelistItem.codelistItemUnitsOfMeasure),
                        })
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
                        !!codelistItem.codelistItemIncludes?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludes, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemIncludes),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemIncludesAlso'}
                    label={getDescription('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_tiez_zahrna', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemIncludesAlso?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludesAlso, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemIncludesAlso),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemExcludes'}
                    label={getDescription('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_vylucuje', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemExcludes?.length &&
                        getInfoRowContent({
                            value: selectBasedOnLanguageAndDate(codelistItem.codelistItemExcludes, workingLanguage),
                            tooltip: getTooltipText(codelistItem.codelistItemExcludes),
                        })
                    }
                />
                <InformationGridRow
                    key={'itemValidFrom'}
                    label={getDescription('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_datum_platnosti_polozky', language, attributeProfile)}
                    value={codelistItem.validFrom ? t('date', { date: codelistItem.validFrom }) : null}
                />
                <InformationGridRow
                    key={'itemValidities'}
                    label={getDescription('Gui_Profil_ZC_ucinnost_polozky', language, attributeProfile)}
                    tooltip={getName('Gui_Profil_ZC_ucinnost_polozky', language, attributeProfile)}
                    value={
                        !!codelistItem.codelistItemValidities?.length &&
                        (() => {
                            const closestInterval = findClosestDateInterval(codelistItem.codelistItemValidities ?? [])
                            return closestInterval ? getDateIntervalString(closestInterval, t) : ''
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
            </DefinitionList>
        </>
    )
}
