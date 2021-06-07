import * as functions from 'firebase-functions';
import createServer from './createServer'

const runtimeOpts = {
    timeoutSeconds: 540
}

export const api = functions.runWith(runtimeOpts).https.onRequest(createServer())
