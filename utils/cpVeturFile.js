const shell = require('exec-sh').promise;
const path = require('path')


import { existsSync } from 'fs';


module.exports = async function copyFileToVeturPlugin(){
    let findVsCode = await shell('ls -a ~ | grep .vscode',true)
    let vscodeName = '.vscode'
    if(findVsCode.stderr){
        throw new Error('未找到.vscode')
    }else{
        vscodeName = findVsCode.stdout.replace(/\n/g,'')
        console.log(vscodeName);
    }
  
    let findVetur =  await shell(`ls -a ~/${vscodeName}/extensions | grep vetur`,true)
    let veturName = ''
    if(findVetur.stderr){
        throw new Error('未找到vetur插件')
    }else{
        veturName = findVetur.stdout.replace(/\n/g,'')
        console.log(veturName);
    }
    const copyToPath = `~/${vscodeName}/extensions/${veturName}/dist`

    const rmFile = await shell(`rm -rf ${copyToPath}/vueMain.js`)
    

    let detectRelativeNodeModulesPath = `${path.resolve('./node_modules/bbl-vue-intellisense/lib/vueMain.js')}`
    let relativeNodeModulesExist = await existsSync(detectRelativeNodeModulesPath)
    if(relativeNodeModulesExist){
        console.log('detect at Relative NodeModules.');
        const cpFile = await shell(`cp ${detectRelativeNodeModulesPath} ${copyToPath}`)
        return true
    }

    





}