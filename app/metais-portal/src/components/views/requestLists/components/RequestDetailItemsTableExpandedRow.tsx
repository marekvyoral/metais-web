import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Button, ButtonGroupRow, IconWithText } from '@isdd/idsk-ui-kit/index'
import { InfoIcon } from '@isdd/metais-common/assets/images'

import styles from './requestList.module.scss'

import { InformationGridRowWrapper } from '@/components/views/codeLists/components/InformationGridRowWrapper/InformationGridRowWrapper'
import { findClosestDateInterval, getDescription, getName } from '@/components/views/codeLists/CodeListDetailUtils'

interface RequestDetailItemsTableExpandedRowProps {
    workingLanguage: string
    codelistItem?: ApiCodelistItem
    attributeProfile?: AttributeProfile
    handleMarkForPublish?: (ids: number[]) => void
}

export const RequestDetailItemsTableExpandedRow: React.FC<RequestDetailItemsTableExpandedRowProps> = ({
    workingLanguage,
    codelistItem,
    attributeProfile,
    handleMarkForPublish,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    if (!codelistItem || !attributeProfile) return <></>

    return (
        <div className={styles.expandableRowContent}>
            {codelistItem.locked && (
                <IconWithText icon={InfoIcon}>
                    {t('codeListDetail.warning.itemLocked', { user: codelistItem.lockedBy, date: t('date', { date: codelistItem.lockedFrom }) })}
                </IconWithText>
            )}
            <InformationGridRowWrapper>
                <InformationGridRow
                    key={'itemCode'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_kod_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_kod_polozky', language)}
                    value={codelistItem.itemCode}
                />
                <InformationGridRow
                    key={'itemName'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_nazov_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_nazov_polozky', language)}
                    value={codelistItem.codelistItemNames?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemShortName'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                    value={codelistItem.codelistItemShortenedNames?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemAbbreviation'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                    value={codelistItem.codelistItemAbbreviatedNames?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemUri'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                    value={codelistItem.itemUri}
                />
                <InformationGridRow
                    key={'itemAdditional'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
                    value={codelistItem.codelistItemAdditionalContents?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemMeasureUnit'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                    value={codelistItem.codelistItemUnitsOfMeasure?.find((item) => !!item.value)?.value}
                />
                <InformationGridRow
                    key={'itemNote'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_polozku', workingLanguage)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_poznamka_pre_polozku', workingLanguage)}
                    value={codelistItem.codelistItemNotes
                        ?.filter((item) => item.language === workingLanguage)
                        .map((item) => (
                            <div key={item.id}>{item.value}</div>
                        ))}
                />
                <InformationGridRow
                    key={'itemIncludes'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_zahrna', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_zahrna', language)}
                    value={codelistItem.codelistItemIncludes?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemIncludesAlso'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                    value={codelistItem.codelistItemIncludesAlso?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemExcludes'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                    value={codelistItem.codelistItemExcludes?.find((item) => item.language === language)?.value}
                />
                <InformationGridRow
                    key={'itemValidFrom'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_datum_platnosti', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_datum_platnosti', language)}
                    value={codelistItem?.validFrom && t('date', { date: codelistItem?.validFrom })}
                />
                <InformationGridRow
                    key={'itemValidities'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_ucinnost_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_ucinnost_polozky', language)}
                    value={(() => {
                        const closestInterval = findClosestDateInterval(codelistItem.codelistItemValidities ?? [])
                        if (!closestInterval) return ''
                        return `${t('date', { date: closestInterval.effectiveFrom })} - ${
                            closestInterval?.effectiveTo ? t('date', { date: closestInterval.effectiveTo }) : t('codeListDetail.unlimited')
                        }`
                    })()}
                />
                <InformationGridRow
                    key={'logicalOrder'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_logicke_poradie_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_logicke_poradie_polozky', language)}
                    value={codelistItem.codelistItemLogicalOrders
                        ?.filter((item) => item.language === workingLanguage)
                        .map((item) => (
                            <div key={item.id}>{item.value}</div>
                        ))}
                />
                <InformationGridRow
                    key={'itemLegislativeValidities'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_legislativna_uznatelnost', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_legislativna_uznatelnost', language)}
                    value={
                        codelistItem.codelistItemLegislativeValidities?.find((item) => !!item.id)?.validityValue
                            ? t('radioButton.yes')
                            : t('radioButton.no')
                    }
                />
            </InformationGridRowWrapper>

            {handleMarkForPublish && (
                <ButtonGroupRow>
                    {true && (
                        <Button
                            label={t('codeListDetail.button.edit')}
                            onClick={() => {
                                return // add edit
                            }}
                        />
                    )}
                    {true && (
                        <Button
                            label={t('codeListDetail.button.markItemReadyForPublishing')}
                            onClick={() => handleMarkForPublish([Number(codelistItem.id)])}
                        />
                    )}
                </ButtonGroupRow>
            )}
        </div>
    )
}
