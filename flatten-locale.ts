import fs from 'fs'

import portalLocalesSk from 'app/metais-portal/public/translations/sk.json'
import portalLocalesEn from 'app/metais-portal/public/translations/en.json'
import adminLocalesSk from 'app/metais-admin/public/translations/sk.json'
import adminLocalesEn from 'app/metais-admin/public/translations/en.json'
import idskLocalesSk from 'packages/idsk-ui-kit/localization/sk.json'
import idskLocalesEn from 'packages/idsk-ui-kit/localization/en.json'
import commonLocalesSk from 'packages/metais-common/src/localization/sk.json'
import commonLocalesEn from 'packages/metais-common/src/localization/en.json'

interface IObj {
    [key: string]: string | IObj
}

function flattenLocale(fullKey: string, originalVal: IObj): { [key: string]: string } {
    let result: { [key: string]: string } = {}
    for (const key in originalVal) {
        const val = originalVal[key]
        if (typeof val === 'string') {
            if (key && val) {
                const datakey = fullKey + (fullKey ? '.' : '') + key
                const datavalue = val.replace(/\\\"/g, '"').replace(/\"/g, '""')
                result[datakey] = datavalue
            }
        } else {
            result = { ...result, ...flattenLocale(fullKey + (fullKey ? '.' : '') + key, val) }
        }
    }
    return result
}

const PORTAL_SK_TRANS_PATH = './app/metais-portal/public/translations/sk.json'
const PORTAL_EN_TRANS_PATH = './app/metais-portal/public/translations/en.json'
const ADMIN_SK_TRANS_PATH = './app/metais-admin/public/translations/sk.json'
const ADMIN_EN_TRANS_PATH = './app/metais-admin/public/translations/en.json'
const COMMON_SK_TRANS_PATH = './packages/metais-common/src/localization/sk.json'
const COMMON_EN_TRANS_PATH = './packages/metais-common/src/localization/en.json'
const UI_KIT_SK_TRANS_PATH = './packages/idsk-ui-kit/localization/sk.json'
const UI_KIT_EN_TRANS_PATH = './packages/idsk-ui-kit/localization/en.json'

const pathsObject: Record<string, IObj> = {
    [PORTAL_EN_TRANS_PATH]: portalLocalesEn,
    [PORTAL_SK_TRANS_PATH]: portalLocalesSk,
    [ADMIN_EN_TRANS_PATH]: adminLocalesEn,
    [ADMIN_SK_TRANS_PATH]: adminLocalesSk,
    [COMMON_EN_TRANS_PATH]: commonLocalesEn,
    [COMMON_SK_TRANS_PATH]: commonLocalesSk,
    [UI_KIT_EN_TRANS_PATH]: idskLocalesEn,
    [UI_KIT_SK_TRANS_PATH]: idskLocalesSk,
}

for (const path in pathsObject) {
    fs.open(path, 'w', (_, fd) => {
        fs.writeFileSync(fd, JSON.stringify(flattenLocale('', pathsObject[path]), undefined, ' '))
    })
}
