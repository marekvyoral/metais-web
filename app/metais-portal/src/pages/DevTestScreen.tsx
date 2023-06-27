import React, { useState } from 'react'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { TableSelectColumns } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'

import { CiContainer } from '@/components/containers/CiContainer'
import { View } from '@/components/containers/CiContainer.stories'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { RelationsView } from '@/components/containers/RelationsListContainer.stories'
import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocsView } from '@/components/containers/DocumentListContainer.stories'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ExportItemsOrRelations } from '@/components/export-items-or-relations/ExportItemsOrRelations'

export const DevTestScreen: React.FC = () => {
    const [page, setPage] = useState(5)
    const [modalOpen, setModalOpen] = useState(false)
    const openModal = () => {
        setModalOpen(true)
    }
    const onClose = () => {
        setModalOpen(false)
    }
    const onExportStart = (exportValue: string, extension: string) => {
        // eslint-disable-next-line no-console
        console.log(exportValue, extension)
    }
    return (
        <>
            <h4>Obrazovka na testovanie komponentov</h4>
            <AttributesContainer
                entityName="KRIS"
                View={() => {
                    return <CiContainer configurationItemId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={View} />
                }}
            />
            <Button label={'Modal open'} onClick={openModal} />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />
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

            <RelationsListContainer entityId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" technicalName="Dokument" View={RelationsView} />
            <DocumentsListContainer configurationItemId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={DocsView} />
            <Paginator dataLength={100} pageNumber={page} pageSize={10} onPageChanged={setPage} />
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
