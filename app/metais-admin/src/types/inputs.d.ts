export enum InputNames {
    NAME = 'NAME',
    ENG_NAME = 'ENG_NAME',
    TECHNICAL_NAME = 'TECHNICAL_NAME',
    CODE_PREFIX = 'CODE_PREFIX',
    URI_PREFIX = 'URI_PREFIX',
    DESCRIPTION = 'DESCRIPTION',
    ENG_DESCRIPTION = 'ENG_DESCRIPTION',
    TYPE = 'TYPE',
    ROLE_LIST = 'ROLE_LIST',
    ATTRIBUTE_PROFILES = 'ATTRIBUTE_PROFILES',
    SOURCES = 'SOURCES',
    TARGETS = 'TARGETS',
}

export type HiddenInputs = {
    [name in InputNames]: boolean
}
