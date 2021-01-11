import moment from 'moment'

export const MulterConfig = {
  destination: function (req:any, file:any, cb:any) {
    const year = moment().format('YYYY') ,
    month = moment().format('M')

    cb(null, `./public/uploads/${year}/${month}/`)
  },
  
  filename: function (req: any, file: any, cb: any) {
    const day = moment().format("D") ,
    time = moment().format("HHmm") ,
    ms = moment().format("SSS") ,
    type = file.originalname.match(/\.[0-9a-z]+$/i)[0]

    cb(null, `${file.fieldname}-${day}${time}${ms}${type}`)
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