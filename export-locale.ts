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

function exportLocale(fullKey: string, originalVal: IObj): { [key: string]: string } {
    let result: { [key: string]: string } = {}
    for (const key in originalVal) {
        const val = originalVal[key]
        if (typeof val === 'string') {
            const datakey = fullKey + (fullKey ? '.' : '') + key
            const datavalue = val.replace(/\\\"/g, '"').replace(/\"/g, '""')
            result[datakey] = datavalue
        } else {
            result = { ...result, ...exportLocale(fullKey + (fullKey ? '.' : '') + key, val) }
        }
    }
    return result
}

function merge(localeSk: { [key: string]: string }, localeEn: { [key: string]: string }): { [key: string]: { sk: string; en: string } } {
    const result: { [key: string]: { sk: string; en: string } } = {}
    const keys = Object.keys({ ...localeSk, ...localeEn })
    keys.sort()
    for (const key of keys) {
        result[key] = { sk: localeSk[key] || '', en: localeEn[key] || '' }
    }
    return result
}

function saveToFile(path: string, result: { [key: string]: { sk: string; en: string } }) {
    fs.open(path, 'w', (err, fd) => {
        fs.writeFileSync(fd, 'locale_id,sk,en\n', { mode: 'a' })
        const keys = Object.keys(result)
        keys.sort()
        for (const key of keys) {
            fs.writeFileSync(fd, key + ',"' + result[key].sk + '","' + result[key].en + '"\n', { mode: 'a', encoding: 'utf8' })
        }
        fs.close(fd)
    })
}

saveToFile('export-locales/portal-locale.csv', merge(exportLocale('', portalLocalesSk), exportLocale('', portalLocalesEn)))
saveToFile('export-locales/admin-locale.csv', merge(exportLocale('', adminLocalesSk), exportLocale('', adminLocalesEn)))
saveToFile('export-locales/idsk-locale.csv', merge(exportLocale('', idskLocalesSk), exportLocale('', idskLocalesEn)))
saveToFile('export-locales/common-locale.csv', merge(exportLocale('', commonLocalesSk), exportLocale('', commonLocalesEn)))
