import { IOption } from '@isdd/idsk-ui-kit/index'
import { User } from '@isdd/metais-common/contexts/auth/authContext'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import { FieldValues } from 'react-hook-form'
import { ApiAttachment, ApiStandardRequestPreviewList, ApiVote } from '@isdd/metais-common/api/generated/standards-swagger'

import { VoteStateEnum } from '../../voteProps'
import { ExistingFileData } from '../components/ExistingFilesHandler/ExistingFilesHandler'

import { FileUploadData } from '@/components/FileUpload/FileUpload'

export const getStandardRequestOptions = (allStandardRequestDataArray: ApiStandardRequestPreviewList | undefined): IOption<number | undefined>[] => {
    return (
        allStandardRequestDataArray?.standardRequests?.map((sr) => {
            return { value: sr.id, label: sr.srName ?? '' }
        }) ?? []
    )
}

export const getPageTitle = (newVote: boolean, t: TFunction) => {
    if (newVote) {
        return t('votes.voteEdit.newVoteTitle')
    }
    return `${t('votes.voteEdit.editVoteTitle')}`
}

export const mapUploadedFilesToApiAttachment = (uploadData: FileUploadData[]): ApiAttachment[] => {
    const filteredFilesUploadData = uploadData.filter((ud) => !ud.hasError)
    const apiAttachmentData = new Array<FileUploadData>(...filteredFilesUploadData).map((uploadedData) => {
        return {
            attachmentId: uploadedData.fileId,
            attachmentName: uploadedData.fileName,
            attachmentSize: uploadedData.fileSize,
            attachmentType: uploadedData.fileType,
            attachmentDescription: '',
        }
    })
    return apiAttachmentData
}

export const mapProcessedExistingFilesToApiAttachment = (data: ExistingFileData[]): ApiAttachment[] => {
    const apiAttachmentData = new Array<ExistingFileData>(...data).map((processedData) => {
        return {
            attachmentId: processedData.fileId,
            attachmentName: processedData.fileName,
            attachmentSize: processedData.fileSize,
            attachmentType: processedData.fileType,
            attachmentDescription: '',
        }
    })
    return apiAttachmentData
}

export const mapFormToApiRequestBody = (
    formData: FieldValues,
    editedVoteId: number | undefined,
    user: User | null,
    attachments: ApiAttachment[],
): ApiVote => {
    return {
        ...(editedVoteId && { id: editedVoteId }),
        name: formData.voteSubject,
        description: formData.voteDescription,
        createdAt: formatDateTimeForDefaultValue(`${new Date()}`, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        effectiveFrom: formData.effectiveFrom && formatDateTimeForDefaultValue(formData.effectiveFrom, "yyyy-MM-dd'T'00:00:00.000"),
        effectiveTo: formData.effectiveTo && formatDateTimeForDefaultValue(formData.effectiveTo, "yyyy-MM-dd'T'23:59:59.999"),
        voteState: VoteStateEnum.CREATED,
        secret: formData.secretVote,
        veto: formData.vetoRight,
        createdBy: user?.displayName ?? '',
        actionDesription: formData.description,
        standardRequestId: formData.standardRequest,
        voteActors: formData.invitedUsers,
        voteChoices: formData.answerDefinitions,
        attachments: attachments,
        links: formData.documentLinks,
    }
}
