import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { DocumentsListContainer } from '@/components/containers/DocumentListContainer'
import { DocsView } from '@/components/containers/DocumentListContainer.stories'
import { ExportItemsOrRelations } from '@/components/export-items-or-relations/ExportItemsOrRelations'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { SelectMeetingGroupWithActors } from '@/components/views/standardization/meetings/SelectMeetingGroupWithActors'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'

export interface IForm {
    [MeetingFormEnum.MEETING_ACTORS]: string[]
    [MeetingFormEnum.GROUP]: string[]
}

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

    const { handleSubmit, setValue, formState, watch } = useForm<IForm>()

    const onSubmit = (data: IForm) => {
        // eslint-disable-next-line no-console
        console.log({ [MeetingFormEnum.MEETING_ACTORS]: data[MeetingFormEnum.MEETING_ACTORS], [MeetingFormEnum.GROUP]: data[MeetingFormEnum.GROUP] })
    }

    return (
        <MainContentWrapper>
            <h4>Obrazovka na testovanie komponentov</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SelectMeetingGroupWithActors setValue={setValue} errors={formState.errors} watch={watch} />
                <button type="submit"> Ulozit</button>
            </form>
            <RichTextQuill id="rich" name="rich" />
            {/* <ActionsOverTable /> */}
            <Button label={'Modal open'} onClick={openModal} />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />
            <ButtonLink label="ButtonLink" />

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
