import * as React from 'react'

import { AccordionContainer } from '../components/Accordion'
import { TextHeading } from '../components/typography/TextHeading'
import { TextBody } from '../components/typography/TextBody'
import { TextLink } from '../components/typography/TextLink'

export const DevTestScreen: React.FC = () => {
    return (
        <>
            <h4>Obrazovka na testovanie komponentov</h4>
            <TextHeading size="S">TextHeading</TextHeading>
            <TextHeading size="M">TextHeading</TextHeading>
            <TextHeading size="L">TextHeading</TextHeading>
            <TextHeading size="XL">TextHeading</TextHeading>
            <TextBody size="default">textBody</TextBody>
            <TextBody size="S">textBody</TextBody>
            <TextBody size="L">textBody</TextBody>
            <TextLink href="#" title="TextLink" textLink="textLink" />
            <TextLink href="#" title="TextLink" textLink="textLink">
                TextLink
            </TextLink>
            <TextLink href="#" title="TextLink" textLink="textLinkBack" linkBack>
                textLinkBack
            </TextLink>
            <TextLink href="#" title="TextLink" textLink="noVisitedState"></TextLink>
            <AccordionContainer
                sections={[
                    { title: 'Title1', summary: 'Summary1', content: 'content-1' },

                    { title: 'Title2', summary: 'Summary2', content: 'content-2' },

                    { title: 'Title3', summary: 'Summary1', content: 'content-3' },
                    {
                        title: 'Title4',
                        summary: (
                            <>
                                Summary <b>4</b> (JSX)
                            </>
                        ),
                        content: 'content-4',
                    },
                ]}
            />
        </>
    )
}
