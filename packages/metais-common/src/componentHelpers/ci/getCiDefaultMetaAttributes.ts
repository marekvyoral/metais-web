import { TFunction } from 'i18next'

export enum MetainformationColumns {
    CREATED_AT = 'createdAt',
    LAST_MODIFIED_AT = 'lastModifiedAt',
    STATE = 'state',
    OWNER = 'owner',
}

export enum MetaInformationTypes {
    OWNER = 'OWNER',
    STATE = 'STATE',
    CREATED_AT = 'CREATED_AT',
    LAST_MODIFIED = 'LAST_MODIFIED',
}

type GetMetaAttributesProps = {
    t: TFunction
}
export const getCiDefaultMetaAttributes = ({ t }: GetMetaAttributesProps) => {
    const defaultCiMetaAttributes = {
        name: t('ciType.meta.metaInformationsName'),
        attributes: [
            {
                name: t('ciType.meta.lastModifiedAt'),
                engName: t('ciType.meta.lastModifiedAt'),
                technicalName: MetainformationColumns.LAST_MODIFIED_AT,
                invisible: false,
                valid: true,
                attributeTypeEnum: MetaInformationTypes.LAST_MODIFIED as string,
            },
            {
                name: t('ciType.meta.createdAt'),
                engName: t('ciType.meta.createdAt'),
                technicalName: MetainformationColumns.CREATED_AT,
                invisible: false,
                valid: true,
                attributeTypeEnum: MetaInformationTypes.CREATED_AT as string,
            },
            {
                name: t('ciType.meta.owner'),
                engName: t('ciType.meta.owner'),
                technicalName: MetainformationColumns.OWNER,
                invisible: false,
                valid: true,
                attributeTypeEnum: MetaInformationTypes.OWNER as string,
            },
            {
                name: t('ciType.meta.state'),
                engName: t('ciType.meta.state'),
                technicalName: MetainformationColumns.STATE,
                invisible: false,
                valid: true,
                attributeTypeEnum: MetaInformationTypes.STATE as string,
            },
        ],
    }

    return defaultCiMetaAttributes
}

export const getRefRegsDefaultMetaAttributes = (t: TFunction<'translation', undefined, 'translation'>) => {
    const defaultCiMetaAttributes = {
        name: t('ciType.meta.metaInformationsName'),
        attributes: [
            {
                name: t('ciType.meta.state'),
                technicalName: MetainformationColumns.STATE,
            },
        ],
    }
    return defaultCiMetaAttributes
}
