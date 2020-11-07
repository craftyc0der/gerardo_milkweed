import { IDataPosts } from "./Posts"

export { default as Users } from "./Users"
export { default as Posts } from "./Posts"

export interface IState {
  Posts: {
    data: IDataPosts
    failures: [],    
    fetched: boolean
    fetching: boolean
    uploading: boolean
    uploaded: boolean
  }
  Users: {
    profileImage?: string
  }
}