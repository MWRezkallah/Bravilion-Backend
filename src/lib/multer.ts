
import * as path from 'path';
import * as multer from 'multer';

export const storage =  (fileDestination:string) => {
    return multer.diskStorage({
        destination: fileDestination //note that this path is relative from where you run the command/server not from the route directory
        ,
        filename:  (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/')+1);
            // console.log("===============>" , file)

            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
        }
    })
}
    

export const imageFilter = (req : any, file: any, cb : any ) => {

    const allowedFormats = /jpg|jpeg|png|gif/i ;
    const mimeType = allowedFormats.test(file.mimetype);
    const userExtension = allowedFormats.test(path.extname(file.originalname));

    if( mimeType && userExtension){
        cb(null, true);
    }else{
        cb(null, false);
    }

}