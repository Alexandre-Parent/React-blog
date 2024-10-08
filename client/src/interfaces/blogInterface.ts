import IUser from "./userInterface";

export default interface IBlog {
    _id: string,
    title: string,
    author:  IUser
    content: string
    headline: string
    picture?: string
    createdAt: string
    updatedAt: string

}
