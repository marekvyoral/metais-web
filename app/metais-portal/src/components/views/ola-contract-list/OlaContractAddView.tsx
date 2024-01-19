import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, CheckBox, Input } from '@isdd/idsk-ui-kit/index'
import { useGetUuidHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileUpload, FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { QueryFeedback, SubmitWithFeedback, formatDateForDefaultValue } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import React, { useCallback, useEffect, useRef } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { boolean, mixed, object, string } from 'yup'

import { ISVSSelect } from './ISVSSelect'

import { API_DATE_FORMAT } from '@/componentHelpers'
import { IOlaContractAddView } from '@/components/containers/OlaContractAddContainer'

const getSchema = (t: TFunction) => {
    const schema = object()
        .shape({
            ['name']: string().required(t('validation.required')),
            ['contractorIsvsUuid']: mixed().required(t('validation.required')),
            ['validityStartDate']: string().required(t('validation.required')),
            ['uuid']: string(),
            ['description']: string(),
            ['code']: string(),
            ['referencingIdentifier']: string(),
            ['contractCode']: string(),
            ['validityEndDate']: string(),
            ['crzLink']: string(),
            ['vendorLock']: boolean(),
        })
        .defined()

    return schema
}

export const OlaContractAddView: React.FC<IOlaContractAddView> = ({ isError, isLoading, ciCode, saveContract, ownerGid }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        register,
        control,
        setValue,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({ resolver: yupResolver(getSchema(t)) })
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const formDataRef = useRef<FieldValues>([])
    const generateUuid = useGetUuidHook()
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

    const handleUploadSuccess = (data: FileUploadData[]) => {
        setValue('uuid', data[0].fileId)
        saveContract({ data: { ...formDataRef.current, owner: ownerGid } })
    }

    const onSubmit = async (formData: FieldValues) => {
        const uuid = await generateUuid()
        formDataRef.current = { ...formData }
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            handleUploadData()
            return
        } else {
            saveContract({
                data: {
                    ...formDataRef.current,
                    uuid: uuid,
                    owner: ownerGid,
                },
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <Input {...register('name')} label={t('olaContracts.filter.name')} required error={errors.name?.message} />
                <Input {...register('description')} label={t('olaContracts.filter.description')} />
                <Input {...register('contractCode')} label={t('olaContracts.filter.contractCode')} />
                <Input {...register('code')} label={t('olaContracts.filter.code')} disabled value={ciCode?.cicode} />
                <Input {...register('referencingIdentifier')} label={t('olaContracts.filter.referenceIdentifier')} disabled value={ciCode?.ciurl} />
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
                    label={t('olaContracts.filter.intervalStart')}
                />
                <Input {...register('crzLink')} label={t('olaContracts.filter.crzLink')} />
                <CheckBox {...register('vendorLock')} label={t('olaContracts.filter.vendorLock')} id="vendorLock" />
                <Spacer vertical />
                <ISVSSelect errors={errors} setValue={setValue} name="contractorIsvsUuid" required clearErrors={clearErrors} />
                <FileUpload
                    ref={fileUploadRef}
                    allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif']}
                    multiple
                    isUsingUuidInFilePath
                    fileMetaAttributes={fileMetaAttributes}
                    onUploadSuccess={handleUploadSuccess}
                />
                <SubmitWithFeedback
                    submitButtonLabel={t('codeListDetail.button.save')}
                    loading={!!isLoading}
                    additionalButtons={[<Button key={1} variant="secondary" label={t('votes.voteEdit.cancel')} onClick={() => navigate(-1)} />]}
                />
            </QueryFeedback>
        </form>
    )
}
