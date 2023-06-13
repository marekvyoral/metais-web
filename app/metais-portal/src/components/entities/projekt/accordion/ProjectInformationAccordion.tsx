import React from 'react'

import styles from './basicInformationSection.module.scss'
import { InformationGridRow } from './InformationGridRow'

import { AccordionContainer } from '@/components/Accordion'
import { ICiContainerView } from '@/components/containers/CiContainer'

export const ProjectInformationAccordion: React.FC<ICiContainerView> = ({ data: { ciItemData, ciTypeData } }) => {
    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: 'Základné informácie',

                        content: (
                            <div className={styles.attributeGridRowBox}>
                                {ciTypeData?.attributes?.map((attribute) => (
                                    <InformationGridRow
                                        key={attribute?.technicalName}
                                        label={attribute.name ?? ''}
                                        value={ciItemData?.attributes?.[attribute?.technicalName ?? '']}
                                    />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
            {ciTypeData?.attributeProfiles?.map((attributesProfile) => {
                return (
                    <AccordionContainer
                        key={attributesProfile?.description}
                        sections={[
                            {
                                title: attributesProfile?.description ?? '',
                                content: (
                                    <div className={styles.attributeGridRowBox}>
                                        {attributesProfile?.attributes?.map((attribute) => {
                                            const rowValue = ciItemData?.attributes?.[attribute?.technicalName ?? ''] // VALUE DEPENDS ON VALUE TYPE enum, array, etc.
                                            return (
                                                rowValue && (
                                                    <InformationGridRow
                                                        key={attribute?.technicalName}
                                                        label={attribute.name ?? ''}
                                                        value={rowValue}
                                                    />
                                                )
                                            )
                                        })}
                                    </div>
                                ),
                            },
                        ]}
                    />
                )
            })}
        </>
    )
}
