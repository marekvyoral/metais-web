import * as React from 'react'

export const Table: React.FC = () => {
  return (
    <div data-module="idsk-table" id="priklad-2">
      <div className="idsk-table__heading">
        <div>
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Mestá</h2>
          <p className="govuk-body">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text
            ever since the 1500s.
          </p>
        </div>
      </div>

      <div data-module="idsk-table-filter" id="example-table-2-filter" className="idsk-table-filter ">
        <div className="idsk-table-filter__panel idsk-table-filter__inputs">
          <div className="idsk-table-filter__title govuk-heading-m">Filtrovať obsah</div>
          <button
            className="govuk-body govuk-link idsk-filter-menu__toggle"
            tabIndex={0}
            data-open-text="Rozbaliť obsah filtra"
            data-close-text="Zbaliť obsah filtra"
            data-category-name=""
            aria-label="Rozbaliť obsah filtra"
            type="button"
          >
            Rozbaliť obsah filtra
          </button>

          <form className="idsk-table-filter__content" action="#">
            <div className="govuk-grid-row idsk-table-filter__filter-inputs">
              <div className="govuk-grid-column-one-third-from-desktop">
                <div className="govuk-form-group">
                  <label className="govuk-label">Mesto</label>
                  <input tabIndex={-1} className="govuk-input" type="text" id="mesto" name="mesto" placeholder="Mesto" aria-label="Mesto" />
                </div>
              </div>
              <div className="govuk-grid-column-one-third-from-desktop">
                <div className="govuk-form-group">
                  <label className="govuk-label">Kraj</label>
                  <input tabIndex={-1} className="govuk-input" type="text" id="kraj" name="kraj" placeholder="Kraj" aria-label="Kraj" />
                </div>
              </div>
              <div className="govuk-grid-column-one-third-from-desktop">
                <div className="govuk-form-group">
                  <label className="govuk-label">Okres</label>
                  <select tabIndex={-1} className="govuk-select" id="okres" name="okres">
                    <option value="">Vybrať okres</option>
                    <option value="bratislava">Bratislava</option>
                    <option value="zilina">Žilina</option>
                    <option value="kosice">Košice</option>
                  </select>
                </div>
              </div>
              <div className="govuk-grid-column-one-third-from-desktop">
                <div className="govuk-form-group">
                  <label className="govuk-label">Rozloha</label>
                  <input tabIndex={-1} className="govuk-input" type="text" id="rozloha" name="rozloha" placeholder="Rozloha" aria-label="Rozloha" />
                </div>
              </div>
              <div className="govuk-grid-column-one-third-from-desktop">
                <div className="govuk-form-group">
                  <label className="govuk-label">Hustota</label>
                  <input tabIndex={-1} className="govuk-input" type="text" id="hustota" name="hustota" placeholder="Hustota" aria-label="Hustota" />
                </div>
              </div>
            </div>
            <button type="submit" className="idsk-button submit-table-filter" disabled>
              Filtrovať (<span className="count">0</span>)
            </button>
          </form>
        </div>
        <div
          className="idsk-table-filter__panel idsk-table-filter__active-filters idsk-table-filter__active-filters__hide idsk-table-filter--expanded"
          data-remove-filter="Zrušiť filter"
          data-remove-all-filters="Zrušiť všetko"
        >
          <div className="govuk-body idsk-table-filter__title">Aktívny filter</div>
          <button
            className="govuk-body govuk-link idsk-filter-menu__toggle"
            tabIndex={0}
            data-open-text="Rozbaliť aktívny filter"
            data-close-text="Zbaliť aktívny filter"
            data-category-name=""
            aria-label="Zbaliť aktívny filter"
            type="button"
          >
            Zbaliť aktívny filter
          </button>

          <div className="govuk-clearfix idsk-table-filter__content" />
        </div>
      </div>

      <table className="idsk-table">
        <thead className="idsk-table__head">
          <tr className="idsk-table__row">
            <th scope="col" className="idsk-table__header">
              <span className="th-span">
                Mesto
                <button className="arrowBtn">
                  <span className="sr-only">Nezoradený stĺpec - použije vzostupné zoradenie.</span>
                </button>
              </span>
            </th>
            <th scope="col" className="idsk-table__header">
              <span className="th-span">
                Kraj
                <button className="arrowBtn">
                  <span className="sr-only">Nezoradený stĺpec - použije vzostupné zoradenie.</span>
                </button>
              </span>
            </th>
            <th scope="col" className="idsk-table__header">
              <span className="th-span">
                Okres
                <button className="arrowBtn">
                  <span className="sr-only">Nezoradený stĺpec - použije vzostupné zoradenie.</span>
                </button>
              </span>
            </th>
            <th scope="col" className="idsk-table__header idsk-table__header--numeric">
              <span className="th-span">
                Rozloha
                <button className="arrowBtn">
                  <span className="sr-only">Nezoradený stĺpec - použije vzostupné zoradenie.</span>
                </button>
              </span>
            </th>
            <th scope="col" className="idsk-table__header idsk-table__header--numeric">
              <span className="th-span">
                Hustota
                <button className="arrowBtn">
                  <span className="sr-only">Nezoradený stĺpec - použije vzostupné zoradenie.</span>
                </button>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="idsk-table__body" style={{ maxHeight: '364px' }}>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Bratislava</td>
            <td className="idsk-table__cell">Bratislavský</td>
            <td className="idsk-table__cell">Bratislava</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">367,66</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 199,34</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Košice</td>
            <td className="idsk-table__cell">Košický</td>
            <td className="idsk-table__cell">Košice</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">237,05</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 004,59</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Prešov</td>
            <td className="idsk-table__cell">Prešovský</td>
            <td className="idsk-table__cell">Prešov</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">70,43</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 247,85</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Žilina</td>
            <td className="idsk-table__cell">Žilinský</td>
            <td className="idsk-table__cell">Žilina</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">80,03</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 004,45</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Banská Bystrica</td>
            <td className="idsk-table__cell">Banskobystrický</td>
            <td className="idsk-table__cell">Banská Bystrica</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">103,38</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">751,78</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Nitra</td>
            <td className="idsk-table__cell">Nitriansky</td>
            <td className="idsk-table__cell">Nitra</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">100,48</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">756,65</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Trnava</td>
            <td className="idsk-table__cell">Trnavský</td>
            <td className="idsk-table__cell">Trnava</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">71,54</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">904,88</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell"> Trenčín</td>
            <td className="idsk-table__cell">Trenčiansky</td>
            <td className="idsk-table__cell">Trenčín</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">82</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">675,8</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Martin</td>
            <td className="idsk-table__cell">Žilinský</td>
            <td className="idsk-table__cell">Martin</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">67,74</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">793,67</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Poprad</td>
            <td className="idsk-table__cell">Prešovský</td>
            <td className="idsk-table__cell">Poprad</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">63,11</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">808,08</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Bratislava</td>
            <td className="idsk-table__cell">Bratislavský</td>
            <td className="idsk-table__cell">Bratislava</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">367,66</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 199,34</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Košice</td>
            <td className="idsk-table__cell">Košický</td>
            <td className="idsk-table__cell">Košice</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">237,05</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 004,59</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Prešov</td>
            <td className="idsk-table__cell">Prešovský</td>
            <td className="idsk-table__cell">Prešov</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">70,43</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 247,85</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Žilina</td>
            <td className="idsk-table__cell">Žilinský</td>
            <td className="idsk-table__cell">Žilina</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">80,03</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">1 004,45</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Banská Bystrica</td>
            <td className="idsk-table__cell">Banskobystrický</td>
            <td className="idsk-table__cell">Banská Bystrica</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">103,38</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">751,78</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Nitra</td>
            <td className="idsk-table__cell">Nitriansky</td>
            <td className="idsk-table__cell">Nitra</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">100,48</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">756,65</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Trnava</td>
            <td className="idsk-table__cell">Trnavský</td>
            <td className="idsk-table__cell">Trnava</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">71,54</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">904,88</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell"> Trenčín</td>
            <td className="idsk-table__cell">Trenčiansky</td>
            <td className="idsk-table__cell">Trenčín</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">82</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">675,8</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Martin</td>
            <td className="idsk-table__cell">Žilinský</td>
            <td className="idsk-table__cell">Martin</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">67,74</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">793,67</td>
          </tr>
          <tr className="idsk-table__row">
            <td className="idsk-table__cell">Poprad</td>
            <td className="idsk-table__cell">Prešovský</td>
            <td className="idsk-table__cell">Poprad</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">63,11</td>
            <td className="idsk-table__cell idsk-table__cell--numeric">808,08</td>
          </tr>
        </tbody>
      </table>

      <div className="idsk-table__meta">
        <div className="idsk-button-group idsk-table__meta-buttons" />

        <div className="govuk-body idsk-table__meta-source">
          Zdroj:
          <a
            className="govuk-link"
            href="https://sk.wikipedia.org/wiki/Zoznam_miest_na_Slovensku"
            target="_blank"
            title="sk.wikipedia.org"
            rel="noreferrer"
          >
            sk.wikipedia.org
          </a>
        </div>
      </div>
    </div>
  )
}
