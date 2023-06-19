import React, { useState } from 'react'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'

import { AccordionContainer } from '@/components/Accordion'
import { ButtonPopup } from '@/components/button-popup/ButtonPopup'
import { CiContainer } from '@/components/containers/CiContainer'
import { View } from '@/components/containers/CiContainer.stories'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { RelationsView } from '@/components/containers/RelationsListContainer.stories'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocsView } from '@/components/containers/DocumentListContainer.stories'
import { TableSelectColumns } from '@/components/table-select-columns/TableSelectColumns'

export const DevTestScreen: React.FC = () => {
    const [page, setPage] = useState(5)
    return (
        <>
            <h4>Obrazovka na testovanie komponentov</h4>

            <ButtonPopup
                buttonLabel={'buttonLabel'}
                popupContent={function (): React.ReactNode {
                    return (
                        <TableSelectColumns
                            onClose={function (): void {
                                throw new Error('Function not implemented.')
                            }}
                            resetDefaultOrder={function (): void {
                                throw new Error('Function not implemented.')
                            }}
                            showSelectedColumns={function (): void {
                                throw new Error('Function not implemented.')
                            }}
                            columns={[
                                { technicalName: 'Tname', name: 'name', selected: false },
                                { technicalName: 'Tname2', name: 'name2', selected: false },
                                { technicalName: 'Tname3', name: 'name3', selected: false },
                                { technicalName: 'Tname4', name: 'name4', selected: false },
                                { technicalName: 'Tname5', name: 'name5', selected: false },
                                { technicalName: 'Tname6', name: 'name6', selected: false },
                                { technicalName: 'Tname7', name: 'name7', selected: false },
                                { technicalName: 'Tname8', name: 'name8', selected: false },
                                { technicalName: 'Tname9', name: 'name9', selected: false },
                            ]}
                            header={'header'}
                        />
                    )
                }}
            />

            <CiContainer entityName="KRIS" entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={View} />
            <RelationsListContainer entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={RelationsView} />
            <DocumentsListContainer configurationItemId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={DocsView} />
            <Paginator pagination={{ dataLength: 100, pageNumber: page, pageSize: 10 }} onPageChanged={setPage} />
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
