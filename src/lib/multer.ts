
import * as path from 'path';
import * as multer from 'multer';
import MulterGoogleCloudStorage from 'multer-google-storage';

export const storage =  (fileContext:string) => {
    return new MulterGoogleCloudStorage({
        filename :  (req: any, file: any, cb: any) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = file.mimetype.slice(file.mimetype.indexOf('/')+1);
            // console.log("===============>" , file)

            cb(null, fileContext + '-' + file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
        }
    })
}


export const imageFilter = (req : any, file: any, cb : any ) => {

    const allowedFormats = /jpg|jpeg|png|gif|svg/i ;
    const mimeType = allowedFormats.test(file.mimetype);
    const userExtension = allowedFormats.test(path.extname(file.originalname));

    if( mimeType && userExtension){
        cb(null, true);
    }else{
        cb(null, false);
    }

}