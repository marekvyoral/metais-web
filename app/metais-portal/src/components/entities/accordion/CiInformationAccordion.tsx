import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { CiType, ConfigurationItemUi, EnumType } from '@isdd/metais-common/api'

import styles from './basicInformationSection.module.scss'

import { pairEnumsToEnumValues } from '@/componentHelpers'

interface CiInformationData {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}
// Plánované ročné prevádzkové náklady projektu v EUR
export const CiInformationAccordion: React.FC<CiInformationData> = ({ data: { ciItemData, ciTypeData, constraintsData, unitsData } }) => {
    const { t } = useTranslation()
    const tabsFromApi =
        ciTypeData?.attributeProfiles?.map((attributesProfile) => {
            return {
                title: attributesProfile?.description ?? '',
                content: (
                    <div className={styles.attributeGridRowBox}>
                        {attributesProfile?.attributes
                            ?.filter((atr) => atr.valid === true && atr.invisible !== true)
                            .sort((atr1, atr2) => (atr1.order || 0) - (atr2.order || 0))
                            .map((attribute) => {
                                const withDescription = true
                                const rowValue = pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, unitsData, withDescription)

                                return (
                                    !attribute?.invisible && (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={attribute?.name ?? ''}
                                            value={rowValue}
                                            tooltip={attribute?.description}
                                        />
                                    )
                                )
                            })}
                    </div>
                ),
            }
        }) ?? []

    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: t('ciInformationAccordion.basicInformation'),
                        onLoadOpen: true,
                        content: (
                            <div className={styles.attributeGridRowBox}>
                                {ciTypeData?.attributes?.map((attribute) => {
                                    const withDescription = true
                                    return (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={attribute.name ?? ''}
                                            value={pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, unitsData, withDescription)}
                                            tooltip={attribute?.description}
                                        />
                                    )
                                })}
                            </div>
                        ),
                    },
                    ...tabsFromApi,
                ]}
            />
            {}
        </>
    )
}
