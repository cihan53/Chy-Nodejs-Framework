/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

import {Component} from "./Component";
import {ViewContextInterface} from "./ViewContextInterface";
import {Action} from "./Action";
import {View} from "./View";
import Utils from "../requiments/Utils";
import BaseChyz from "../BaseChyz";
import {InvalidRouteException} from "./InvalidRouteException";
import {InlineAction} from "./InlineAction";

export class BaseController extends Component implements ViewContextInterface {

    /**
     * @var string the ID of this controller.
     */
    public id: string = "";
    /**
     * @var Module the module that this controller belongs to.
     */
    public module: any;


    /**
     * @var string the ID of the action that is used when the action ID is not specified
     * in the request. Defaults to 'index'.
     */
    public defaultAction = 'index';

    /**
     * @var null|string|false the name of the layout to be applied to this controller's views.
     * This property mainly affects the behavior of [[render()]].
     * Defaults to null, meaning the actual layout value should inherit that from [[module]]'s layout value.
     * If false, no layout will be applied.
     */
    public layout: null | string | boolean = null;

    /**
     * @var Action|null the action that is currently being executed. This property will be set
     * by [[run()]] when it is called by [[Application]] to run an action.
     */
    public action: Action | undefined;

    /**
     * @var Request|array|string The request.
     * @since 2.0.36
     */
    public request: Request | object | string = 'request';

    /**
     * @var Response|array|string The response.
     * @since 2.0.36
     */
    public response: Response | object | string = 'response';

    /**
     * @var View|null the view object that can be used to render views or view files.
     */
    private _view: View | null = null;

    /**
     * @var string|null the root directory that contains view files for this controller.
     */
    private _viewPath: string | null = null;


    constructor(id: string, module: any, config = []) {
        super(config);
        this.id = id;
        this.module = module;
    }

    /**
     * {@inheritdoc}
     * @since 2.0.36
     */
    public init() {
        super.init();
        // this.request = Utils.factory(this.request)
        // this.response = Utils.factory(this.response)
        // this.request = Instance::ensure($this->request, Request::className());
        // this.response = Instance::ensure($this->response, Response::className());
    }

    /**
     * Declares external actions for the controller.
     *
     * This method is meant to be overwritten to declare external actions for the controller.
     * It should return an array, with array keys being action IDs, and array values the corresponding
     * action class names or action configuration arrays. For example,
     *
     * ```php
     * return [
     *     'action1' => 'app\components\Action1',
     *     'action2' => [
     *         'class' => 'app\components\Action2',
     *         'property1' => 'value1',
     *         'property2' => 'value2',
     *     ],
     * ];
     * ```
     *
     * [[\Yii::createObject()]] will be used later to create the requested action
     * using the configuration provided here.
     * @return array
     */
    public actions(): any {
        return {};
    }

    /**
     * Runs an action within this controller with the specified action ID and parameters.
     * If the action ID is empty, the method will use [[defaultAction]].
     * @param string $id the ID of the action to be executed.
     * @param array $params the parameters (name-value pairs) to be passed to the action.
     * @return mixed the result of the action.
     * @throws InvalidRouteException if the requested action ID cannot be resolved into an action successfully.
     * @see createAction()
     */
    public runAction(id: string, params = []) {
        let action = this.createAction(id);
        if (action === null) {
            throw new InvalidRouteException('Unable to resolve the request: ' + this.getUniqueId() + '/' + id);
        }
        BaseChyz.debug("actio ıd", id, action);

        BaseChyz.debug('Route to run: ' + action.getUniqueId(), "runAction");

        // if (Yii::$app->requestedAction === null) {
        //     Yii::$app->requestedAction = $action;
        // }

        //     $oldAction = $this->action;
        //     $this->action = $action;
        //
        //     $modules = [];
        //     $runAction = true;
        //
        //     // call beforeAction on modules
        //     foreach ($this->getModules() as $module) {
        //     if ($module->beforeAction($action)) {
        //         array_unshift($modules, $module);
        //     } else {
        //         $runAction = false;
        //         break;
        //     }
        // }
        //
        //     $result = null;
        //
        //     if ($runAction && $this->beforeAction($action)) {
        //     // run the action
        //     $result = $action->runWithParams($params);
        //
        //     $result = $this->afterAction($action, $result);
        //
        //     // call afterAction on modules
        //     foreach ($modules as $module) {
        //         /* @var $module Module */
        //         $result = $module->afterAction($action, $result);
        //     }
        // }
        //
        //     if ($oldAction !== null) {
        //         $this->action = $oldAction;
        //     }
        //
        //     return $result;
    }

    /**
     * Creates an action based on the given action ID.
     * The method first checks if the action ID has been declared in [[actions()]]. If so,
     * it will use the configuration declared there to create the action object.
     * If not, it will look for a controller method whose name is in the format of `actionXyz`
     * where `xyz` is the action ID. If found, an [[InlineAction]] representing that
     * method will be created and returned.
     * @param string $id the action ID.
     * @return Action|null the newly created action instance. Null if the ID doesn't resolve into any action.
     */
    public createAction(id: string) {
        if (id === '') {
            id = this.defaultAction;
        }

        let actionMap: any = this.actions();
        if (actionMap[id]) {
            // return Yii::createObject($actionMap[$id], [$id, $this]);
        }

        if (Utils.preg_match(/^(?:[a-z0-9_]+-)*[a-z0-9_]+$/, id)) {
            let methodName = 'action' + Utils.ucwords(id.replace('-', ' ')).replace(' ', '');
            if (this.hasOwnProperty(methodName)) {
                // this.prototype[methodName] =
                // $method = new \ReflectionMethod($this, $methodName);
                // if ($method->isPublic() && $method->getName() === $methodName)
                // {
                //     return new InlineAction($id, $this, $methodName);
                // }

                return new InlineAction(id, this, methodName);
            }
        }

        return null;
    }

    /**
     * This method is invoked right before an action is executed.
     *
     * The method will trigger the [[EVENT_BEFORE_ACTION]] event. The return value of the method
     * will determine whether the action should continue to run.
     *
     * In case the action should not run, the request should be handled inside of the `beforeAction` code
     * by either providing the necessary output or redirecting the request. Otherwise the response will be empty.
     *
     * If you override this method, your code should look like the following:
     *
     * ```php
     * public function beforeAction($action)
     * {
     *     // your custom code here, if you want the code to run before action filters,
     *     // which are triggered on the [[EVENT_BEFORE_ACTION]] event, e.g. PageCache or AccessControl
     *
     *     if (!parent::beforeAction($action)) {
     *         return false;
     *     }
     *
     *     // other custom code here
     *
     *     return true; // or false to not run the action
     * }
     * ```
     *
     * @param Action $action the action to be executed.
     * @return bool whether the action should continue to run.
     */
    public beforeAction(action: any):boolean {
        // $event = new ActionEvent($action);
        // $this->trigger(self::EVENT_BEFORE_ACTION, $event);
        // return $event->isValid;
        return true;
    }

    /**
     * Returns the unique ID of the controller.
     * @return string the controller ID that is prefixed with the module ID (if any).
     */
    public getUniqueId() {
        return this.id;
        // return this.module instanceof Application ? this.id : this.module.getUniqueId() + '/' + this.id;
    }

    getViewPath(): string {
        return "";
    }

}