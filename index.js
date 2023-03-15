var express = require('express');
const cors = require('cors');
const {spawn} = require('child_process');
const app = express();

const { generateFile } = require('./generateFile');
const { runcode } = require('./executebhai');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/",async(req,res)=>{
  
    return res.json({ hello: "world" });

})



app.post("/run", async (req, res) => {

    // const language = req.body.language;
    // const code = req.body.code;

    const { language, code } = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    const {filePath, fileName} = await generateFile(language, code);

    runcode(filePath, fileName)

    res.status(200).json({filePath});

});

app.listen(4000, () => {
    console.log('Listening on 4000....');
});