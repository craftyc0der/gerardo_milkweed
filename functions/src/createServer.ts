import * as express from 'express'
import * as admin from 'firebase-admin'

interface IRequest extends express.Request {
  user: {
    uid: string,
    email: string,
    role: string,
  }
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })
const auth = admin.auth()

export default () => {
  const app = express()

  app.use(async (req: any, res, next) => {
    const token = req.headers.authorization
    try {
      const { uid, email } = await auth.verifyIdToken(token)
      const snap = await db.collection('users').doc(uid).get()
      const user = snap.data()
      Object.assign(req, {
        user: {
          ...user,
          uid,
          email,
        }
      })
      next()
    } catch (e) {
      res.status(403).send("Unauthorized")
    }
  })

  app.get("/posts/:postId/like", async (req: IRequest, res: any) => {
    const { uid } = req.user
    const { postId } = req.params
    const snaps = await db.collection('likes')
      .where('userId', '==', uid)
      .where('postId', '==', postId)
      .limit(1)
      .get()
    const result: { id?: string } = {}
    snaps.forEach(x => Object.assign(result, { ...x.data(), id: x.id }))
    if (result.id) {
      await db.collection('likes').doc(result.id).delete()
    }
    if (!result.id) {
      await db.collection('likes').doc().set({
        userId: uid,
        postId,
        createdAt: new Date(),
      })
    }
    res.sendStatus(204)
  })

  app.get('/posts/:postId/delete', async (req: IRequest, res: any) => {
    const { postId } = req.params
    await db.collection('posts').doc(postId).get()
    await db.collection('posts').doc(postId).delete()
    const snaps = await db.collection('likes')
      .where('postId', '==', postId)
      .get()    
    snaps.forEach(async x => {
      await db.collection('likes').doc(x.id).delete()
    })
    res.send({ id: postId })
  })

  app.post('/posts/upload', async (req: IRequest, res: any) => {
    const { uid } = req.user
    const data = JSON.parse(req.body)
    if (!data.barcode) {
      res.status(422).send({ error: 'Barcode not found' })
    }
    if (!data.qrcode) {
      res.status(422).send({ error: 'Barcode not found' })
    }
    const snaps = await db.collection('posts')
      .where('barcode', '==', data.barcode)
      .where('qrcode', '==', data.qrcode)
      .where('plateSide', '==', data.plateSide)
      .get()
    if (snaps.size > 0) {
      res.send({ id: snaps.docs[0].id })
    } else {
      const result = await db.collection('posts').add({
        barcode: data.barcode,
        qrcode: data.qrcode,
        plateSide: data.plateSide,
        userId: uid,
        createdAt: new Date()
      })

      res.send({ id: result.id })
    }
  })

  return app
}
