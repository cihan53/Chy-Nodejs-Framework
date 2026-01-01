/*
 *
 * Copyright (c) 2023.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */


const {exec, execSync} = require('child_process');

for( let v=35 ; v < 38 ; v++ ){
    try {
        console.log(`npm deprecate -f 'chyz@2.0.1-rc.${v}' 'bug'`)
         execSync(`npm deprecate -f 'chyz@2.0.1-rc.${v}' 'bug'`);
        // execSync(`npm unpublish -f 'chyz@2.0.0-rc.${v}' 'bug'`)
    }catch (e) {

    }

}




