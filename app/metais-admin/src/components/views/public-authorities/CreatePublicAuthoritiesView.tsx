import { Button, CheckBox, ErrorBlock, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useState } from 'react'

import styles from './findView.module.scss'
import { useCreatePublicAuthorities } from './hooks/useCreatePublicAuthorities'

import { ICreatePublicAuthoritiesView } from '@/components/containers/public-authorities/CreatePublicAuthoritiesContainer'

export const CreatePublicAuthoritiesView = (props: ICreatePublicAuthoritiesView) => {
    const { t } = useTranslation()
    const { ico } = useParams()
    const [isSubmit, setSubmit] = useState<boolean>(false)
    const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false)

    const { onSubmit, formMethods, isTypePersonDisabled, personCategoriesOptions, personTypesOptions, sourcesOptions, replicationTypesOptions } =
        useCreatePublicAuthorities(props, setSubmit, setSubmitLoading)

    const { formState, register, handleSubmit, setValue } = formMethods

    return (
        <QueryFeedback
            loading={props.isLoading || isSubmitLoading}
            error={props.isError}
            indicatorProps={{ label: isSubmit ? t('publicAuthorities.create.savingPO') : t('loading.loadingSubPage') }}
            withChildren
        >
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">
                    {ico ? t('publicAuthorities.create.addNewOrganization') : t('publicAuthorities.edit.updateExistingOrganization')}
                </TextHeading>
            </FlexColumnReverseWrapper>
            <div className={styles.form}>
                {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        {...register('Gen_Profil_nazov')}
                        label={`${t('publicAuthorities.create.name')} ${t('input.requiredField')}`}
                        error={formState?.errors?.Gen_Profil_nazov?.message}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_kategoria_osoby"
                        setValue={setValue}
                        label={`${t('publicAuthorities.create.category')} ${t('input.requiredField')}`}
                        options={personCategoriesOptions}
                        error={formState?.errors?.EA_Profil_PO_kategoria_osoby?.message}
                        defaultValue={formState.defaultValues?.['EA_Profil_PO_kategoria_osoby']}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_typ_osoby"
                        setValue={setValue}
                        label={t('publicAuthorities.create.organizationType')}
                        options={personTypesOptions}
                        error={formState?.errors?.EA_Profil_PO_typ_osoby?.message}
                        disabled={isTypePersonDisabled}
                        defaultValue={formState.defaultValues?.['EA_Profil_PO_typ_osoby']}
                    />

                    <Input
                        {...register('Gen_Profil_anglicky_nazov')}
                        label={t('publicAuthorities.create.engName')}
                        error={formState?.errors?.Gen_Profil_anglicky_nazov?.message}
                    />
                    <Input
                        {...register('Gen_Profil_popis')}
                        label={t('publicAuthorities.create.description')}
                        error={formState?.errors?.Gen_Profil_popis?.message}
                    />
                    <Input
                        {...register('Gen_Profil_anglicky_popis')}
                        label={t('publicAuthorities.create.engDescription')}
                        error={formState?.errors?.Gen_Profil_anglicky_popis?.message}
                    />
                    <SimpleSelect
                        name="Gen_Profil_zdroj"
                        setValue={setValue}
                        label={t('publicAuthorities.create.source')}
                        options={sourcesOptions}
                        error={formState?.errors?.Gen_Profil_zdroj?.message}
                        defaultValue={formState.defaultValues?.['Gen_Profil_zdroj']}
                    />
                    <Input
                        {...register('Gen_Profil_kod_metais')}
                        label={t('publicAuthorities.create.codeMetaIS')}
                        disabled
                        error={formState?.errors?.Gen_Profil_kod_metais?.message}
                    />
                    <Input
                        {...register('Gen_Profil_ref_id')}
                        label={t('publicAuthorities.create.URI')}
                        disabled
                        error={formState?.errors?.Gen_Profil_ref_id?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_webove_sidlo')}
                        label={t('publicAuthorities.create.webResidence')}
                        error={formState?.errors?.EA_Profil_PO_webove_sidlo?.message}
                    />
                    <Input
                        {...register('Gen_Profil_poznamka')}
                        label={t('publicAuthorities.create.note')}
                        error={formState?.errors?.Gen_Profil_poznamka?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_ico')}
                        label={t('publicAuthorities.create.ico')}
                        disabled
                        error={formState?.errors?.EA_Profil_PO_ico?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_psc')}
                        label={t('publicAuthorities.create.psc')}
                        error={formState?.errors?.EA_Profil_PO_psc?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_obec')}
                        label={t('publicAuthorities.create.city')}
                        error={formState?.errors?.EA_Profil_PO_obec?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_ulica')}
                        label={t('publicAuthorities.create.street')}
                        error={formState?.errors?.EA_Profil_PO_ulica?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_cislo')}
                        label={t('publicAuthorities.create.number')}
                        error={formState?.errors?.EA_Profil_PO_cislo?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_okres')}
                        label={t('publicAuthorities.create.district')}
                        error={formState?.errors?.EA_Profil_PO_okres?.message}
                    />
                    <CheckBox
                        {...register('EA_Profil_PO_je_kapitola')}
                        id="isChapter"
                        label={t('publicAuthorities.create.isChapter')}
                        error={formState?.errors?.EA_Profil_PO_je_kapitola?.message}
                    />

                    <Input
                        {...register('Gen_Profil_EA_skrateny_nazov')}
                        label={t('publicAuthorities.create.shortName')}
                        error={formState?.errors?.Gen_Profil_EA_skrateny_nazov?.message}
                    />
                    <Input
                        {...register('Gen_Profil_EA_popis_referencie')}
                        label={t('publicAuthorities.create.referenceDescription')}
                        error={formState?.errors?.Gen_Profil_EA_popis_referencie?.message}
                    />
                    <Input
                        {...register('Gen_Profil_EA_odkaz_na_referenciu')}
                        label={t('publicAuthorities.create.linkReference')}
                        error={formState?.errors?.Gen_Profil_EA_odkaz_na_referenciu?.message}
                    />
                    <SimpleSelect
                        name="Gen_Profil_EA_typ_replikacie"
                        label={t('publicAuthorities.create.replicationType')}
                        setValue={setValue}
                        options={replicationTypesOptions}
                        error={formState?.errors?.Gen_Profil_EA_typ_replikacie?.message}
                        defaultValue={formState.defaultValues?.['Gen_Profil_EA_typ_replikacie']}
                    />
                    <Input
                        {...register('Gen_Profil_EA_pocet_replikacii')}
                        label={t('publicAuthorities.create.numberOfReplication')}
                        error={formState?.errors?.Gen_Profil_EA_pocet_replikacii?.message}
                        type="number"
                    />
                    <TextHeading size="L">{t('publicAuthorities.detail.statutoryOfficer')}</TextHeading>

                    <Input
                        {...register('Profil_PO_statutar_titul_pred_menom')}
                        label={t('publicAuthorities.create.officer.titleBeforeName')}
                        error={formState?.errors?.Profil_PO_statutar_titul_pred_menom?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_meno')}
                        label={t('publicAuthorities.create.officer.name')}
                        error={formState?.errors?.Profil_PO_statutar_meno?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_priezvisko')}
                        label={t('publicAuthorities.create.officer.lastName')}
                        error={formState?.errors?.Profil_PO_statutar_priezvisko?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_titul_za_menom')}
                        label={t('publicAuthorities.create.officer.titleAfterName')}
                        error={formState?.errors?.Profil_PO_statutar_titul_za_menom?.message}
                    />
                    <div className={styles.buttonsGroup}>
                        <Button label={t('actionsInTable.save')} type="submit" />
                        <Button label={t('actionsInTable.cancel')} />
                    </div>
                </form>
            </div>
        </QueryFeedback>
    )
}
