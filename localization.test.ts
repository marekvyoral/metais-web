import portalLocalesSk from 'app/metais-portal/public/translations/sk.json'
import portalLocalesEn from 'app/metais-portal/public/translations/en.json'
import adminLocalesSk from 'app/metais-admin/public/translations/sk.json'
import adminLocalesEn from 'app/metais-admin/public/translations/en.json'
import idskLocalesSk from 'packages/idsk-ui-kit/localization/sk.json'
import idskLocalesEn from 'packages/idsk-ui-kit/localization/en.json'
import commonLocalesSk from 'packages/metais-common/src/localization/sk.json'
import commonLocalesEn from 'packages/metais-common/src/localization/en.json'
import { describe, test, expect } from 'vitest'

const localesArray = [
    portalLocalesEn,
    portalLocalesSk,
    adminLocalesEn,
    adminLocalesSk,
    idskLocalesEn,
    idskLocalesSk,
    commonLocalesEn,
    commonLocalesSk,
]

describe.each(localesArray)('JSON structure validation for %s', (locale) => {
    test('All keys and values should be truthy', () => {
        Object.entries(locale).forEach(([key, value]) => {
            expect(key).toBeTruthy()
            expect(value).toBeTruthy()
        })
    })
    test('Keys should match the required pattern', () => {
        const keyRegex = /^[a-zA-Z0-9-_.]*[a-zA-Z0-9]+$/
        Object.keys(locale).forEach((key) => {
            expect(key).toMatch(keyRegex)
        })
    })
})
