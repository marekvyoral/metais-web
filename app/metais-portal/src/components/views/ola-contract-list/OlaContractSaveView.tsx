import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, CheckBox, ErrorBlock, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
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
import { boolean, mixed, object, string } from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import {
    RequestIdUi,
    getGetOlaContractQueryKey,
    getListOlaContractListQueryKey,
    useGetOlaContractHook,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { RefAttributesRefType, getGetHistoryQueryKey, getGetMeta1QueryKey, useGetContentHook } from '@isdd/metais-common/api/generated/dms-swagger'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { OLA_Kontrakt, OLA_Kontrakt_dodavatela_ISVS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { v4 as uuidV4 } from 'uuid'

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
            ['validityEndDate']: string()
                .nullable()
                .when('validityStartDate', (validityStartDate, dateSchema) => {
                    return dateSchema.test({
                        name: 'validityEndDate',
                        test: function (value) {
                            const startDate = new Date(validityStartDate[0])
                            const endDate = new Date(value ?? '')
                            if (!value) return true
                            if (!validityStartDate[0]) return true
                            return (
                                startDate <= endDate ||
                                this.createError({
                                    message: t('validation.endTimeBeforeStartTime', {
                                        startTime: t('olaContracts.filter.intervalStart'),
                                        endTime: t('olaContracts.filter.intervalEnd'),
                                    }),
                                })
                            )
                        },
                    })
                }),
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
    isEdit,
    contractState,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        register,
        control,
        setValue,
        handleSubmit,
        clearErrors,
        formState: { errors, isValid, isSubmitted },
        watch,
        trigger,
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
    const dmsKey = getGetMeta1QueryKey(olaContract?.uuid ?? '')
    const contractKey = getGetOlaContractQueryKey(olaContract?.uuid ?? '')
    const downloadVersionFile = useGetContentHook()
    const fileHistoryKey = getGetHistoryQueryKey(olaContract?.uuid ?? '')
    const relationsCountKey = getReadNeighboursConfigurationItemsCountQueryKey(olaContract?.uuid ?? '')
    const relationsKey = getReadCiNeighboursWithAllRelsQueryKey(olaContract?.uuid ?? '')
    const { getRequestStatus, isLoading: isRequestProcessing } = useGetStatus()
    const [showDocument, setShowDocument] = useState(false)
    const { setIsActionSuccess } = useActionSuccess()
    const location = useLocation()
    const getOlaContract = useGetOlaContractHook()

    useEffect(() => {
        if (ciCode) {
            setValue('code', ciCode.cicode)
            setValue('referencingIdentifier', ciCode.ciurl)
        }
    }, [ciCode, setValue])

    const intervalEndValue = watch('validityEndDate')
    useEffect(() => {
        if (intervalEndValue && isSubmitted) {
            trigger()
        }
    }, [intervalEndValue, isSubmitted, trigger])

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const redirectsOnSuccess = (formData: FieldValues, invalidateFile?: boolean) => {
        if (!isError) {
            queryClient.invalidateQueries(listKey)
            if (olaContract) {
                if (invalidateFile) {
                    queryClient.invalidateQueries(dmsKey)
                    queryClient.invalidateQueries(fileHistoryKey)
                }

                queryClient.invalidateQueries(contractKey)
            }
            setIsActionSuccess({
                value: true,
                path: olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST,
                additionalInfo: { type: olaContract ? 'edit' : 'create' },
            })
        }
        if (!olaContract || olaContract.contractorIsvsUuid == formData['contractorIsvsUuid']) {
            navigate(olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST, {
                state: { from: location },
            })
        }
    }

    const updateContract = (formData: FieldValues, invalidateFile?: boolean, uuid?: string) =>
        saveContract({
            data: {
                ...formDataRef.current,
                uuid: uuid,
                owner: ownerGid,
                profilState: contractState,
            },
        })
            .then(async (res) => {
                await getRequestStatus((res as RequestIdUi).requestId ?? '', () => null)
                const newOla = await getOlaContract(uuid ?? '')
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    fileUploadRef.current?.setCustomMeta({
                        'x-content-uuid': uuidV4(),
                        refAttributes: new Blob(
                            [
                                JSON.stringify({
                                    refType: RefAttributesRefType.CI,
                                    refCiId: uuid,
                                    refCiTechnicalName: OLA_Kontrakt,
                                    refCiOwner: newOla?.owner,
                                }),
                            ],
                            { type: 'application/json' },
                        ),
                    })
                    handleUploadData()
                }

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

                            queryClient.invalidateQueries(relationsCountKey)
                            queryClient.invalidateQueries(relationsKey)
                            queryClient.invalidateQueries(contractKey)

                            navigate(olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST, {
                                state: { from: location },
                            })
                        })
                }
            })
            .finally(() => {
                redirectsOnSuccess(formData, invalidateFile)
            })

    const handleUploadSuccess = (data: FileUploadData[]) => {
        queryClient.invalidateQueries(getGetHistoryQueryKey(data.at(0)?.fileId ?? ''))
        queryClient.invalidateQueries(getGetMeta1QueryKey(data.at(0)?.fileId ?? ''))
    }

    const onSubmit = async (formData: FieldValues) => {
        const uuid = olaContract?.uuid ?? (await generateUuid())
        formDataRef.current = { ...formData }
        updateContract(formData, false, uuid)
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
        <>
            <TextHeading size="XL">
                {isEdit ? t('olaContracts.headingEdit', { itemName: olaContract?.name }) : t('olaContracts.headingAdd')}
            </TextHeading>

            {isSubmitted && !isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <QueryFeedback loading={isLoading || isRequestProcessing} error={isError} withChildren>
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
                        setValue={setValue}
                    />
                    <DateInput
                        handleDateChange={(date) =>
                            setValue('validityEndDate', date ? formatDateForDefaultValue(date.toISOString(), API_DATE_FORMAT) : '')
                        }
                        name={'validityEndDate'}
                        control={control}
                        label={t('olaContracts.filter.intervalEnd')}
                        error={errors.validityEndDate?.message}
                        setValue={setValue}
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
                        refType={RefAttributesRefType.CI}
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
        </>
    )
}
