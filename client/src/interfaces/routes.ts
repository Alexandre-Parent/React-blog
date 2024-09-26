export default interface Iroute {
    path: string
    name:string
    exact:boolean
    auth: boolean
    component: any
    props? : any
}