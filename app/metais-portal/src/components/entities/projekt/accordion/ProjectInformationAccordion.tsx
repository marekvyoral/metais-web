import React from 'react'

import { BasicInformationSection } from './BasicInformationSection'

import { AccordionContainer } from '@/components/Accordion'
import { TextLinkExternal } from '@/components/typography/TextLinkExternal'
import { Attribute } from '@/api'

interface ProjectInformationAccordionProps {
    attributes: { [key: string]: string }
    participantAttributes?: { [key: string]: string }
    ciTypesAttributes?: Attribute[]
}

export const ProjectInformationAccordion: React.FC<ProjectInformationAccordionProps> = ({ attributes, participantAttributes, ciTypesAttributes }) => {
    return (
        <>
            <AccordionContainer
                sections={[
                    {
                        title: 'Základné informácie',

                        content: (
                            <BasicInformationSection
                                codeMetaIS={attributes?.Gen_Profil_kod_metais}
                                admin={
                                    <TextLinkExternal
                                        title={participantAttributes?.Gen_Profil_nazov ?? ''}
                                        href={'#'}
                                        textLink={participantAttributes?.Gen_Profil_nazov ?? ''}
                                    />
                                }
                                informationSystemName={attributes?.Gen_Profil_nazov}
                                referenceIdentifier={
                                    <TextLinkExternal
                                        title={attributes?.Gen_Profil_ref_id}
                                        href={attributes?.Gen_Profil_ref_id}
                                        textLink={attributes?.Gen_Profil_ref_id}
                                    />
                                }
                                note={attributes?.Gen_Profil_poznamka}
                                description={attributes?.Gen_Profil_popis}
                            />
                        ),
                    },
                ]}
            />
        </>
    )
}
