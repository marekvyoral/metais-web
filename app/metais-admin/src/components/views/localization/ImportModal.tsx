import { BaseModal, RadioButton, RadioGroup, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { GetAllLocale, GetAllUserInterface, getGetAllQueryKey, TextConfDiff } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { UploadedUppyFile } from '@uppy/core'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { ImportTransJson } from './ImportTransJson'
import styles from './local.module.scss'
import { DiffLocalizationTable } from './DiffLocalizationTable'

type Props = {
    isOpen: boolean
    close: () => void
}

enum LocalizationImportFormEnum {
    LANG = 'language',
    USER_INTERFACE = 'userInterface',
    HARD_RESET = 'hardReset',
    IS_DIFF = 'isDiff',
    IS_UPDATE = 'isUpdate',
    METHOD = 'method',
}

type LocalizationImportForm = {
    userInterface: GetAllUserInterface
    language: GetAllLocale
    method: LocalizationImportFormEnum
}

export const ImportModal: React.FC<Props> = ({ isOpen, close }) => {
    const { t } = useTranslation()
    const { setIsActionSuccess } = useActionSuccess()
    const { setValue, watch, register, reset } = useForm<LocalizationImportForm>({
        defaultValues: {
            language: 'SK',
            userInterface: 'PORTAL',
            method: LocalizationImportFormEnum.IS_UPDATE,
        },
    })
    const { language, userInterface, method } = watch()

    const isDiff = method === LocalizationImportFormEnum.IS_DIFF
    const isUpdate = method === LocalizationImportFormEnum.IS_UPDATE
    const isHardReset = method === LocalizationImportFormEnum.HARD_RESET
    const noMethodChosen = !isDiff && !isUpdate && !isHardReset

    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false)
    const [responseSelection, setResponseSelection] = useState<TextConfDiff[]>([])
    const [isSuccess, setIsSuccess] = useState(false)

    const FILE_FIELD_NAME = 'jsonFile'
    const baseURL = import.meta.env.VITE_API_BASE_URL
    const UPDATE_API_PATH = '/global-config/textConf/updateByFile'
    const HARD_RESET_API_PATH = '/global-config/textConf/saveByFile'
    const DIFF_BY_FILE_API_PATH = '/global-config/textConf/getDiffByFile'

    const updateEndpointUrl = `${baseURL}${UPDATE_API_PATH}?locale=${language}&userInterface=${userInterface}`
    const hardResetEndpointUrl = `${baseURL}${HARD_RESET_API_PATH}?locale=${language}&userInterface=${userInterface}&processingType=HARD_RESET`
    const getDiffEndpointUrl = `${baseURL}${DIFF_BY_FILE_API_PATH}?locale=${language}&userInterface=${userInterface}`

    const queryClient = useQueryClient()
    const onSuccess = (response: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>[] | undefined) => {
        if (method === LocalizationImportFormEnum.IS_DIFF) {
            setIsDiffModalOpen(true)
            setResponseSelection(response?.[0].response?.body as unknown as TextConfDiff[])
            setIsSuccess(true)
        } else {
            const getAllQK = getGetAllQueryKey({ locale: language, userInterface })
            queryClient.invalidateQueries(getAllQK)
            setIsActionSuccess({ value: true, path: AdminRouteNames.LOCALIZATION, additionalInfo: { import: 'import' } })
        }
        close()
    }

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                close={() => {
                    close()
                    setIsSuccess(false)
                    reset()
                }}
            >
                <div className={styles.modalHeading}>
                    <TextHeading size="XL">{t('localization.updateByFileHeading')}</TextHeading>
                </div>

                <SimpleSelect
                    isClearable={false}
                    label={t('localization.filter.lang')}
                    name={LocalizationImportFormEnum.LANG}
                    options={[
                        { label: t('localization.filter.sk'), value: GetAllLocale.SK },
                        { label: t('localization.filter.en'), value: GetAllLocale.EN },
                    ]}
                    setValue={setValue}
                    value={language}
                />
                <SimpleSelect
                    isClearable={false}
                    label={t('localization.filter.type')}
                    name={LocalizationImportFormEnum.USER_INTERFACE}
                    options={[
                        { label: t('localization.portal'), value: GetAllUserInterface.PORTAL },
                        { label: t('localization.admin'), value: GetAllUserInterface.ADMIN },
                    ]}
                    setValue={setValue}
                    value={userInterface}
                />

                <RadioGroup label={t('localization.import.methodLegend')}>
                    <RadioButton
                        id={LocalizationImportFormEnum.IS_UPDATE}
                        label={t('localization.import.isUpdate')}
                        info={t('localization.import.isUpdateInfo')}
                        {...register(LocalizationImportFormEnum.METHOD)}
                        value={LocalizationImportFormEnum.IS_UPDATE}
                    />
                    <RadioButton
                        id={LocalizationImportFormEnum.HARD_RESET}
                        value={LocalizationImportFormEnum.HARD_RESET}
                        label={t('localization.import.hardReset')}
                        info={t('localization.import.hardResetInfo')}
                        {...register(LocalizationImportFormEnum.METHOD)}
                    />
                    <RadioButton
                        id={LocalizationImportFormEnum.IS_DIFF}
                        value={LocalizationImportFormEnum.IS_DIFF}
                        label={t('localization.import.isDiff')}
                        info={t('localization.import.isDiffInfo')}
                        {...register(LocalizationImportFormEnum.METHOD)}
                    />
                </RadioGroup>

                <ImportTransJson
                    onSuccess={onSuccess}
                    close={() => {
                        close()
                        reset()
                    }}
                    fileFieldName={FILE_FIELD_NAME}
                    endpointUrl={isDiff ? getDiffEndpointUrl : isHardReset ? hardResetEndpointUrl : updateEndpointUrl}
                    method={isDiff || isHardReset ? 'POST' : 'PUT'}
                    isHardReset={isHardReset}
                    disabled={noMethodChosen}
                />
            </BaseModal>
            <BaseModal
                isOpen={isDiffModalOpen}
                close={() => {
                    setIsDiffModalOpen(false)
                    setIsSuccess(false)
                }}
            >
                <MutationFeedback success={isSuccess} successMessage={t('localization.import.diffSuccess')} />
                <TextHeading size="XL">{t('localization.diffModal.heading')}</TextHeading>
                <DiffLocalizationTable data={responseSelection} />
            </BaseModal>
        </>
    )
}
