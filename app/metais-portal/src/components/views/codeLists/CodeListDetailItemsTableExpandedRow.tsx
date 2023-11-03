import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Button, ButtonGroupRow, IconWithText } from '@isdd/idsk-ui-kit/index'
import { InfoIcon } from '@isdd/metais-common/assets/images'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, CodeListItemState, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { InformationGridRowWrapper } from './components/InformationGridRowWrapper/InformationGridRowWrapper'
import { findClosestDateInterval, getDescription, getName, selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import styles from './codeList.module.scss'

interface CodeListDetailItemsTableExpandedRowProps {
    workingLanguage: string
    codelistItem?: ApiCodelistItem
    attributeProfile?: AttributeProfile
    handleMarkForPublish?: (ids: number[]) => void
}

export const CodeListDetailItemsTableExpandedRow: React.FC<CodeListDetailItemsTableExpandedRowProps> = ({
    workingLanguage,
    codelistItem,
    attributeProfile,
    handleMarkForPublish,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const ability = useAbilityContext()

    if (!codelistItem || !attributeProfile) return <></>

    const canEditItem = ability.can(Actions.EDIT, Subjects.ITEM) && !(codelistItem.locked && codelistItem.lockedBy !== user?.login)
    const canReadyToPublish =
        ability.can(Actions.EDIT, Subjects.ITEM, 'readyToPublish') &&
        codelistItem.codelistItemState !== CodeListItemState.READY_TO_PUBLISH &&
        codelistItem.codelistItemState !== CodeListItemState.PUBLISHED &&
        !codelistItem.locked

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
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemNames, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemShortName'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemShortenedNames, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemAbbreviation'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemAbbreviatedNames, workingLanguage)}
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
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemAdditionalContents, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemMeasureUnit'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemUnitsOfMeasure, workingLanguage)}
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
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludes, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemIncludesAlso'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemIncludesAlso, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemExcludes'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                    value={selectBasedOnLanguageAndDate(codelistItem.codelistItemExcludes, workingLanguage)}
                />
                <InformationGridRow
                    key={'itemValidFrom'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_datum_platnosti', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_datum_platnosti', language)}
                    value={t('date', { date: codelistItem.validFrom })}
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
                        selectBasedOnLanguageAndDate(codelistItem.codelistItemLegislativeValidities, workingLanguage)
                            ? t('radioButton.yes')
                            : t('radioButton.no')
                    }
                />
            </InformationGridRowWrapper>
            <ButtonGroupRow>
                {canEditItem && (
                    <Button
                        label={t('codeListDetail.button.edit')}
                        onClick={() => {
                            return // add edit
                        }}
                    />
                )}
                {handleMarkForPublish && canReadyToPublish && (
                    <Button
                        label={t('codeListDetail.button.markItemReadyForPublishing')}
                        onClick={() => handleMarkForPublish([Number(codelistItem.id)])}
                    />
                )}
            </ButtonGroupRow>
        </div>
    )
}
