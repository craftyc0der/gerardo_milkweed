import { AnyAction, Dispatch } from "redux"
import { IServices } from "../services"
import { firestore } from 'firebase';
import * as utils from '../utils';
import { IState } from ".";

// interfaces
export interface IPost {
  barcode: string
  qrcode: string
  plateSide: string
  sampleId: string
  userId: string
  createdAt: firestore.Timestamp
  imageURL: string
  hostAntGenus: string
  hostAntSpecies: string
  hostStrain: string
  parasiteAntGenus: string
  parasiteAntSpecies: string
  parasiteStrain: string
  temperature: number
  location: string
  media: string
}

export interface IDataPosts {
  [key: string]: IPost
}

export interface IUploadPost {
  files: FileList
}

export interface IUploadData {
  file: File
}

export interface IUploadFailure {
  files: string[]
}

// action types
const START = 'posts/fetch-start'
const SUCCESS = 'posts/fetch-success'
const ERROR = 'posts/fetch-error'
const ADD = 'posts/add'
const REMOVE = 'posts/remove'
const UPLOAD_START = 'posts/upload-start'
const UPLOAD_SUCCESS = 'posts/upload-success'
const UPLOAD_FAILURE = 'posts/upload-failure'
const UPLOAD_DATA_SUCCESS = 'posts/upload-data-success'
const POST_URL = process.env.REACT_APP_CLOUD_FUNCTION_URL || ''

// action creators
const fetchStart = () => ({
  type: START,
})
const fetchSuccess = (payload: IDataPosts) => ({
  payload,
  type: SUCCESS,
})
const fetchError = (error: Error) => ({
  error,
  type: ERROR,
})
const add = (payload: IDataPosts) => ({
  payload,
  type: ADD,
})
const uploadStart = () => ({
  type: UPLOAD_START
})

const uploadSuccess = (payload: IDataPosts) => ({
  payload,
  type: UPLOAD_SUCCESS,
})

const uploadDataSuccess = (payload: IDataPosts) => ({
  payload,
  type: UPLOAD_DATA_SUCCESS,
})

const uploadFailure = (payload: IUploadFailure) => ({
  payload,
  type: UPLOAD_FAILURE,
})

const remove = (payload: string) => ({
  payload,
  type: REMOVE,
})

// reducer initial state
const initialState = {
  data: {},
  failures: [],
  fetched: false,
  fetching: false,
  uploaded: false,
  uploading: false,
}

export default function reducer(state = initialState, action: AnyAction) {
  const posts: any = {}
  switch (action.type) {
    case START:
      return {
        ...state,
        fetching: true,
      }
    case SUCCESS:
      return {
        ...state,
        data: action.payload,
        fetched: true,
        fetching: false,
      }
    case ERROR:
      return {
        ...state,
        error: action.error,
        fetching: false,
      }
    case ADD:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        }
      }
    case UPLOAD_START:
      return {
        ...state,
        uploading: true
      }
    case UPLOAD_SUCCESS:
      state.failures = []
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
        uploaded: true,
        uploading: false,
      }
    case UPLOAD_FAILURE:
      return {
        failures: action.payload.files,
        uploaded: false,
        uploading: false,
      }
    case UPLOAD_DATA_SUCCESS:
      state.failures = []
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
        uploaded: true,
        uploading: false,
      }
    case REMOVE:
      for (const [key, value] of Object.entries(state.data)) {
        if (key !== action.payload) {
          posts[key] = value
        }
      }
      state.data = posts
      return {
        ...state,
        data: {
          ...state.data,
        }
      }
    default:
      return state
  }
}

export const searchPosts = (
  queryPlateId: string,
  queryDay: string,
  queryHostStrain: string,
  queryParasiteStrain: string,
  queryPlateSide: string,
) =>
  async (dispatch: Dispatch, getState: () => IState, { db, storage }: IServices) => {
    dispatch(fetchStart())
    try {
      let cref = await db.collection('posts');
      let query;
      let orderByBarcode = true;
      let orderByDay = true;
      let orderByPlateSide = true;
      if (queryPlateId.trim().length > 0) {
        query = cref.where("barcode", "==", queryPlateId);
        orderByBarcode = false;
      }
      if (queryHostStrain.trim().length > 0) {
        if (query) {
          query = query.where("hostStrain", "==", queryHostStrain);
        } else {
          query = cref.where("hostStrain", "==", queryHostStrain);
        }
      }
      if (queryParasiteStrain.trim().length > 0) {
        if (query) {
          query = query.where("parasiteStrain", "==", queryParasiteStrain);
        } else {
          query = cref.where("parasiteStrain", "==", queryParasiteStrain);
        }
      }
      if (queryDay.trim().length > 0) {
        orderByDay = false;
        if (query) {
          query = query.where("qrcode", "==", Number(queryDay));
        } else {
          query = cref.where("qrcode", "==", Number(queryDay));
        }
      }
      if (queryPlateSide.trim().length > 0) {
        orderByPlateSide = false;
        if (query) {
          query = query.where("plateSide", "==", queryPlateSide);
        } else {
          query = cref.where("plateSide", "==", queryPlateSide);
        }
      }
      if (query) {
        if (orderByBarcode) {
          query = query.orderBy("barcode");
        }
        if (orderByDay) {
          query = query.orderBy("qrcode");
        }
        if (orderByPlateSide) {
          query = query.orderBy("plateSide", "desc");
        }
        const snaps = await query.get()
        const posts: any = {}
        snaps.forEach(x => posts[x.id] = x.data())

        const imgIds = await Promise.all(Object.keys(posts).map(async x => {
          const ref = storage.ref(`posts/${x}.jpg`)
          const url = await ref.getDownloadURL()
          return [x, url]
        }))

        const keyedImages: any = {}
        imgIds.forEach(x => keyedImages[x[0]] = x[1])

        Object.keys(posts).forEach(x => posts[x] = {
          ...posts[x],
          imageURL: keyedImages[x],
        })
        dispatch(fetchSuccess(posts))
      }
    } catch (e) {
      dispatch(fetchError(e))
    }
  }
export const fetchPosts = () =>
  async (dispatch: Dispatch, getState: () => IState, { db, storage }: IServices) => {
    dispatch(fetchStart())
    try {
      const snaps = await db.collection('posts').orderBy("createdAt").limitToLast(100).get()
      const posts: any = {}
      snaps.forEach(x => posts[x.id] = x.data())

      const imgIds = await Promise.all(Object.keys(posts).map(async x => {
        const ref = storage.ref(`posts/${x}.jpg`)
        const url = await ref.getDownloadURL()
        return [x, url]
      }))

      const keyedImages: any = {}
      imgIds.forEach(x => keyedImages[x[0]] = x[1])

      Object.keys(posts).forEach(x => posts[x] = {
        ...posts[x],
        imageURL: keyedImages[x],
      })

      dispatch(fetchSuccess(posts))
    } catch (e) {
      dispatch(fetchError(e))
    }
  }

export const like = (id: string) =>
  async (dispatch: Dispatch, getState: () => IState, { auth }: IServices) => {
    if (!auth.currentUser) {
      return
    }
    const token = await auth.currentUser.getIdToken()
    await fetch(POST_URL + `/api/posts/${id}/like`, {
      headers: {
        authorization: token
      }
    })
  }

export const deleteImage = (id: string) =>
  async (dispatch: Dispatch, getState: () => IState, { auth, db, storage }: IServices) => {
    if (!auth.currentUser) {
      return
    }
    const token = await auth.currentUser.getIdToken()
    const result = await fetch(POST_URL + `/api/posts/${id}/delete`, {
      headers: {
        authorization: token
      }
    })
    const { id: postId }: { id: string } = await result.json()

    //Delete image
    await storage.ref(`posts/${id}.jpg`).delete()
    dispatch(remove(id))
  }

export const uploadPost = (payload: IUploadPost) =>
  async (dispatch: Dispatch, getState: () => IState, { auth, storage, db }: IServices) => {
    if (!auth.currentUser || !payload.files) {
      return
    }
    const failures: string[] = []
    dispatch(uploadStart())
    const token = await auth.currentUser.getIdToken()
    for (let i = 0; i < payload.files.length; i++) {
      const filename: string = payload.files[i].name
      const filepieces = filename.split("__")
      if (filepieces.length != 2) {
        failures.push(filename);
        continue;
      }
      const barcode = filepieces[0].substr(0, filepieces[0].length - 1)
      const plateSide = filepieces[0].substr(filepieces[0].length - 1, filepieces[0].length)
      const qrcode = filepieces[1].split(".")[0]
      if (barcode.length == 5 && plateSide.length == 1 && qrcode.length > 0) {
        const result = await fetch(POST_URL + `/api/posts/upload`, {
          body: JSON.stringify(
            {
              barcode,
              plateSide,
              qrcode
            }),
          headers: {
            authorization: token
          },
          method: 'POST'
        })

        const { id: postId }: { id: string } = await result.json()
        const storageRef = storage.ref()
        const response = await storageRef
          .child(`posts`)
          .child(`${postId}.jpg`)
          .put(payload.files[i])
        const imageURL = await response.ref.getDownloadURL()
        const snap = await db.collection('posts').doc(postId).get()
        dispatch(uploadSuccess({
          [snap.id]: {
            ...snap.data(),
            imageURL,
          }
        } as unknown as IDataPosts))
      } else {
        failures.push(filename);
      }
    }
    if (failures.length > 0) {
      dispatch(uploadFailure({
        files: failures
      } as IUploadFailure))
    }
  }

export const uploadData = (payload: IUploadData) =>
  async (dispatch: Dispatch, getState: () => IState, { auth, storage, db }: IServices) => {
    if (!auth.currentUser || !payload.file) {
      return
    }
    const failures: string[] = []
    dispatch(uploadStart())
    const token = await auth.currentUser.getIdToken()

    const filename: string = payload.file.name

    const formData = new FormData();
    formData.append('file0', payload.file)
    const result = await fetch(POST_URL + `/api/posts/upload-data`, {
      body: formData,
      headers: {
        authorization: token,
        "Content-Type": "multipart/form-data"
      },
      method: 'POST'
    })
    const posts: { id: string }[] = await result.json()
    for (let postId of posts) {
      const storageRef = storage.ref()
      const imageURL = await storageRef
        .child(`posts`)
        .child(`${postId.id}.jpg`)
        .getDownloadURL()
      const snap = await db.collection('posts').doc(postId.id).get()
      dispatch(uploadDataSuccess({
        [snap.id]: {
          ...snap.data(),
          imageURL
        }
      } as unknown as IDataPosts))
    }

    //failures.push(filename);
    if (failures.length > 0) {
      dispatch(uploadFailure({
        files: failures
      } as IUploadFailure))
    }
  }