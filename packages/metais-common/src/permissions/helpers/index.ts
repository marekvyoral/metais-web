import { MongoQuery, SubjectRawRule, SubjectType } from '@casl/ability'

export const getUniqueRules = (
    newRules: SubjectRawRule<string, SubjectType, MongoQuery>[],
    existingRules: SubjectRawRule<string, SubjectType, MongoQuery>[],
) => {
    const uniqueRulesForUpdate: SubjectRawRule<string, SubjectType, MongoQuery>[] = []
    newRules.forEach((newRule) => {
        const ruleIndex = existingRules.findIndex(
            (existingRule) => existingRule.action === newRule.action && existingRule.subject === newRule.subject,
        )

        if (ruleIndex > -1) {
            existingRules[ruleIndex] = newRule
        } else {
            uniqueRulesForUpdate.push(newRule)
        }
    })
    return uniqueRulesForUpdate
}
