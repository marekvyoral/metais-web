import { BaseModal, Button, TextArea, TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState, useGenerateReferenceRegisterByUuidHook } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { FileImportDragDrop } from '@isdd/metais-common/components/file-import/FileImportDragDrop'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar } from '@uppy/react'
import { FileImportList } from '@isdd/metais-common/components/file-import/FileImportList'
import { FieldValues, useForm } from 'react-hook-form'
import { useUppy } from '@isdd/metais-common/hooks/useUppy'
import { DMS_DOWNLOAD_BASE, DMS_DOWNLOAD_FILE, FileImportStepEnum } from '@isdd/metais-common/index'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import stylesImport from '@isdd/metais-common/components/file-import/FileImport.module.scss'
import { UppyFile } from '@uppy/core'
import { v4 as uuidV4 } from 'uuid'
import { ApiStandardRequestRequestChannel, useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'

import { downloadFile } from '@/components/views/documents/utils'
import { RefRegisterStateMachine } from '@/pages/refregisters/[entityId]'

interface IRefRegisterChangeStateModal {
    openChangeStateDialog: boolean
    setOpenChangeStateDialog: (open: boolean) => void
    entityId: string
    targetState: ApiReferenceRegisterState | undefined
    handleChangeState: (attachementIds: string[], description: string) => Promise<void>
    entityItemName: string
}

export const RefRegisterChangeStateModal = ({
    openChangeStateDialog,
    setOpenChangeStateDialog,
    entityId,
    targetState,
    handleChangeState,
    entityItemName,
}: IRefRegisterChangeStateModal) => {
    const refRegisterStateContext = useContext(RefRegisterStateMachine)

    const { handleSubmit, register, reset } = useForm()

    const machine = useStateMachine({ stateContext: refRegisterStateContext })

    const { t } = useTranslation()
    const [fileImportStep, setFileImportStep] = useState<FileImportStepEnum>(FileImportStepEnum.VALIDATE)

    const generate = useGenerateReferenceRegisterByUuidHook()
    const standardRequest = useCreateStandardRequest()
    const { uppy, currentFiles, handleRemoveFile, uploadFilesStatus, handleUpload, generalErrorMessages, removeGeneralErrorMessages } = useUppy({
        multiple: true,
        fileImportStep,
        endpointUrl: `${DMS_DOWNLOAD_BASE}`,
        setFileImportStep,
        setCustomFileMeta: () => {
            const id = uuidV4()
            return {
                'x-content-uuid': id,
                refAttributes: new Blob(
                    [
                        JSON.stringify({
                            refType: 'STANDARD',
                        }),
                    ],
                    { type: 'application/json' },
                ),
            }
        },
    })

    const requestData = {
        version: 1,
        srName: 'Žiadosť o zaradenie ISVS: ' + entityItemName + ' do zoznamu referenčných registrov',
        srDescription1:
            'Vecný popis návrhu nového štandardu: Základné údaje referenčného registra aopis referenčných údajov je uvedený v priloženom súbore.',
        srDescription2: '-',
        srDescription3: '-',
        srDescription4: '-',
        srDescription5: '-',
        srDescription6: '-',
        attachments: [],
        requestChannel: ApiStandardRequestRequestChannel.RR,
        requestChannelAttributes: [
            {
                attributeName: 'rr_uuid',
                attributeValue: entityId,
            },
        ],
    }

    const onSubmit = async (formValues: FieldValues) => {
        if (targetState) {
            if (targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS) {
                const metadata = await generate(entityId)

                downloadFile(`${DMS_DOWNLOAD_FILE}${metadata?.uuid}`, metadata?.uuid ?? '')
            }
            if (targetState === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS) {
                const metadata = await generate(entityId)
                standardRequest.mutateAsync({
                    data: {
                        ...requestData,
                        attachments: [
                            {
                                attachmentId: entityId,
                                attachmentName: metadata.filename,
                                attachmentSize: metadata.contentLength,
                            },
                        ],
                    },
                })
            }

            if (currentFiles?.length > 0) await handleUpload()
            const currentFilesIds = currentFiles?.map((file: UppyFile) => file.meta['x-content-uuid'] as string)
            await handleChangeState(currentFilesIds ?? [], formValues?.description)
            machine.changeState(targetState)
            reset()
            setOpenChangeStateDialog(false)
        }
    }

    return (
        <BaseModal isOpen={openChangeStateDialog} close={() => setOpenChangeStateDialog(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    {targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS && (
                        <>
                            <TextBody size="S">{t('refRegisters.header.MPKheading1')}</TextBody>
                            <TextBody size="S">{t('refRegisters.header.MPKheading2')}</TextBody>
                        </>
                    )}
                    <TextArea rows={3} {...register('description')} label={t('refRegisters.header.description')} />
                    <FileImportDragDrop uppy={uppy} />
                    <div>
                        <StatusBar
                            className={stylesImport.statusBar}
                            uppy={uppy}
                            hideAfterFinish={false}
                            hideCancelButton
                            hidePauseResumeButton
                            hideRetryButton
                            hideUploadButton
                        />
                        <FileImportList
                            handleRemoveFile={handleRemoveFile}
                            fileList={currentFiles}
                            uploadFilesStatus={uploadFilesStatus}
                            generalErrorMessages={generalErrorMessages}
                            removeGeneralErrorMessages={removeGeneralErrorMessages}
                        />
                    </div>
                    <Button
                        label={
                            targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS
                                ? t('refRegisters.header.submitMPK')
                                : t('refRegisters.header.submit')
                        }
                        type="submit"
                    />
                </>
            </form>
        </BaseModal>
    )
}
