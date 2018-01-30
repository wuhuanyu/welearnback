import { StorageEngine} from "_@types_multer@1.3.6@@types/multer";
import * as multer from 'multer';
import * as path from 'path';

const avatarDest:string=path.resolve(__dirname+'../uploads/avatars');

const storage:StorageEngine=multer.diskStorage({
    destination:(req:Express.Request,file:Express.Multer.File,cbk:(err:Error|null,destination:string)=>void)=>{
        cbk(null,avatarDest);
    },
    filename:(req:Express.Request,file:Express.Multer.File,cbk)=>{
        cbk(null,new Date().getTime()+file.originalname);
    }
});

const upload=multer({storage:storage});
export default upload.single('avatar');