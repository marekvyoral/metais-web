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


# XWIKI examples
<code>

{{html}}
<button class="govuk-button">Toto je komponent tlačidlo</button>
{{/html}}

(% aria-hidden="true" aria-label="LABEL123" class="titre-listitem" %)my span with class

(% class="titre-listitem" %)Sandbox1

(% class="titre-listitem" %)
(((
Sandbox2
)))

(% class="titre-listitem" style="color:blue" %)
(((
my div with class and style
)))

{{html}}<button title="HyperText Markup Language">HTML0</button>{{/html}}
{{html}}<p>HTML1</p>{{/html}}
{{html}}<span>HTML2</span>{{/html}}


<div>xxxxxx</div>


{{html}}
<div>HTML3</div>
{{/html}}

{{html}}
<div class="govuk-accordion" data-module="idsk-accordion" id="1"  data-attribute="value">
<div class="govuk-accordion__controls">
  <button class="govuk-accordion__open-all" data-open-title="Otvoriť všetky"
  data-close-title="Zatvoriť všetky" data-section-title="section title" type="button" aria-expanded="false">
     <span class="govuk-visually-hidden govuk-accordion__controls-span" data-section-title="sekcie"></span></button>
</div>
      <div class="govuk-accordion__section ">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="1-heading-1">
              Sekcia 1
            </span>
          </h2>
            <div class="govuk-accordion__section-summary govuk-body" id="1-summary-1">
              Toto je zhrnutie obsahu 1.
            </div>
        </div>
        <div id="1-content-1" class="govuk-accordion__section-content" aria-labelledby="1-heading-1">
          <p class='govuk-body'>Obsah prvej sekcie.</p>
        </div>
      </div>
      <div class="govuk-accordion__section ">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="1-heading-2">
              Sekcia 2
            </span>
          </h2>
            <div class="govuk-accordion__section-summary govuk-body" id="1-summary-2">
              Toto je zhrnutie obsahu 2.
            </div>
        </div>
        <div id="1-content-2" class="govuk-accordion__section-content" aria-labelledby="1-heading-2">
          <p class='govuk-body'>Obsah druhej sekcie.</p>
        </div>
      </div>
      <div class="govuk-accordion__section ">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="1-heading-3">
              Sekcia 3
            </span>
          </h2>
            <div class="govuk-accordion__section-summary govuk-body" id="1-summary-3">
              Toto je zhrnutie obsahu 3.
            </div>
        </div>
        <div id="1-content-3" class="govuk-accordion__section-content" aria-labelledby="1-heading-3">
          <p class='govuk-body'>Obsah tretej sekcie.</p>
        </div>
      </div>
</div>
{{/html}}
</code>