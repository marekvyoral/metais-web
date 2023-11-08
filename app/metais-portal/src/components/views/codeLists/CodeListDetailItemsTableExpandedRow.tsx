import { ApiCodelistItem, ApiCodelistItemLegislativeValidity } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Button, ButtonGroupRow, IconWithText, InfoIconWithText } from '@isdd/idsk-ui-kit/index'
import { InfoIcon } from '@isdd/metais-common/assets/images'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, CodeListItemState, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IItemForm } from './components/modals/ItemForm/ItemForm'
import { InformationGridRowWrapper } from './components/InformationGridRowWrapper/InformationGridRowWrapper'
import { findClosestDateInterval, getDescription, getName, selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import styles from './codeList.module.scss'

import { mapCodeListItemToForm } from '@/componentHelpers/codeList'

interface CodeListDetailItemsTableExpandedRowProps {
    workingLanguage: string
    codelistItem?: ApiCodelistItem
    attributeProfile?: AttributeProfile
    handleOpenEditItem?: (item?: IItemForm) => void
    handleMarkForPublish?: (itemCodes: string[]) => void
}

export const CodeListDetailItemsTableExpandedRow: React.FC<CodeListDetailItemsTableExpandedRowProps> = ({
    workingLanguage,
    codelistItem,
    attributeProfile,
    handleOpenEditItem,
    handleMarkForPublish,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { userInfo: user } = useAuth()
    const ability = useAbilityContext()

    if (!codelistItem || !attributeProfile) return <></>

    const canEditItem = ability.can(Actions.EDIT, Subjects.ITEM) && !(codelistItem.locked && codelistItem.lockedBy !== user?.login)
    const canReadyToPublish =
        ability.can(Actions.EDIT, Subjects.ITEM, 'readyToPublish') &&
        codelistItem.codelistItemState !== CodeListItemState.READY_TO_PUBLISH &&
        codelistItem.codelistItemState !== CodeListItemState.PUBLISHED &&
        !codelistItem.locked

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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skrateny_nazov_polozky', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_skratka_nazvu_polozky', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_uri', language)}
                    value={codelistItem.itemUri}
                />
                <InformationGridRow
                    key={'itemAdditional'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_doplnujuci_obsah', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_merna_jednotka', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_tiez_zahrna', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_vylucuje', language)}
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
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_datum_platnosti_polozky', language)}
                    value={t('date', { date: codelistItem.validFrom })}
                />
                <InformationGridRow
                    key={'itemValidities'}
                    label={getDescription(attributeProfile, 'Gui_Profil_ZC_ucinnost_polozky', language)}
                    tooltip={getName(attributeProfile, 'Gui_Profil_ZC_ucinnost_polozky', language)}
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
            <ButtonGroupRow>
                {canEditItem && handleOpenEditItem && (
                    <Button
                        label={t('codeListDetail.button.edit')}
                        onClick={() => {
                            handleOpenEditItem(mapCodeListItemToForm(codelistItem, workingLanguage))
                        }}
                    />
                )}
                {handleMarkForPublish && canReadyToPublish && (
                    <Button
                        label={t('codeListDetail.button.markItemReadyForPublishing')}
                        onClick={() => handleMarkForPublish([codelistItem.itemCode || ''])}
                    />
                )}
            </ButtonGroupRow>
        </div>
    )
}
