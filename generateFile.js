const fs = require('fs');
const path = require('path');
// const {v4:uuid} = require('uuid');

var dirCodes = path.join('C:\\Users\\Koushal\\Desktop',"Codes");



const generateFile = async(UserName,Name,format,content) =>{
    
    const fileName = `${Name}.${format}`;
    var temp=dirCodes+"\\"+`${UserName}`;
    // dirCodes=dirCodes+"\\"+`${UserName}`;
    
    if(!fs.existsSync(temp)){
        fs.mkdirSync(temp,{recursive:true});
    }
    const filePath = path.join(temp,fileName);
    await fs.writeFileSync(filePath,content);
    return {filePath, fileName};
    // const fileName = `${Name}.${format}`;
    // dirCodes=dirCodes+"\\"+`${UserName}`;
    
    // if(!fs.existsSync(dirCodes)){
    //     fs.mkdirSync(dirCodes,{recursive:true});
    // }
    // const filePath = path.join(dirCodes,fileName);
    // await fs.writeFileSync(filePath,content);
    // return {filePath, fileName};

};

module.exports = {
    generateFile
};