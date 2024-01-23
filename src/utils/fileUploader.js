// Esto es para el manejo de archivos
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import {extname} from 'path';
import __dirname from '../utils.js';
import { unlinkSync } from 'fs';

// Esto corresponde al manejo de archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        switch (file.fieldname) {
            case 'profile':
                cb(null, __dirname+'/public/img/profile')    
                break;
            case 'products':
                cb(null, __dirname+'/public/img/products')
            break;
            case 'Identificacion':
                cb(null, __dirname+'/public/documents')
            break;
            case 'Comprobante de domicilio':
                cb(null, __dirname+'/public/documents')
            break;
            case 'Comprobante de estado de cuenta':
                cb(null, __dirname+'/public/documents')
            break;
            default:
                cd(null, false)
                break
        }
    },
    filename: function(req, file, cb) {
        const fileExtension = extname(file.originalname)
        const newName = uuidv4()+fileExtension;
        cb(null, newName);
    }
});

export const uploader = multer({storage});

export const deleteFiles = (filesObject) => {
    Object.values(filesObject).forEach(files => {
        files.forEach(file => {
            unlinkSync(file.path);
        });
    });
};