import path from 'path';
import  express from'express'
const configViewEngine = (app)=>{
    //config template engine
    app.set('views',path.join('./src', 'views'));
    app.set('view engine','ejs')
    
    //config static file

}

export {configViewEngine} 