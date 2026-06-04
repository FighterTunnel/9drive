import type { Response } from 'express'
import type { ConnectedAccount, File } from '@prisma/client'
import { getAuthedGoogleClient } from '../google/google.service.js'

type FileWithAccount = File & { connectedAccount: ConnectedAccount }

export async function streamGoogleFile(file: FileWithAccount, range: string | undefined, res: Response) {
  const auth = await getAuthedGoogleClient(file.connectedAccount)
  const headers = await auth.getRequestHeaders()
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.providerFileId}?alt=media`, {
    headers: {
      ...headers,
      ...(range ? { Range: range } : {}),
    },
  })

  res.status(response.status)
  res.setHeader('Content-Type', file.mimeType)
  res.setHeader('Accept-Ranges', 'bytes')

  const contentLength = response.headers.get('content-length')
  const contentRange = response.headers.get('content-range')
  if (contentLength) res.setHeader('Content-Length', contentLength)
  if (contentRange) res.setHeader('Content-Range', contentRange)

  if (!response.body) {
    res.end()
    return
  }
  const reader = response.body.getReader()
  async function pump(): Promise<void> {
    const { done, value } = await reader.read()
    if (done) {
      res.end()
      return
    }
    res.write(Buffer.from(value))
    return pump()
  }
  return pump()
}
