/*
 *
 * Copyright (c) 2021.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

import {Component} from "./Component";

export class Response extends Component {
    /**
     * @var int the exit status. Exit statuses should be in the range 0 to 254.
     * The status 0 means the program terminates successfully.
     */
    public $exitStatus = 0;

    /**
     * Sends the response to client.
     */
    public send() {
    }

    public clearOutputBuffers() {

    }
}