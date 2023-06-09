import React from 'react'

import { BasicInformationSection } from './BasicInformationSection'

import { TextLinkExternal } from '@metais-web/idsk-ui-kit'
import { AccordionContainer } from '@portal/components/Accordion'

export const ProjectInformationAccordion: React.FC = () => {
    return (
        <AccordionContainer
            sections={[
                {
                    title: 'Základné informácie',

                    content: (
                        <BasicInformationSection
                            codeMetaIS={'isvs_11775'}
                            admin={
                                <TextLinkExternal
                                    title={'Ministerstvo dopravy Slovenskej republiky'}
                                    href={'#'}
                                    textLink={'Ministerstvo dopravy Slovenskej republiky'}
                                />
                            }
                            informationSystemName={'Elektronický národný register informácií dopravy'}
                            referenceIdentifier={
                                <TextLinkExternal
                                    title={'https://data.gov.sk/id/egov/isvs/11775'}
                                    href={'https://data.gov.sk/id/egov/isvs/11775'}
                                    textLink={'https://data.gov.sk/id/egov/isvs/11775'}
                                />
                            }
                            note={'skratka – „eNRI DOP“'}
                            description={
                                'Zámerom projektu je vybudovať komplexný informačný systém, ktorý bude slúžiť najmä ako: a) národný prístupový bod pre služby viazané na EÚ Smernicu a Delegované nariadenia: Smernica 2010/40/EÚ (o rámci na zavedenie inteligentných dopravných systémov v oblasti cestnej dopravy a na rozhrania s inými druhmi dopravy), Delegované nariadenia č. 2017/1926 (poskytovanie informačných služieb o multimodálnom cestovaní v celej EÚ), č. 885/2013 (poskytovanie informačných služieb pre bezpečné a chránené parkovacie miesta pre nákladné a úžitkové vozidlá), č. 886/2013 (poskytovanie bezplatných minimálnych univerzálnych dopravných informácií týkajúcich sa bezpečnosti cestnej premávky užívateľom) a č. 2015/962 (poskytovanie informačných služieb o doprave v reálnom čase v celej EÚ), b) register informácií z dopravy, ktoré majú podporiť cestovanie verejnou dopravou, a využívanie ekologických dopravných módov, c) báza pre inteligentný dopravný systém, ktorý zabezpečí vyššiu atraktívnosť ekologických dopravných módov.'
                            }
                        />
                    ),
                },
            ]}
        />
    )
}
