/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Component} from "./Component";
import {DynamicContentAwareInterface} from "./DynamicContentAwareInterface";

export class View extends Component implements DynamicContentAwareInterface {


    /**
     * @var ViewContextInterface the context under which the [[renderFile()]] method is being invoked.
     */
    public $context: any;

    /**
     * @var array custom parameters that are shared among view templates.
     */
    public $params = [];

    /**
     * @var array a list of available renderers indexed by their corresponding supported file extensions.
     * Each renderer may be a view renderer object or the configuration for creating the renderer object.
     * For example, the following configuration enables both Smarty and Twig view renderers:
     *
     * ```php
     * [
     *     'tpl' => ['class' => 'yii\smarty\ViewRenderer'],
     *     'twig' => ['class' => 'yii\twig\ViewRenderer'],
     * ]
     * ```
     *
     * If no renderer is available for the given view file, the view file will be treated as a normal PHP
     * and rendered via [[renderPhpFile()]].
     */
    public $renderers: any;

    addDynamicPlaceholder($name: string, $statements: string): any {
    }

    getDynamicPlaceholders(): any {
    }

    setDynamicPlaceholders($placeholders: string): any {
    }

}