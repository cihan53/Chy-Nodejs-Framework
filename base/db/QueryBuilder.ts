/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */
import {BaseObject} from "../BaseObject";
import Utils from "../../requiments/Utils";


/**
 * QueryBuilder builds a SELECT SQL statement based on the specification given as a [[Query]] object.
 *
 * SQL statements are created from [[Query]] objects using the [[build()]]-method.
 *
 * QueryBuilder is also used by [[Command]] to build SQL statements such as INSERT, UPDATE, DELETE, CREATE TABLE.
 *
 * For more details and usage information on QueryBuilder, see the [guide article on query builders](guide:db-query-builder).
 *
 * @property-write string[] $conditionClasses Map of condition aliases to condition classes. For example:
 * ```php ['LIKE' => yii\db\condition\LikeCondition::class] ``` . This property is write-only.
 * @property-write string[] $expressionBuilders Array of builders that should be merged with the pre-defined
 * ones in [[expressionBuilders]] property. This property is write-only.
 *
 * @author Cihan Ozturk <cihan@chy.com.tr>; Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class QueryBuilder extends BaseObject {


    /**
     * The prefix for automatically generated query binding parameters.
     */
    public static readonly PARAM_PREFIX = ':qp';

    /**
     * @var Connection the database connection.
     */
    public $db: any;

    /**
     * @var string the separator between different fragments of a SQL statement.
     * Defaults to an empty space. This is mainly used by [[build()]] when generating a SQL statement.
     */
    public $separator = ' ';

    /**
     * @var array the abstract column types mapped to physical column types.
     * This is mainly used to support creating/modifying tables using DB-independent data type specifications.
     * Child classes should override this property to declare supported type mappings.
     */
    public $typeMap = [];

    /**
     * @var array map of query condition to builder methods.
     * These methods are used by [[buildCondition]] to build SQL conditions from array syntax.
     * @deprecated since 2.0.14. Is not used, will be dropped in 2.1.0.
     */
    protected $conditionBuilders = [];
    /**
     * @var array map of condition aliases to condition classes. For example:
     *
     * ```php
     * return [
     *     'LIKE' => yii\db\condition\LikeCondition::class,
     * ];
     * ```
     *
     * This property is used by [[createConditionFromArray]] method.
     * See default condition classes list in [[defaultConditionClasses()]] method.
     *
     * In case you want to add custom conditions support, use the [[setConditionClasses()]] method.
     *
     * @see setConditonClasses()
     * @see defaultConditionClasses()
     * @since 2.0.14
     */
    protected $conditionClasses = [];
    /**
     * @var string[]|ExpressionBuilderInterface[] maps expression class to expression builder class.
     * For example:
     *
     * ```php
     * [
     *    yii\db\Expression::class => yii\db\ExpressionBuilder::class
     * ]
     * ```
     * This property is mainly used by [[buildExpression()]] to build SQL expressions form expression objects.
     * See default values in [[defaultExpressionBuilders()]] method.
     *
     *
     * To override existing builders or add custom, use [[setExpressionBuilder()]] method. New items will be added
     * to the end of this array.
     *
     * To find a builder, [[buildExpression()]] will check the expression class for its exact presence in this map.
     * In case it is NOT present, the array will be iterated in reverse direction, checking whether the expression
     * extends the class, defined in this map.
     *
     * @see setExpressionBuilders()
     * @see defaultExpressionBuilders()
     * @since 2.0.14
     */
    protected $expressionBuilders = [];


    /**
     * Constructor.
     * @param Connection $connection the database connection.
     * @param array $config name-value pairs that will be used to initialize the object properties
     */


    constructor($connection: any, $config = []) {
        super($connection);
        this.$db = $connection;
    }


    /**
     * {@inheritdoc}
     */

    public init() {
        super.init();

        this.$expressionBuilders = Utils.merge(this.#defaultExpressionBuilders(), this.$expressionBuilders);
        this.$conditionClasses = Utils.merge(this.defaultConditionClasses(), this.$conditionClasses);
    }


    /**
     * Contains array of default condition classes. Extend this method, if you want to change
     * default condition classes for the query builder. See [[conditionClasses]] docs for details.
     *
     * @return array
     * @see conditionClasses
     * @since 2.0.14
     */
    protected defaultConditionClasses() {
        return {
            'NOT': 'yii\db\conditions\NotCondition',
            'AND': 'yii\db\conditions\AndCondition',
            'OR': 'yii\db\conditions\OrCondition',
            'BETWEEN': 'yii\db\conditions\BetweenCondition',
            'NOT BETWEEN': 'yii\db\conditions\BetweenCondition',
            'IN': 'yii\db\conditions\InCondition',
            'NOT IN': 'yii\db\conditions\InCondition',
            'LIKE': 'yii\db\conditions\LikeCondition',
            'NOT LIKE': 'yii\db\conditions\LikeCondition',
            'OR LIKE': 'yii\db\conditions\LikeCondition',
            'OR NOT LIKE': 'yii\db\conditions\LikeCondition',
            'EXISTS': 'yii\db\conditions\ExistsCondition',
            'NOT EXISTS': 'yii\db\conditions\ExistsCondition',
        };
    }

    /**
     * Contains array of default expression builders. Extend this method and override it, if you want to change
     * default expression builders for this query builder. See [[expressionBuilders]] docs for details.
     *
     * @return array
     * @see $expressionBuilders
     * @since 2.0.14
     */

    #defaultExpressionBuilders() {
        return {
            'yii\db\Query': 'yii\db\QueryExpressionBuilder',
            'yii\db\PdoValue': 'yii\db\PdoValueBuilder',
            'yii\db\Expression': 'yii\db\ExpressionBuilder',
            'yii\db\conditions\ConjunctionCondition': 'yii\db\conditions\ConjunctionConditionBuilder',
            'yii\db\conditions\NotCondition': 'yii\db\conditions\NotConditionBuilder',
            'yii\db\conditions\AndCondition': 'yii\db\conditions\ConjunctionConditionBuilder',
            'yii\db\conditions\OrCondition': 'yii\db\conditions\ConjunctionConditionBuilder',
            'yii\db\conditions\BetweenCondition': 'yii\db\conditions\BetweenConditionBuilder',
            'yii\db\conditions\InCondition': 'yii\db\conditions\InConditionBuilder',
            'yii\db\conditions\LikeCondition': 'yii\db\conditions\LikeConditionBuilder',
            'yii\db\conditions\ExistsCondition': 'yii\db\conditions\ExistsConditionBuilder',
            'yii\db\conditions\SimpleCondition': 'yii\db\conditions\SimpleConditionBuilder',
            'yii\db\conditions\HashCondition': 'yii\db\conditions\HashConditionBuilder',
            'yii\db\conditions\BetweenColumnsCondition': 'yii\db\conditions\BetweenColumnsConditionBuilder',
        };
    }

}
