import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export interface IIdentityTermsConfirmationView {
    getIdentityTerms: () => Promise<void>
    changeIdentityTerms: (identityTermsConfirmation: boolean) => Promise<void>
}

export const IdentityTermsConfirmationView: React.FC<IIdentityTermsConfirmationView> = ({ getIdentityTerms, changeIdentityTerms }) => {
    const { t } = useTranslation()

    const navigate = useNavigate()

    return (
    <>
    <div class="bg-light lter b-b wrapper-md">
    <div class="col-lg-10 centerDiv">
        <h1 class="m-n font-thin h1" translate="LICENCE_AGREMENT.DETAIL.TITLE"></h1>
        <last-update></last-update>

        <p class="m-t-sm" translate="LICENCE_AGREMENT.DETAIL.TITLE_TEXT"></p>
        <h2 class="m-n font-thin h2" translate="LICENCE_AGREMENT.DETAIL.USAGE"></h2>
        <p translate="LICENCE_AGREMENT.DETAIL.USAGE_TITLE"></p>
        <h2 class="m-n font-thin h2" translate="LICENCE_AGREMENT.DETAIL.RANGE"></h2>
        <p>
            <span translate="LICENCE_AGREMENT.DETAIL.RANGE_TEXT"></span>

        <ul><span translate="LICENCE_AGREMENT.DETAIL.MUST_NOT.TITLE"></span>
            <li translate="LICENCE_AGREMENT.DETAIL.MUST_NOT.FIRST"></li>
            <li translate="LICENCE_AGREMENT.DETAIL.MUST_NOT.SECOND">
            </li>
            <li translate="LICENCE_AGREMENT.DETAIL.MUST_NOT.THIRD"></li>

            <span translate="LICENCE_AGREMENT.DETAIL.MUST_NOT.CHANGE"></span>
        </ul>
        </p>

        <h2 class="m-n font-thin h2" translate="LICENCE_AGREMENT.DETAIL.ACCOUNT"></h2>
        <p translate="LICENCE_AGREMENT.DETAIL.ACCOUNT_TEXT"></p>
        <h2 class="m-n font-thin h2" translate="LICENCE_AGREMENT.DETAIL.PROTECTION"></h2>
        <p translate="LICENCE_AGREMENT.DETAIL.PROTECTION_TEXT"></p>
        <ul>
            <li translate="LICENCE_AGREMENT.DETAIL.PROCES_INFORMATION.NAME"></li>
            <li translate="LICENCE_AGREMENT.DETAIL.PROCES_INFORMATION.SURNAME"></li>
            <li translate="LICENCE_AGREMENT.DETAIL.PROCES_INFORMATION.EMAIL"></li>
            <li translate="LICENCE_AGREMENT.DETAIL.PROCES_INFORMATION.PHONE"></li>
            <li translate="LICENCE_AGREMENT.DETAIL.PROCES_INFORMATION.PO"></li>
        </ul>

        <div class="col-lg-7 centerDiv" ng-if="::userUuid" ng-cloak>
            <label class="i-checks m-b-none" for="licenceAgrement">
                <input type="checkbox" id="licenceAgrement" name="licenceAgrement"
                       class="ng-pristine ng-valid ng-touched"
                       ng-model="model.agreed">
                <i></i>
                {{ 'LICENCE_AGREMENT.AGREE' | translate}}
            </label>
        </div>
        <div class="col-lg-2 centerDiv" ng-if="::userUuid">
            <button type="button" ng-click="submit()" class="btn btn-info" translate="COMMON_BUTTONS.CONFIRM"></button>
        </div>
    </div>
</div>

<div class="wrapper-md">

</div>
    </>
    )
}
