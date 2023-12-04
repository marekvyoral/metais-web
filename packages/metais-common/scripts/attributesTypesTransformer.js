"use strict";
exports.__esModule = true;
exports.transformAttributeSchema = void 0;
var KEY_VALUE_OBJECT = { type: 'object' };
var retypeAttributesArrayToObject = function (attributesParent) {
    attributesParent.attributes = KEY_VALUE_OBJECT;
};
/**
 * Transformer function for orval.
 *
 * @param {InputSchema} inputSchema
 * @return {InputSchema}
 */
var transformAttributeSchema = function (inputSchema) {
    var schemas = inputSchema.components.schemas;
    retypeAttributesArrayToObject(schemas.ConfigurationItemUi.properties);
    return inputSchema;
};
exports.transformAttributeSchema = transformAttributeSchema;
module.exports = exports.transformAttributeSchema;
