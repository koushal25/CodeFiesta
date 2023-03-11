const express = require('express');
const app= express();

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


app.set('view engine','ejs');

app.get('/',function(req,res){
    
    res.sendFile('./views/index.html',{root:__dirname});

    // res.render('index',{title:'Home'});
})


app.get('/about',function(req,res){

    res.render('about',{title:'About'});

})

app.use((req,res)=>{
    res.status(404).render('404',{title:'404'});
})
app.listen(3000);