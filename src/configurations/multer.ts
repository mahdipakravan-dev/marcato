import moment from 'moment'

export const MulterConfig = {
  destination: function (req:any, file:any, cb:any) {
    const year = moment().format('YYYY') ,
    month = moment().format('M')

    cb(null, `./public/uploads/${year}/${month}`)
  },
  
  filename: function (req: any, file: any, cb: any) {
      cb(null, file.originalname)
  }
}

export const FileFilter = (req: any,file: any,cb: any) => {
  if(file.mimetype === "image/jpg"  || 
     file.mimetype ==="image/jpeg"  || 
     file.mimetype ===  "image/png"){
   
  cb(null, true);
 }else{
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
}}