const shell = require('exec-sh').promise;
const path = require('path')

const existsSync = require('fs').existsSync

const fileName = `vls.js`

async function rmAndCopy(form,to){
    console.log(`rm ${to}/${fileName}`);
    await shell(`rm -rf ${to}/${fileName}`)
    console.log(`cp ${form} ${to}`);
    return await shell(`cp ${form} ${to}`)
}

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
    const copyToPath = `~/${vscodeName}/extensions/${veturName}/server/dist`

    const relativeFilePath = `./node_modules/bbl-vue-intellisense/lib/${fileName}`


    let detectRelativeNodeModulesPath = path.resolve(relativeFilePath)
    let relativeNodeModulesExist = await existsSync(detectRelativeNodeModulesPath)
    if(relativeNodeModulesExist){
        console.log('detect at Relative NodeModules.');
        await rmAndCopy(detectRelativeNodeModulesPath,copyToPath)
        return true
    }else{
        console.log('detect at Relative NodeModules Failed.')
    }

    console.log('try to find at global')
    

    let findVueInt = await shell('which vue-int',true)
    let vueIntName = ''
    if(findVueInt.stderr){
        throw new Error('未找到vue-int命令')
    }else{
        vueIntName = findVueInt.stdout.replace(/\n/g,'')
        console.log(vueIntName);
    }
    
    let findSoftLink = await shell(`readlink ${vueIntName}`,true)
    let softLinkLocation = ''
    if(findSoftLink.stderr){
        throw new Error('未找到vue-int软连接')
    }else{
        softLinkLocation = findSoftLink.stdout.replace(/\n/g,'')
        console.log(softLinkLocation);
    }

    let realSoftPath = path.resolve(vueIntName,'../'+softLinkLocation)
    console.log(realSoftPath);

    let findRealSoftLink = await shell(`readlink ${realSoftPath}`,true)
    let realSoftLinkLocation = ''
    if(findRealSoftLink.stderr){
        throw new Error('未找到global vue-int软连接')
    }else{
        realSoftLinkLocation = findRealSoftLink.stdout.replace(/\n/g,'')
        console.log(realSoftLinkLocation);
    }

    let realFinalPath = path.resolve(realSoftPath,'../'+realSoftLinkLocation,`../lib/${fileName}`)
    console.log(realFinalPath);
    await rmAndCopy(realFinalPath,copyToPath)
}