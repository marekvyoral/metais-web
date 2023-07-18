import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'

import styles from './basicInformationSection.module.scss'
import { InformationGridRow } from './InformationGridRow'

import { pairEnumsToEnumValues } from '@/componentHelpers'
import { CiType, ConfigurationItemUi, EnumType } from '@/api'

interface CiInformationData {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}

export const CiInformationAccordion: React.FC<CiInformationData> = ({ data: { ciItemData, ciTypeData, constraintsData } }) => {
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
                                const rowValue = pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, withDescription)
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
                        content: (
                            <div className={styles.attributeGridRowBox}>
                                {ciTypeData?.attributes?.map((attribute) => {
                                    const withDescription = true
                                    return (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={attribute.name ?? ''}
                                            value={pairEnumsToEnumValues(attribute, ciItemData, constraintsData, t, withDescription)}
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
