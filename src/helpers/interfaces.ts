export enum statusCodes {
    VALIDATION_ERROR = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    FORBIDDEN = 403,
    NOT_ACCEPTABLE = 406,
    INTERNAL = 500,
    SERVICE_UNAVAILABLE = 503,
    NOT_IMPLEMENTED = 501,
    GATEWAY_TIMEOUT = 504,
    SUCCESS = 200,
    CREATED = 201,
    NON_AUTHORITATIVE = 206,
    NO_CONTENT = 204,
    ACCEPTED = 202,
    ALREADY_REPORTED = 208,
    IM_USED = 226
}

export interface requestFiles {
    fieldname: string ,
    originalname: string ,
    encoding: string ,
    mimetype: string ,
    destination: string ,
    filename: string ,
    path: string ,
    size: number
}

/**
 * Admin Interfaces
 */

export enum adminTypes {
    superAdmin = "superAdmin" , 
    teacher = "teacher", 
    supplier = "supplier"
}

/**
 * User Interface
 */

export interface userInterface {
    name ?: string , 
    username ?: string ,
    family ?: string , 
    phone : string , 
    mail ?: string , 
    insta ?: string , 
    birthday ?: string , 
    password : string 
    cart ?: cartInterface[]
}

export interface cartInterface {
    id : string
    enName : string , 
    fullName : string , 
    qty : number , 
    price : number
    thumbnail : string
}

/**
 * Dashboard Interfaces
 */

export interface dashboardSidebarInterface {
    navHeader : string ,
    navItems : navItems[]
}
  
export interface navItems {
    name : string , 
    badge : {status : boolean , type ?: string , text ?: string} ,
    icon : string , 
    link : string
}

/**
 * Toknes Interfaecs
 */

export interface DashboardToken {
    userType : string ,
    userName : string ,
    userProfile : string ,
    roles : dashboardSidebarInterface[]
}

export interface FrontendToken {
    phone : string ,
    id : string
}

/**
 * Product Interfaces
 */

 export enum productTypes {
    DOWNLOAD = "download" , 
    PHYSIC = "physic" , 
    TICKET = "ticket"
 }

export interface categoryInterface {
    faName : string ,
    enName : string 
}

export interface instrumentInterface {
    faName : string ,
    enName : string 
}

export interface productInterface {
    fullName : string , 
    enName : string ,
    type : productTypes , 
    price : number , 
    sellCount : number ,
    desc : string ,
    category : string , 
    instrument : {enName : string , faName : string} ,
    thumbnails : any[]
}