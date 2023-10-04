import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import React, { useState } from 'react'

import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocsView } from '@/components/containers/DocumentListContainer.stories'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { RelationsView } from '@/components/containers/RelationsListContainer.stories'
import { ExportItemsOrRelations } from '@/components/export-items-or-relations/ExportItemsOrRelations'
import { MainContentWrapper } from '@/components/MainContentWrapper'
// import { ActionsOverTable } from '@/components/actions-over-table/ActionsOverTable'

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
        <MainContentWrapper>
            <h4>Obrazovka na testovanie komponentov</h4>
            {/* <ActionsOverTable entityName={'abc'} /> */}
            {/* <AttributesContainer
                entityName="KRIS"
                View={() => {
                    return <CiContainer configurationItemId="0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e" View={View} />
                }}
            /> */}
            <RichTextQuill id="rich" name="rich" />
            {/* <ActionsOverTable /> */}
            <Button label={'Modal open'} onClick={openModal} />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />
            <ButtonLink label="ButtonLink" />

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
        </MainContentWrapper>
    )
}
