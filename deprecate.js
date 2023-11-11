/*
 *
 * Copyright (c) 2023.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */


const {exec, execSync} = require('child_process');

for( let v=3 ; v < 7 ; v++ ){
    try {
        console.log(`npm deprecate -f 'chyz@1.2.4-rc.${v}' 'bug'`)
        // execSync(`npm deprecate -f 'chyz@2.0.0-rc.${v}' 'bug'`);
        // execSync(`npm unpublish -f 'chyz@2.0.0-rc.${v}' 'bug'`)
    }catch (e) {

    }

}




