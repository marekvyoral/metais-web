import React, { useState } from 'react'

import { AccordionContainer } from '@/components/Accordion'
import { Paginator } from '@/components/paginator/Paginator'
import { EntityCiContainer } from '@/components/containers/EntityCiContainer'
import { View } from '@/components/containers/EntityCiContainer.stories'
import { EntityRelationsListContainer } from '@/components/containers/EntityRelationsListContainer'
import { RelationsView } from '@/components/containers/EntityRelationsListContainer.stories'
import { EntityDocumentsListContainer } from '@/components/containers/EntityDocumentListContainer'
import { DocsView } from '@/components/containers/EntityDocumentListContainer.stories'

export const DevTestScreen: React.FC = () => {
    const [page, setPage] = useState(5)
    return (
        <>
            <h4>Obrazovka na testovanie komponentov</h4>
            <EntityCiContainer entityName="KRIS" entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={View} />
            <EntityRelationsListContainer entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={RelationsView} />
            <EntityDocumentsListContainer entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={DocsView} />
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
