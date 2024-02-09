import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, CheckBox, Input } from '@isdd/idsk-ui-kit/index'
import {
    getReadCiNeighboursWithAllRelsQueryKey,
    getReadNeighboursConfigurationItemsCountQueryKey,
    useDeleteRelationshipHook,
    useGetUuidHook,
    useReadCiNeighboursHook,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { QueryFeedback, SubmitWithFeedback, formatDateForDefaultValue } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { boolean, mixed, object, string } from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import { getGetOlaContractQueryKey, getListOlaContractListQueryKey } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { getGetHistoryQueryKey, getGetMetaQueryKey, useGetContentHook } from '@isdd/metais-common/api/generated/dms-swagger'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { OLA_Kontrakt_dodavatela_ISVS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { ISVSSelect } from './ISVSSelect'

import { API_DATE_FORMAT } from '@/componentHelpers'
import { IOlaContractSaveView } from '@/components/containers/OlaContractAddContainer'

const getSchema = (t: TFunction) => {
    const schema = object()
        .shape({
            ['name']: string().required(t('validation.required')),
            ['nameEnglish']: string(),
            ['contractorIsvsUuid']: mixed().required(t('validation.required')),
            ['validityStartDate']: string().required(t('validation.required')),
            ['uuid']: string(),
            ['description']: string(),
            ['descriptionEnglish']: string(),
            ['code']: string(),
            ['referencingIdentifier']: string(),
            ['contractCode']: string(),
            ['validityEndDate']: string().nullable(),
            ['crzLink']: string(),
            ['vendorLock']: boolean(),
        })
        .defined()

    return schema
}

export const OlaContractSaveView: React.FC<IOlaContractSaveView> = ({
    isError,
    isLoading,
    ciCode,
    saveContract,
    ownerGid,
    olaContract,
    olaContractDocument,
    canChange,
    isOwnerOfContract,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        register,
        control,
        setValue,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(getSchema(t)),
        defaultValues:
            olaContract?.code && olaContract.referencingIdentifier
                ? {
                      ...olaContract,
                      name: olaContract?.name ?? '',
                      nameEnglish: olaContract?.nameEnglish ?? '',
                      description: olaContract?.description ?? '',
                      descriptionEnglish: olaContract?.descriptionEnglish ?? '',
                  }
                : { code: ciCode?.cicode, referencingIdentifier: ciCode?.ciurl },
    })
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const formDataRef = useRef<FieldValues>([])
    const generateUuid = useGetUuidHook()
    const readRels = useReadCiNeighboursHook()
    const deleteRel = useDeleteRelationshipHook()
    const queryClient = useQueryClient()
    const listKey = getListOlaContractListQueryKey()
    const dmsKey = getGetMetaQueryKey(olaContract?.uuid ?? '')
    const contractKey = getGetOlaContractQueryKey(olaContract?.uuid ?? '')
    const downloadVersionFile = useGetContentHook()
    const fileHistoryKey = getGetHistoryQueryKey(olaContract?.uuid ?? '')
    const relationsCountKey = getReadNeighboursConfigurationItemsCountQueryKey(olaContract?.uuid ?? '')
    const relationsKey = getReadCiNeighboursWithAllRelsQueryKey(olaContract?.uuid ?? '')
    const { getRequestStatus } = useGetStatus()
    const [showDocument, setShowDocument] = useState(false)
    const { setIsActionSuccess } = useActionSuccess()
    const location = useLocation()

    useEffect(() => {
        if (ciCode) {
            setValue('code', ciCode.cicode)
            setValue('referencingIdentifier', ciCode.ciurl)
        }
    }, [ciCode, setValue])

    const fileMetaAttributes = {
        'x-content-uuid': uuidV4(),
        refAttributes: new Blob(
            [
                JSON.stringify({
                    refType: 'STANDARD',
                }),
            ],
            { type: 'application/json' },
        ),
    }
    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const updateContract = (formData: FieldValues, invalidateFile?: boolean, uuid?: string) =>
        saveContract({
            data: {
                ...formDataRef.current,
                uuid: uuid,
                owner: ownerGid,
            },
        })
            .then(async () => {
                if (olaContract && olaContract.contractorIsvsUuid != formData['contractorIsvsUuid']) {
                    const rels = await readRels(olaContract.uuid ?? '', {
                        neighboursFilter: { metaAttributes: { state: ['DRAFT'] }, relType: [OLA_Kontrakt_dodavatela_ISVS] },
                        page: 1,
                        perpage: 10000,
                    })
                    rels.fromNodes?.neighbourPairs
                        ?.filter((n) => n.configurationItem?.uuid != formData['contractorIsvsUuid'])
                        .forEach(async (n) => {
                            const request = await deleteRel({
                                invalidateReason: { comment: 'zmena ISVS' },
                                type: OLA_Kontrakt_dodavatela_ISVS,
                                startUuid: olaContract.uuid,
                                endUuid: n.configurationItem?.uuid,
                                uuid: n.relationship?.uuid,
                            })
                            await getRequestStatus(request.requestId ?? '', () => null)
                        })
                }
            })
            .finally(() => {
                if (!isError) {
                    queryClient.invalidateQueries(listKey)
                    if (olaContract) {
                        if (invalidateFile) {
                            queryClient.invalidateQueries(dmsKey)
                            queryClient.invalidateQueries(fileHistoryKey)
                        }

                        if (olaContract && olaContract.contractorIsvsUuid != formData['contractorIsvsUuid']) {
                            queryClient.invalidateQueries(relationsCountKey)
                            queryClient.invalidateQueries(relationsKey)
                        }

                        queryClient.invalidateQueries(contractKey)
                    }
                    setIsActionSuccess({
                        value: true,
                        path: olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST,
                        additionalInfo: { type: olaContract ? 'edit' : 'create' },
                    })
                    navigate(olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST, {
                        state: { from: location },
                    })
                }
            })

    const handleUploadSuccess = (data: FileUploadData[]) => {
        updateContract(formDataRef.current, true, olaContract ? olaContract.uuid : data[0].fileId)
    }

    const onSubmit = async (formData: FieldValues) => {
        const uuid = olaContract?.uuid ?? (await generateUuid())
        formDataRef.current = { ...formData }
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
            return
        } else {
            updateContract(formData, false, uuid)
        }
    }

    const downloadFile = async (uuid: string) => {
        if (downloadVersionFile) {
            const blobData = await downloadVersionFile(uuid ?? '')
            downloadBlobAsFile(new Blob([blobData]), olaContractDocument?.filename ?? '', false)
        }
    }

    useEffect(() => {
        if (olaContractDocument) {
            setShowDocument(true)
        }
    }, [olaContractDocument])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <Input {...register('name')} label={t('olaContracts.filter.name')} required error={errors.name?.message} />
                <Input {...register('nameEnglish')} label={t('olaContracts.filter.nameEnglish')} />
                <Input {...register('description')} label={t('olaContracts.filter.description')} />
                <Input {...register('descriptionEnglish')} label={t('olaContracts.filter.descriptionEnglish')} />
                <Input {...register('contractCode')} label={t('olaContracts.filter.contractCode')} />
                <Input {...register('code')} label={t('olaContracts.filter.code')} disabled />
                <Input {...register('referencingIdentifier')} label={t('olaContracts.filter.referenceIdentifier')} disabled />
                <DateInput
                    handleDateChange={(date) =>
                        setValue('validityStartDate', date ? formatDateForDefaultValue(date.toISOString(), API_DATE_FORMAT) : '')
                    }
                    clearErrors={clearErrors}
                    control={control}
                    name={'validityStartDate'}
                    label={t('olaContracts.filter.intervalStart')}
                    error={errors.validityStartDate?.message}
                />
                <DateInput
                    handleDateChange={(date) =>
                        setValue('validityEndDate', date ? formatDateForDefaultValue(date.toISOString(), API_DATE_FORMAT) : '')
                    }
                    name={'validityEndDate'}
                    control={control}
                    label={t('olaContracts.filter.intervalEnd')}
                />
                <Input {...register('crzLink')} label={t('olaContracts.filter.crzLink')} />
                <CheckBox {...register('vendorLock')} label={t('olaContracts.filter.vendorLock')} id="vendorLock" />
                <Spacer vertical />
                <ISVSSelect
                    errors={errors}
                    setValue={setValue}
                    name="contractorIsvsUuid"
                    required
                    clearErrors={clearErrors}
                    uuid={olaContract?.contractorIsvsUuid}
                    additionalName="contractorIsvsName"
                />
                {showDocument && (
                    <InformationGridRow
                        label={t('olaContracts.filter.document')}
                        value={
                            olaContractDocument?.filename ? (
                                <Link to="#" onClick={() => downloadFile(olaContract?.uuid ?? '')}>
                                    {olaContractDocument?.filename}
                                </Link>
                            ) : (
                                t('olaContracts.detail.notEntered')
                            )
                        }
                    />
                )}
                <FileUpload
                    ref={fileUploadRef}
                    allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                    multiple={false}
                    isUsingUuidInFilePath
                    fileMetaAttributes={fileMetaAttributes}
                    onUploadSuccess={handleUploadSuccess}
                    customUuid={olaContract?.uuid}
                />
                <SubmitWithFeedback
                    disabled={!canChange || !isOwnerOfContract || !ownerGid}
                    submitButtonLabel={t('codeListDetail.button.save')}
                    loading={!!isLoading}
                    additionalButtons={[<Button key={1} variant="secondary" label={t('votes.voteEdit.cancel')} onClick={() => navigate(-1)} />]}
                />
            </QueryFeedback>
        </form>
    )
}
