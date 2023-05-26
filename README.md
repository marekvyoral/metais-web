# Assets

All assets are automatically copied from the `@id-sk` library to `public/assets` when the `yarn install` script is executed. Please refrain from modifying this folder, as it may result in the **loss of your changes**.

To add new assets, please use the `src/assets` folder.

# Style

In general, it is recommended to avoid writing custom styles whenever possible. The `@id-sk` library provides a variety of functions for styling.

To make the functions from `@id-sk` library work, make sure to include `@import '@id-sk/frontend/idsk/all'` in your code.

## Colors

❌ Don't do this
`background-color: #FFFFF`

✅ Do this
`background-color: govuk-colour("white");`

## Spacing

❌ Don't do this
`margin: 5px`

✅ Do this
`margin: govuk-spacing(1)`

## Media query

❌ Don't do this

```
@media (max-width: 760px) {
   display: none;
}
```

✅ Do this

```
@include mq($until: tablet) {
   display: none;
}
```
