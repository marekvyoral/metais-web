import React, { useState } from 'react'

import { Paginator } from '@metais-web/idsk-ui-kit'
import { AccordionContainer } from '@portal/components/Accordion'

export const DevTestScreen: React.FC = () => {
    const [page, setPage] = useState(5)
    return (
        <>
            <h4>Obrazovka na testovanie komponentov</h4>
            <Paginator dataLength={100} pageNumber={page} onPageChanged={setPage} pageSize={10} />
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
