import React from 'react'
import { Button, CheckBox, Input, SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

import styles from './findView.module.scss'

export const CreateOrganizationView = () => {
    const { t } = useTranslation()
    const { register } = useForm()

    return (
        <div>
            <h1>{t('organizations.create.addNewOrganization')}</h1>
            <div className={styles.form}>
                <form>
                    <Input {...register('Gen_Profil_nazov')} label={t('organizations.create.name')} />
                    <SimpleSelect {...register('EA_Profil_PO_kategoria_osoby')} label={t('organizations.create.category')} options={[]} />
                    <SimpleSelect {...register('EA_Profil_PO_typ_osoby')} label={t('organizations.create.organizationType')} options={[]} />

                    <Input {...register('Gen_Profil_anglicky_nazov')} label={t('organizations.create.engName')} />
                    <Input {...register('Gen_Profil_popis')} label={t('organizations.create.description')} />
                    <Input {...register('Gen_Profil_anglicky_popis')} label={t('organizations.create.engDescription')} />
                    <SimpleSelect {...register('Gen_Profil_zdroj')} label={t('organizations.create.source')} options={[]} />
                    <Input {...register('Gen_Profil_kod_metais')} label={t('organizations.create.codeMetaIS')} />
                    <Input {...register('Gen_Profil_ref_id')} label={t('organizations.create.URI')} />
                    <Input {...register('EA_Profil_PO_webove_sidlo')} label={t('organizations.create.webResidence')} />
                    <Input {...register('Gen_Profil_poznamka')} label={t('organizations.create.note')} />
                    <Input {...register('EA_Profil_PO_ico')} label={t('organizations.create.ico')} />
                    <Input {...register('EA_Profil_PO_psc')} label={t('organizations.create.psc')} />
                    <Input {...register('EA_Profil_PO_obec')} label={t('organizations.create.city')} />
                    <Input {...register('EA_Profil_PO_ulica')} label={t('organizations.create.street')} />
                    <Input {...register('EA_Profil_PO_cislo')} label={t('organizations.create.number')} />
                    <Input {...register('EA_Profil_PO_okres')} label={t('organizations.create.district')} />
                    <CheckBox {...register('jeKapitola')} id="isChapter" label={t('organizations.create.isChapter')} />

                    <Input {...register('Gen_Profil_EA_skrateny_nazov')} label={t('organizations.create.name')} />
                    <Input {...register('Gen_Profil_EA_popis_referencie')} label={t('organizations.create.name')} />
                    <Input {...register('Gen_Profil_EA_odkaz_na_referenciu')} label={t('organizations.create.name')} />
                    <Input {...register('Profil_PO_statutar_titul_pred_menom')} label={t('organizations.create.name')} />
                    <Input {...register('Profil_PO_statutar_meno')} label={t('organizations.create.name')} />
                    <Input {...register('Profil_PO_statutar_priezvisko')} label={t('organizations.create.name')} />
                    <Input {...register('Profil_PO_statutar_titul_za_menom')} label={t('organizations.create.name')} />
                </form>
                <div className={styles.buttonsGroup}>
                    <Button label={t('actionsInTable.save')} />
                    <Button label={t('actionsInTable.cancel')} />
                </div>
            </div>
        </div>
    )
}
