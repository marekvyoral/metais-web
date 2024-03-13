import { yupResolver } from '@hookform/resolvers/yup'
import {
    BaseModal,
    ButtonLink,
    ButtonPopup,
    CheckBox,
    ConfirmationModal,
    Input,
    LoadingIndicator,
    SimpleSelect,
    TextArea,
    TextBody,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ApiSlaParameterRead } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { boolean, object, string } from 'yup'

import styles from './styles.module.scss'

import { IView } from '@/components/containers/sla-detail/SLADetailContainer'

type ModifiedApiSlaParameterRead = Omit<ApiSlaParameterRead, 'value'> & { value: string | boolean }

export const SlaDetailView: React.FC<IView> = ({
    ci,
    parameterTypes,
    parametersList,
    isLoading,
    isError,
    valueTypes,
    slaId,
    valueUnitsEnum,
    valueTypesEnum,
    isOwnerByGid,
    plannedAccessTimeEnum,
    entityName,
    updateParam,
    invalidateSla,
    isUpdateError,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()

    const [showAll, setShowAll] = useState(false)
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(false)
    const [isInvalidateSuccess, setIsInvalidateSuccess] = useState(false)
    const [invalidateItem, setInvalidateItem] = useState<ApiSlaParameterRead>()
    const [updateItem, setUpdateItem] = useState<ApiSlaParameterRead>()
    const itemType = parameterTypes.find((i) => i.code == updateItem?.slaParamTypeCode)?.valueType

    const {
        register,
        setValue,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<ModifiedApiSlaParameterRead>({
        defaultValues: { ...updateItem },
        resolver: yupResolver(
            object().shape({
                value:
                    itemType === 'BOOLEAN'
                        ? boolean().oneOf([true], t('validation.required')).required(t('validation.required'))
                        : string().required(t('validation.required')),
            }),
        ),
    })

    const canEdit = !!user && isOwnerByGid?.isOwner?.[0].owner

    const getList = () => {
        const list = showAll ? parametersList : parametersList.filter((i) => i.isValid == true)
        const firstItem = list.find((i) => i.uuid == slaId)
        if (firstItem) {
            const firstItemIndex = list.indexOf(firstItem)
            list.splice(firstItemIndex, 1)
            list.splice(0, 0, firstItem)
        }
        return list
    }

    const getUpdateItemValueType = (item?: ApiSlaParameterRead) => {
        switch (parameterTypes.find((i) => i.code == item?.slaParamTypeCode)?.valueType) {
            case 'NUMBER':
                return <Input type="number" {...register('value')} defaultValue={item?.value} error={errors.value?.message} />
            case 'BOOLEAN':
                return <CheckBox label="" id="" {...register('value')} error={errors.value?.message} defaultChecked={item?.value == 'true'} />
            case 'ENUM':
                return (
                    <SimpleSelect
                        isClearable={false}
                        label=""
                        id=""
                        name="value"
                        setValue={setValue}
                        options={plannedAccessTimeEnum?.map((i) => ({ label: i.value ?? '', value: i.code ?? '' })) ?? []}
                        defaultValue={item?.value}
                        error={errors.value?.message}
                    />
                )

            default:
                return <Input {...register('value')} defaultValue={item?.value} error={errors.value?.message} />
        }
    }

    const getParamValue = (parameter: ApiSlaParameterRead) => {
        if (parameter.slaParamTypeCode == 'PlannedAvailabilityTimeAS') {
            return plannedAccessTimeEnum?.find((i) => i.code == parameter.value)?.value
        }
        return (
            parameter.value +
            ' ' +
            valueUnitsEnum?.find((vu) => vu.code == parameterTypes.find((pt) => pt.code == parameter.slaParamTypeCode)?.unit)?.value
        )
    }

    const getSectionTitle = (parameter: ApiSlaParameterRead) =>
        parameterTypes.find((pt) => pt.code == parameter.slaParamTypeCode)?.name +
        ' - ' +
        parameterTypes.find((pt) => pt.code == parameter.slaParamTypeCode)?.description

    const onSubmit = (data: ModifiedApiSlaParameterRead) => {
        updateParam({ ...updateItem, ...data, value: data.value.toString() }).finally(() => {
            setUpdateItem(undefined)
            if (isUpdateError == false) {
                setIsUpdateSuccess(true)
            }
        })
    }

    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (isUpdateError || isUpdateSuccess) {
            scrollToMutationFeedback()
        }
    }, [isUpdateError, isUpdateSuccess, scrollToMutationFeedback])

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            <ConfirmationModal
                isOpen={!!invalidateItem}
                title={t('sla-detail.invalidateParameter')}
                content={
                    <>
                        <TextHeading size="L">{parameterTypes.find((pt) => pt.code == invalidateItem?.slaParamTypeCode)?.name}</TextHeading>
                        <TextBody size="L">{parameterTypes.find((pt) => pt.code == invalidateItem?.slaParamTypeCode)?.description}</TextBody>
                    </>
                }
                okButtonLabel={t('sla-detail.invalidate')}
                onClose={() => setInvalidateItem(undefined)}
                onConfirm={() =>
                    invalidateSla(invalidateItem?.uuid ?? '').then(() => {
                        setInvalidateItem(undefined)
                        if (isUpdateError == false) {
                            setIsInvalidateSuccess(true)
                        }
                    })
                }
            />
            <BaseModal isOpen={!!updateItem} close={() => setUpdateItem(undefined)}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.modalContainer}>
                        <DefinitionList className={styles.width80}>
                            <InformationGridRow
                                key={'slaParamTypeCode' + updateItem}
                                label={t('sla-detail.value')}
                                value={getUpdateItemValueType(updateItem)}
                                tooltip={updateItem?.slaParamTypeCode}
                            />
                            <InformationGridRow
                                key={'valueType' + updateItem}
                                label={t('sla-detail.valueType')}
                                value={
                                    <SimpleSelect
                                        disabled
                                        label=""
                                        name="valueType"
                                        options={valueTypesEnum?.map((i) => ({ value: i.code ?? '', label: i.value ?? '' })) ?? []}
                                        defaultValue={(updateItem && valueTypes?.find((i) => i.code == updateItem?.valueType)?.code) ?? ''}
                                    />
                                }
                            />
                            <InformationGridRow
                                key={'measurementMethod' + updateItem}
                                label={t('sla-detail.measurementMethod')}
                                value={
                                    <TextArea
                                        {...register('measurementMethod')}
                                        name="measurementMethod"
                                        defaultValue={updateItem && updateItem?.measurementMethod}
                                        rows={3}
                                    />
                                }
                            />
                            <InformationGridRow
                                key={'evaluationMethod' + updateItem}
                                label={t('sla-detail.evaluationMethod')}
                                value={
                                    <TextArea
                                        {...register('evaluationMethod')}
                                        name="evaluationMethod"
                                        defaultValue={updateItem && updateItem?.evaluationMethod}
                                        rows={3}
                                    />
                                }
                            />
                            <InformationGridRow
                                key={'note' + updateItem}
                                label={t('sla-detail.note')}
                                value={<TextArea {...register('note')} name="note" defaultValue={updateItem && updateItem?.note} rows={3} />}
                            />
                            <InformationGridRow
                                key={'penaltyDescription' + updateItem}
                                label={t('sla-detail.penaltyDescription')}
                                value={
                                    <TextArea
                                        {...register('penaltyDescription')}
                                        name="penaltyDescription"
                                        defaultValue={updateItem && updateItem?.penaltyDescription}
                                        rows={3}
                                    />
                                }
                            />
                        </DefinitionList>
                    </div>
                    <ModalButtons
                        submitButtonLabel={t('sla-detail.save')}
                        closeButtonLabel={t('confirmationModal.cancelButtonLabel')}
                        onClose={() => setUpdateItem(undefined)}
                    />
                </form>
            </BaseModal>
            <QueryFeedback loading={false} error={isError} withChildren>
                <div className={styles.sectionHead}>
                    <TextHeading size="S">{ci?.attributes?.Gen_Profil_nazov}</TextHeading>
                    <ButtonLink label={showAll ? t('sla-detail.showActive') : t('sla-detail.showAll')} onClick={() => setShowAll(!showAll)} />
                </div>

                <MutationFeedback
                    success={isUpdateSuccess || isInvalidateSuccess}
                    successMessage={isInvalidateSuccess ? t('mutationFeedback.successfulInvalidated') : t('mutationFeedback.successfulUpdated')}
                    onMessageClose={() => {
                        setIsInvalidateSuccess(false)
                        setIsUpdateSuccess(false)
                    }}
                />
                <div ref={wrapperRef} />

                {getList().map((parameter, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className={styles.sectionHead}>
                                <TextHeading size="M" className={classNames(styles.marginBottom0, { [styles.invalidated]: !parameter.isValid })}>
                                    {getSectionTitle(parameter)}
                                </TextHeading>
                                <ButtonPopup
                                    buttonClassName={styles.marginBottom0}
                                    key={index}
                                    buttonLabel={t('sla-detail.more')}
                                    popupPosition="right"
                                    popupContent={(closePopup) => (
                                        <div className={styles.buttonPopup}>
                                            <ButtonLink
                                                type="button"
                                                onClick={() => {
                                                    navigate(`/ci/${entityName}/${parameter.uuid}/history`)
                                                    closePopup()
                                                }}
                                                label={t('sla-detail.showHistory')}
                                            />
                                            {parameter.isValid && canEdit && (
                                                <>
                                                    <ButtonLink
                                                        type="button"
                                                        onClick={() => {
                                                            setUpdateItem(parameter)
                                                            reset()
                                                            closePopup()
                                                        }}
                                                        label={t('sla-detail.edit')}
                                                    />
                                                    <ButtonLink
                                                        type="button"
                                                        onClick={() => {
                                                            setInvalidateItem(parameter)
                                                            closePopup()
                                                        }}
                                                        label={t('sla-detail.invalidate')}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <DefinitionList>
                                <>
                                    <InformationGridRow
                                        key={'slaParamTypeCode' + index}
                                        label={t('sla-detail.value')}
                                        value={getParamValue(parameter)}
                                        tooltip={parameter?.slaParamTypeCode}
                                    />
                                    <InformationGridRow
                                        key={'valueType' + index}
                                        label={t('sla-detail.valueType')}
                                        value={valueTypes?.find((i) => i.code == parameter.valueType)?.value ?? ''}
                                    />
                                    {parameter.measurementMethod && (
                                        <InformationGridRow
                                            key={'measurementMethod' + index}
                                            label={t('sla-detail.measurementMethod')}
                                            value={parameter.measurementMethod}
                                        />
                                    )}
                                    {parameter.evaluationMethod && (
                                        <InformationGridRow
                                            key={'evaluationMethod' + index}
                                            label={t('sla-detail.evaluationMethod')}
                                            value={parameter.evaluationMethod}
                                        />
                                    )}
                                    {parameter.note && (
                                        <InformationGridRow key={'note' + index} label={t('sla-detail.note')} value={parameter.note} />
                                    )}
                                    {parameter.penaltyDescription && (
                                        <InformationGridRow
                                            key={'penaltyDescription' + index}
                                            label={t('sla-detail.penaltyDescription')}
                                            value={parameter.penaltyDescription}
                                        />
                                    )}
                                    <div className={styles.verticalDivider} />
                                    {index == 0 && (
                                        <>
                                            <Spacer vertical />
                                            <TextBody size="L" className={styles.marginBottom0}>
                                                {t('sla-detail.anotherParams')}
                                            </TextBody>
                                        </>
                                    )}
                                </>
                            </DefinitionList>
                        </React.Fragment>
                    )
                })}
            </QueryFeedback>
        </>
    )
}

export default SlaDetailView
