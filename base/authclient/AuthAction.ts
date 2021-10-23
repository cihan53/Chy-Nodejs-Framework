/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Action} from "../Action";
import {NotFoundHttpException} from "../NotFoundHttpException";
import Utils from "../../requiments/Utils";
import BaseChyz from "../../BaseChyz";

export class AuthAction extends Action {
    /**
     * @var string name of the auth client collection application component.
     * It should point to [[Collection]] instance.
     */
    public $clientCollection = 'authClientCollection';

    /**
     * @var string name of the GET param, which is used to passed auth client id to this action.
     * Note: watch for the naming, make sure you do not choose name used in some auth protocol.
     */
    public $clientIdGetParamName = 'authclient';

    /**
     * @var callable PHP callback, which should be triggered in case of successful authentication.
     * This callback should accept [[ClientInterface]] instance as an argument.
     * For example:
     *
     * ```php
     * public function onAuthSuccess(ClientInterface $client)
     * {
     *     $attributes = $client->getUserAttributes();
     *     // user login or signup comes here
     * }
     * ```
     *
     * If this callback returns [[Response]] instance, it will be used as action response,
     * otherwise redirection to [[successUrl]] will be performed.
     */
    public $successCallback: any;

    /**
     * @var callable PHP callback, which should be triggered in case of authentication cancelation.
     * This callback should accept [[ClientInterface]] instance as an argument.
     * For example:
     *
     * ```php
     * public function onAuthCancel(ClientInterface $client)
     * {
     *     // set flash, logging, etc.
     * }
     * ```
     *
     * If this callback returns [[Response]] instance, it will be used as action response,
     * otherwise redirection to [[cancelUrl]] will be performed.
     *
     * @since 2.1.5
     */
    public $cancelCallback: any;

    /**
     * @var User|array|string the User object or the application component ID of the user component.
     * @since 2.1.8
     */
    public $user:any;

    /**
     * @var string the redirect url after successful authorization.
     */
    private $_successUrl: string = "";
    /**
     * @var string the redirect url after unsuccessful authorization (e.g. user canceled).
     */
    private $_cancelUrl: string = "";


    /**
     * @inheritdoc
     */
    public init() {
        super.init();
        this.$user = Utils.cloneDeep(BaseChyz.getComponent("user"));
        // this.user = Instance::ensure($this->user, User::className());
    }


    get successUrl(): string {
        return this.$_successUrl;
    }

    set successUrl(value: string) {
        this.$_successUrl = value;
    }

    get cancelUrl(): string {
        return this.$_cancelUrl;
    }

    set cancelUrl(value: string) {
        this.$_cancelUrl = value;
    }



    /**
     * Runs the action.
     */
    public  run()
    {
        // $clientId = Yii::$app->getRequest()->getQueryParam($this->clientIdGetParamName);
        // if (!empty($clientId)) {
        //     /* @var $collection \yii\authclient\Collection */
        //     $collection = Yii::$app->get($this->clientCollection);
        //     if (!$collection->hasClient($clientId)) {
        //         throw new NotFoundHttpException("Unknown auth client '{$clientId}'");
        //     }
        //     $client = $collection->getClient($clientId);
        //
        //     return $this->auth($client);
        // }


        throw new NotFoundHttpException("sdf");
    }
}
