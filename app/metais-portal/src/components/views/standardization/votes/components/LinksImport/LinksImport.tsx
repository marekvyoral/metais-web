import { useTranslation } from 'react-i18next'
import { Input } from '@isdd/idsk-ui-kit/index'
import classNames from 'classnames'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { ApiLink } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from './LinkImport.module.scss'

import { DynamicElements } from '@/components/views/standardization/votes/components/DynamicElements/DynamicElements'

export type LinkImportLineTypeDatas = {
    documentLinks?: ApiLink[]
}

export interface ILinkImport {
    defaultValues?: ApiLink[]
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<{ documentLinks: ApiLink[] }>
}

type LinkImportLineType = {
    index?: number
    register: UseFormRegister<FieldValues>
    errors: FieldErrors<{ documentLinks: ApiLink[] }>
}

const LinkImportLine: React.FC<LinkImportLineType> = ({ index, register, errors }) => {
    const { t } = useTranslation()

    return (
        <div>
            <div className={styles.inline}>
                <Input
                    label={t('votes.voteEdit.documents.descriptionLabel')}
                    placeholder={t('votes.voteEdit.documents.generalInputPlaceholder')}
                    id={`documentLinks.${index}.linkDescription`}
                    {...register(`documentLinks.${index}.linkDescription`)}
                    className={classNames(styles.longer, styles.spaceHorizontal)}
                    error={errors?.documentLinks?.[index ?? 0]?.linkDescription?.message}
                />
                <Input
                    label={t('votes.voteEdit.documents.typeLabel')}
                    placeholder={t('votes.voteEdit.documents.generalInputPlaceholder')}
                    {...register(`documentLinks.${index}.linkType`)}
                    id={`documentLinks.${index}.linkType`}
                    className={styles.shorter}
                    error={errors?.documentLinks?.[index ?? 0]?.linkType?.message}
                />
            </div>
            <div className={styles.inline}>
                <Input
                    label={t('votes.voteEdit.documents.linkLabel')}
                    placeholder={t('votes.voteEdit.documents.linkInputPlaceholder')}
                    {...register(`documentLinks.${index}.url`)}
                    id={`documentLinks.${index}.url`}
                    className={classNames(styles.longer, styles.spaceHorizontal)}
                    error={errors?.documentLinks?.[index ?? 0]?.url?.message}
                />
                <Input
                    label={t('votes.voteEdit.documents.sizeLabel')}
                    placeholder={t('votes.voteEdit.documents.generalInputPlaceholder')}
                    {...register(`documentLinks.${index}.linkSize`)}
                    id={`documentLinks.${index}.linkSize`}
                    className={styles.shorter}
                    error={errors?.documentLinks?.[index ?? 0]?.linkSize?.message}
                />
            </div>
        </div>
    )
}
export const LinksImport: React.FC<ILinkImport> = ({ defaultValues, register, errors }) => {
    const { t } = useTranslation()

    return (
        <DynamicElements<ApiLink>
            renderableComponent={(index) => <LinkImportLine index={index} register={register} errors={errors} />}
            initialElementsData={defaultValues}
            addItemButtonLabelText={'+ ' + t('votes.voteEdit.addNextDocumentItem')}
            defaultRenderableComponentData={{}}
        />
    )
}
