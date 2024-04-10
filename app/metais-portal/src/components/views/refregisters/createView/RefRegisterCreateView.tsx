import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonGroupRow, ErrorBlock, TextArea } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    ApiContact,
    ApiDescription,
    ApiReferenceRegister,
    ApiReferenceRegisterState,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { EDIT_CONTACT } from '@isdd/metais-common/navigation/searchKeys'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import {
    getInfoRR,
    getLabelRR,
    getUserGroupOptions,
    isRRFieldEditable,
    mapDefaultDataToFormDataRR,
    mapFormDataToApiReferenceRegister,
    showCreatorForm,
    showSourceRegisterForm,
} from '@/componentHelpers/refregisters/helpers'
import { RefRegisterCreateManagerContactSection } from '@/components/views/refregisters/createView/RefRegisterCreateManagerContactSection'
import { RefRegisterCreateMetaSection } from '@/components/views/refregisters/createView/RefRegisterCreateMetaSection'
import { RefRegisterCreateRegistrarContactSection } from '@/components/views/refregisters/createView/RefRegisterCreateRegistrarContactSection'
import { IRefRegisterCreateFormData, createRefRegisterSchema } from '@/components/views/refregisters/schema'
import { RefRegisterViewItems } from '@/types/views'

export interface IRefRegisterCreateView {
    defaultData?: ApiReferenceRegister
    userGroupData?: ConfigurationItemSetUi
    POData?: ConfigurationItemSetUi
    saveRefRegister?: (formData: ApiReferenceRegister) => Promise<void>
    updateRefRegister?: (referenceRegisterUuid: string, data: ApiReferenceRegister) => Promise<void>
    updateContact?: (referenceRegisterUuid: string, data: ApiContact) => Promise<void>
    updateAccessData?: (referenceRegisterUuid: string, data: ApiDescription) => Promise<void>
    renamedAttributes?: Attribute[]
}

export const RefRegisterCreateView: React.FC<IRefRegisterCreateView> = ({
    defaultData,
    userGroupData,
    POData,
    saveRefRegister,
    updateRefRegister,
    updateContact,
    updateAccessData,
    renamedAttributes,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const [urlParams] = useSearchParams()
    const { entityId } = useParams()
    const isContact = urlParams.get(EDIT_CONTACT) === 'true' ? true : false

    const [userGroupId, setUserGroupId] = useState<string>()
    useEffect(() => {
        if (userGroupData?.configurationItemSet?.length === 1) setUserGroupId(userGroupData.configurationItemSet[0].uuid)
    }, [userGroupData])

    const userGroupOptions = getUserGroupOptions(userGroupData)
    const defaultUserGroup = userGroupOptions?.length === 1 ? userGroupOptions[0] : undefined

    const { register, handleSubmit, setValue, clearErrors, formState, control, watch } = useForm({
        resolver: yupResolver(createRefRegisterSchema(t, showCreatorForm(defaultUserGroup, defaultData), showSourceRegisterForm(defaultData))),
        defaultValues: mapDefaultDataToFormDataRR(defaultData),
    })

    const onSubmit = useCallback(
        async (formData: IRefRegisterCreateFormData) => {
            if (isContact) {
                await updateContact?.(entityId ?? '', mapFormDataToApiReferenceRegister({ formData, managerUuid: defaultData?.managerUuid }))
            } else if (entityId && defaultData?.state === ApiReferenceRegisterState.IN_CONSTRUCTION) {
                await updateRefRegister?.(entityId, mapFormDataToApiReferenceRegister({ formData, entityId, managerUuid: defaultData?.managerUuid }))
            } else if (!defaultData?.state) {
                await saveRefRegister?.(mapFormDataToApiReferenceRegister({ formData, managerUuid: defaultData?.managerUuid }))
            } else {
                await updateAccessData?.(entityId ?? '', { description: formData.refRegisters.additionalData })
            }

            if (entityId) {
                setIsActionSuccess({
                    value: true,
                    path: `${NavigationSubRoutes.REFERENCE_REGISTER}/${entityId}`,
                })
                navigate(`${NavigationSubRoutes.REFERENCE_REGISTER}/${entityId}`)
            }
        },
        [
            defaultData?.managerUuid,
            defaultData?.state,
            entityId,
            isContact,
            navigate,
            saveRefRegister,
            setIsActionSuccess,
            updateAccessData,
            updateContact,
            updateRefRegister,
        ],
    )
    const creatorNotSet = userGroupId || !showCreatorForm(defaultUserGroup, defaultData) ? false : true

    const creatorUuid = watch(`refRegisters.creator`)
    return (
        <>
            {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <>
                    <RefRegisterCreateMetaSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        userGroupData={userGroupData}
                        setUserGroupId={setUserGroupId}
                        userGroupId={userGroupId}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        creatorNotSet={creatorNotSet}
                        control={control}
                    />
                    <RefRegisterCreateManagerContactSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        userGroupOptions={userGroupOptions}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        creatorNotSet={creatorNotSet}
                        creatorUuid={creatorUuid ?? defaultData?.managerUuid}
                    />

                    <RefRegisterCreateRegistrarContactSection
                        defaultData={defaultData}
                        renamedAttributes={renamedAttributes}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        formState={formState}
                        register={register}
                        isContact={isContact}
                        POData={POData}
                        creatorNotSet={creatorNotSet}
                    />
                    <TextArea
                        label={getLabelRR(RefRegisterViewItems.ADDITIONAL_DATA, renamedAttributes) ?? ''}
                        info={getInfoRR(RefRegisterViewItems.ADDITIONAL_DATA, renamedAttributes)}
                        rows={3}
                        {...register('refRegisters.additionalData')}
                        disabled={!isRRFieldEditable(defaultData?.state, isContact, true) || isContact || creatorNotSet}
                        error={formState.errors?.refRegisters?.additionalData?.message}
                        required
                    />
                    <InformationGridRow
                        key={'state'}
                        label={getLabelRR(RefRegisterViewItems.STATE, renamedAttributes) ?? ''}
                        value={t(`refRegisters.table.state.${defaultData?.state ?? ApiReferenceRegisterState.IN_CONSTRUCTION}`)}
                        tooltip={getInfoRR(RefRegisterViewItems.STATE, renamedAttributes)}
                    />
                    <ButtonGroupRow>
                        <Button type="submit" label={t('refRegisters.create.save')} />
                        <Button
                            variant="secondary"
                            label={t('refRegisters.detail.items.cancel')}
                            onClick={() => navigate(`${NavigationSubRoutes.REFERENCE_REGISTER}`)}
                        />
                    </ButtonGroupRow>
                </>
            </form>
        </>
    )
}
