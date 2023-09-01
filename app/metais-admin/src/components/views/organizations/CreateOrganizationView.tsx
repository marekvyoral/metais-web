import { Button, CheckBox, Input, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import styles from './findView.module.scss'
import { useCreateOrganization } from './hooks/useCreateOrganization'

import { ICreateOrganizationView } from '@/components/containers/organizations/CreateOrganizationContainer'

export const CreateOrganizationView = (props: ICreateOrganizationView) => {
    const { t } = useTranslation()
    const { ico } = useParams()

    const { onSubmit, formMethods, isTypePersonDisabled, personCategoriesOptions, personTypesOptions, sourcesOptions, replicationTypesOptions } =
        useCreateOrganization(props)

    const { formState, register, handleSubmit, setValue } = formMethods
    return (
        <div>
            <h1>{ico ? t('organizations.create.addNewOrganization') : t('organizations.edit.updateExistingOrganization')}</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        {...register('Gen_Profil_nazov')}
                        label={t('organizations.create.name')}
                        error={formState?.errors?.Gen_Profil_nazov?.message}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_kategoria_osoby"
                        setValue={setValue}
                        label={t('organizations.create.category')}
                        options={personCategoriesOptions}
                        error={formState?.errors?.EA_Profil_PO_kategoria_osoby?.message}
                    />
                    <SimpleSelect
                        name="EA_Profil_PO_typ_osoby"
                        setValue={setValue}
                        label={t('organizations.create.organizationType')}
                        options={personTypesOptions}
                        error={formState?.errors?.EA_Profil_PO_typ_osoby?.message}
                        disabled={isTypePersonDisabled}
                    />

                    <Input
                        {...register('Gen_Profil_anglicky_nazov')}
                        label={t('organizations.create.engName')}
                        error={formState?.errors?.Gen_Profil_anglicky_nazov?.message}
                    />
                    <Input
                        {...register('Gen_Profil_popis')}
                        label={t('organizations.create.description')}
                        error={formState?.errors?.Gen_Profil_popis?.message}
                    />
                    <Input
                        {...register('Gen_Profil_anglicky_popis')}
                        label={t('organizations.create.engDescription')}
                        error={formState?.errors?.Gen_Profil_anglicky_popis?.message}
                    />
                    <SimpleSelect
                        name="Gen_Profil_zdroj"
                        setValue={setValue}
                        label={t('organizations.create.source')}
                        options={sourcesOptions}
                        error={formState?.errors?.Gen_Profil_zdroj?.message}
                    />
                    <Input
                        {...register('Gen_Profil_kod_metais')}
                        label={t('organizations.create.codeMetaIS')}
                        disabled
                        error={formState?.errors?.Gen_Profil_kod_metais?.message}
                    />
                    <Input
                        {...register('Gen_Profil_ref_id')}
                        label={t('organizations.create.URI')}
                        disabled
                        error={formState?.errors?.Gen_Profil_ref_id?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_webove_sidlo')}
                        label={t('organizations.create.webResidence')}
                        error={formState?.errors?.EA_Profil_PO_webove_sidlo?.message}
                    />
                    <Input
                        {...register('Gen_Profil_poznamka')}
                        label={t('organizations.create.note')}
                        error={formState?.errors?.Gen_Profil_poznamka?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_ico')}
                        label={t('organizations.create.ico')}
                        disabled
                        error={formState?.errors?.EA_Profil_PO_ico?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_psc')}
                        label={t('organizations.create.psc')}
                        error={formState?.errors?.EA_Profil_PO_psc?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_obec')}
                        label={t('organizations.create.city')}
                        error={formState?.errors?.EA_Profil_PO_obec?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_ulica')}
                        label={t('organizations.create.street')}
                        error={formState?.errors?.EA_Profil_PO_ulica?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_cislo')}
                        label={t('organizations.create.number')}
                        error={formState?.errors?.EA_Profil_PO_cislo?.message}
                    />
                    <Input
                        {...register('EA_Profil_PO_okres')}
                        label={t('organizations.create.district')}
                        error={formState?.errors?.EA_Profil_PO_okres?.message}
                    />
                    <CheckBox
                        {...register('EA_Profil_PO_je_kapitola')}
                        id="isChapter"
                        label={t('organizations.create.isChapter')}
                        error={formState?.errors?.EA_Profil_PO_je_kapitola?.message}
                    />

                    <Input
                        {...register('Gen_Profil_EA_skrateny_nazov')}
                        label={t('organizations.create.shortName')}
                        error={formState?.errors?.Gen_Profil_EA_skrateny_nazov?.message}
                    />
                    <Input
                        {...register('Gen_Profil_EA_popis_referencie')}
                        label={t('organizations.create.referenceDescription')}
                        error={formState?.errors?.Gen_Profil_EA_popis_referencie?.message}
                    />
                    <Input
                        {...register('Gen_Profil_EA_odkaz_na_referenciu')}
                        label={t('organizations.create.linkReference')}
                        error={formState?.errors?.Gen_Profil_EA_odkaz_na_referenciu?.message}
                    />
                    <SimpleSelect
                        name="Gen_Profil_EA_typ_replikacie"
                        label={t('organizations.create.replicationType')}
                        setValue={setValue}
                        options={replicationTypesOptions}
                        error={formState?.errors?.Gen_Profil_EA_typ_replikacie?.message}
                    />
                    <Input
                        {...register('Gen_Profil_EA_pocet_replikacii')}
                        label={t('organizations.create.numberOfReplication')}
                        error={formState?.errors?.Gen_Profil_EA_pocet_replikacii?.message}
                        type="number"
                    />
                    <h2>{t('organizations.detail.statutoryOfficer')}</h2>

                    <Input
                        {...register('Profil_PO_statutar_titul_pred_menom')}
                        label={t('organizations.create.officer.titleBeforeName')}
                        error={formState?.errors?.Profil_PO_statutar_titul_pred_menom?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_meno')}
                        label={t('organizations.create.officer.name')}
                        error={formState?.errors?.Profil_PO_statutar_meno?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_priezvisko')}
                        label={t('organizations.create.officer.lastName')}
                        error={formState?.errors?.Profil_PO_statutar_priezvisko?.message}
                    />
                    <Input
                        {...register('Profil_PO_statutar_titul_za_menom')}
                        label={t('organizations.create.officer.titleAfterName')}
                        error={formState?.errors?.Profil_PO_statutar_titul_za_menom?.message}
                    />
                    <div className={styles.buttonsGroup}>
                        <Button label={t('actionsInTable.save')} type="submit" />
                        <Button label={t('actionsInTable.cancel')} />
                    </div>
                </form>
            </div>
        </div>
    )
}
