import { BaseModal, TextArea, TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState, useGenerateReferenceRegisterByUuidHook } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useCallback, useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { DMS_DOWNLOAD_FILE, ModalButtons } from '@isdd/metais-common/index'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { ApiStandardRequest, ApiStandardRequestRequestChannel, useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { CiRefAttributes, RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'

import { downloadFile } from '@/components/views/documents/utils'
import { RefRegisterStateMachine } from '@/pages/refregisters/[entityId]'

interface IRefRegisterChangeStateModal {
    openChangeStateDialog: boolean
    setOpenChangeStateDialog: (open: boolean) => void
    entityId: string
    targetState: ApiReferenceRegisterState | undefined
    handleChangeState: (attachementIds: string[], description: string) => Promise<void>
    entityItemName: string
    owner: string
}

export const RefRegisterChangeStateModal = ({
    openChangeStateDialog,
    setOpenChangeStateDialog,
    entityId,
    targetState,
    handleChangeState,
    entityItemName,
    owner,
}: IRefRegisterChangeStateModal) => {
    const refRegisterStateContext = useContext(RefRegisterStateMachine)

    const { handleSubmit, register, reset } = useForm()

    const machine = useStateMachine({ stateContext: refRegisterStateContext })

    const { t } = useTranslation()
    const [desc, setDesc] = useState('')

    const generate = useGenerateReferenceRegisterByUuidHook()
    const standardRequest = useCreateStandardRequest()
    const fileUploadRef = useRef<IFileUploadRef>(null)

    const requestData: ApiStandardRequest = {
        name: 'Žiadosť o zaradenie ISVS: ' + entityItemName + ' do zoznamu referenčných registrov',
        description:
            'Vecný popis návrhu nového štandardu: Základné údaje referenčného registra aopis referenčných údajov je uvedený v priloženom súbore.',
        attachments: [],
        requestChannel: ApiStandardRequestRequestChannel.RR,
        requestChannelAttributes: [
            {
                attributeName: 'rr_uuid',
                attributeValue: entityId,
            },
        ],
    }

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const onStandardRequestSuccess = () => {
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
        }
    }

    const handleUploadSuccess = async (data: FileUploadData[]) => {
        const currentFilesIds = data?.map((file: FileUploadData) => file.fileId ?? '')
        await handleChangeState(currentFilesIds ?? [], desc)
        targetState && machine.changeState(targetState)
        reset()
        setOpenChangeStateDialog(false)
    }

    const updateStateAndReset = () => {
        targetState && machine.changeState(targetState)
        reset()
        setOpenChangeStateDialog(false)
    }

    const onSubmit = async (formValues: FieldValues) => {
        if (targetState) {
            setDesc(formValues.description)
            if (targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS) {
                const metadata = await generate(entityId)

                downloadFile(`${DMS_DOWNLOAD_FILE}${metadata?.uuid}`, metadata?.uuid ?? '')
                updateStateAndReset()
            }
            if (targetState === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS) {
                const metadata = await generate(entityId)
                standardRequest.mutateAsync(
                    {
                        data: {
                            ...requestData,
                            attachments: [
                                {
                                    attachmentId: entityId,
                                    attachmentName: metadata.filename,
                                },
                            ],
                        },
                    },
                    { onSuccess: onStandardRequestSuccess, onError: onStandardRequestSuccess },
                )
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    handleUploadData()
                } else {
                    handleChangeState([], desc)
                    updateStateAndReset()
                }
            } else {
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    handleUploadData()
                } else {
                    handleChangeState([], desc)
                    updateStateAndReset()
                }
            }
        }
    }

    const refDmsObject: CiRefAttributes = {
        refCiTechnicalName: 'ReferenceRegister',
        refCiOwner: owner,
        refType: RefAttributesRefType.CI,
        refCiId: entityId,
    }
    const fileMetaAttributes = {
        refAttributes: new Blob([JSON.stringify(refDmsObject)], { type: 'application/json' }),
    }

    return (
        <BaseModal isOpen={openChangeStateDialog} close={() => setOpenChangeStateDialog(false)}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <>
                    {targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS && (
                        <>
                            <TextBody size="S">{t('refRegisters.header.MPKheading1')}</TextBody>
                            <TextBody size="S">{t('refRegisters.header.MPKheading2')}</TextBody>
                        </>
                    )}
                    <TextArea rows={3} {...register('description')} label={t('refRegisters.header.description')} />

                    <FileUpload
                        ref={fileUploadRef}
                        allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                        multiple
                        refType={RefAttributesRefType.CI}
                        onUploadSuccess={handleUploadSuccess}
                        refId={entityId}
                        fileMetaAttributes={fileMetaAttributes}
                    />

                    <ModalButtons
                        submitButtonLabel={
                            targetState === ApiReferenceRegisterState.MPK_IN_PROGRESS
                                ? t('refRegisters.header.submitMPK')
                                : t('refRegisters.header.submit')
                        }
                        onClose={() => setOpenChangeStateDialog(false)}
                    />
                </>
            </form>
        </BaseModal>
    )
}
