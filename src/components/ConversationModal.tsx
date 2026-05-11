import * as Dialog from '@radix-ui/react-dialog'
import { MessageCircle, X } from 'lucide-react'

type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ConversationModalProps = {
  trigger: string
  title: string
  sourceUrl?: string
  messages: ConversationMessage[]
}

export default function ConversationModal({
  trigger,
  title,
  sourceUrl,
  messages,
}: ConversationModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="conversation-trigger">
        <MessageCircle
          aria-hidden="true"
          className="conversation-trigger-icon"
          size={15}
          strokeWidth={1.8}
        />
        <span>{trigger}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="conversation-overlay" />
        <Dialog.Content className="conversation-content">
          <header className="conversation-header">
            <div>
              <p className="conversation-kicker">Conversation</p>
              <Dialog.Title className="conversation-title">{title}</Dialog.Title>
            </div>
            <Dialog.Close className="conversation-close" aria-label="Close">
              <X aria-hidden="true" size={18} strokeWidth={1.8} />
            </Dialog.Close>
          </header>

          <div className="conversation-thread">
            {messages.map((message, index) => (
              <section
                className={`conversation-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <p className="conversation-role">
                  {message.role === 'user' ? 'Patrick' : 'Claude'}
                </p>
                <div className="conversation-bubble">
                  {message.content.split('\n\n').map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {sourceUrl && (
            <footer className="conversation-footer">
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                Open original share
              </a>
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
