import IUser from "./userInterface";

export default interface IBlog extends Document{
    title:string
    author: IUser
    content: string
    headline: string
    picture?: string
}