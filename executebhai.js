const {spawn} = require('child_process');
const runcodes = (fileName) =>{
    const cmd = spawn('cmd',['/c',` bhailang ${fileName}>${fileName}.txt `],{
        cwd:'C:\\Users\\Koushal\\Desktop\\codes'
    
    });
    
    cmd.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // return res.status(200).json({output:`stdout: ${data}`})
      });
      
      cmd.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      
      cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
}


  module.exports = {
     runcodes

  };