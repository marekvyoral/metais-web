# Assets

All assets are automatically copied from the `@id-sk` library to `public/assets` when the `yarn install` script is executed. Please refrain from modifying this folder, as it may result in the **loss of your changes**.

To add new assets, please use the `src/assets` folder.

# Style

In general, it is recommended to avoid writing custom styles whenever possible. The `@id-sk` library provides a variety of functions for styling.

To make the functions from `@id-sk` library work, make sure to include `@import '@id-sk/frontend/idsk/all'` in your code.

|                | ❌ Don't do this                                        | ✅ Do this                                                                                                                                                                                         | Parameters                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colors         | `background-color: #FFFFF`                              | `background-color: govuk-colour("white");` <br /><br /> example from figma: <br /> `rgba(208, 25, 15, 0.1)`->`rgba(govuk-colour("red"), 0.1)` <br /> `rgba(208, 25, 15, 1)`->`govuk-colour("red")` | [Colors](https://idsk.gov.sk/komponenty/farby)                                                                                                                                                          |
| Lighter colors | `background-color: rgba(208, 35, 15);`                  | Make a colour lighter by mixing it with white <br />`background-color: govuk-tint(govuk-colour("red"), 90);`                                                                                       | **$colour** <br/>- colour to tint <br /> **$percentage**<br/>- percentage of white `$colour` in returned color                                                                                          |
| Darker colors  | `background-color: rgba(208, 0, 15);`                   | Make a colour darker by mixing it with black <br />`background-color: govuk-shade(govuk-colour("red"), 10);`                                                                                       | **$colour** <br/>- colour to shade <br /> **$percentage**<br/>- percentage of black `$colour` in returned color                                                                                         |
| Spacing        | `margin: 5px`                                           | `margin: govuk-spacing(1)`                                                                                                                                                                         | <code>$govuk-spacing-points: (<br />&nbsp; 0: 0, 1: 5px,<br />&nbsp; 2: 10px, 3: 15px,<br />&nbsp; 4: 20px, 5: 25px,<br />&nbsp; 6: 30px, 7: 40px,<br />&nbsp; 8: 50px, 9: 60px<br />) !default;</code> |
| Media query    | <code>@media (max-width: 760px) {display: none;}</code> | <code>@include mq($until: tablet) {display: none;}</code>                                                                                                                                          | <code>$govuk-breakpoints: (<br />&nbsp;&nbsp;mobile: 320px,<br />&nbsp;&nbsp;tablet: 641px,<br />&nbsp;&nbsp;desktop: 769px<br />) !default;</code>                                                     |

#### When custom styles are needed, please use [**CSS Modules**](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet).

Here is an example of how to use CSS modules:

Create a file called `button.module.scss`:

<pre>
.error {
    color: govuk-colour("red");
}
</pre>

Import the CSS modules stylesheet as `styles`:

<pre>
import styles from '@/button.module.scss';

const Button = () => {
    return (
        < button
            onClick={onClick}
            className={<b>styles.error</b>}
        >
            Delete
        < /button>
    )
}
</pre>

#### BreadCrumbs, Links from pages with Filter

For BreadCrumbs to work properly, meaning remembering filter properties based on search params, links navigating from pages that consume Filter need to send its location state.

Examples of how to send location state:

Using Link component:

<pre>
const location = useLocation()

return (
    < Link to={url} state={{from: location}} >
)
    
</pre>

Using useNavigate:

<pre>
const navigate = useNavigate()
const location = useLocation()

navigate(url, {state:{from: location}})
</pre>
