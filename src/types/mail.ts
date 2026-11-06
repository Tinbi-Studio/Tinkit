export type MailFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive' | 'trash'

export interface MailParticipant {
  name: string
  email: string
}

export interface MailAttachment {
  id: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'sheet' | 'doc'
}

export interface MailMessage {
  id: string
  folder: MailFolder
  from: MailParticipant
  to: MailParticipant[]
  subject: string
  preview: string
  body: string
  date: string
  read: boolean
  starred: boolean
  labels: string[]
  attachments: MailAttachment[]
}

export interface MailDraft {
  to: string[]
  cc: string[]
  subject: string
  body: string
}
