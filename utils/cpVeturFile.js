const shell = require('exec-sh').promise;

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
  
    const rmFile = await shell(`rm -rf ~/${vscodeName}/extensions/${veturName}/dist/vueMain.js`)
  
    const cpFile = await shell(`cp ./lib/vueMain.js ~/${vscodeName}/extensions/${veturName}/dist`)
}