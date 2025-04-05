import { MessageCircleQuestion, Loader2, ExternalLink, RotateCcw } from 'lucide-react'

export function AnswersSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-lg">How to use</h3>
      </div>

      <ul className="space-y-3">
        <li className="flex gap-2">
          <MessageCircleQuestion className="size-4 mt-1" />
          <span>Type your question in the input field</span>
        </li>
        <li className="flex gap-2">
          <Loader2 className="size-4 mt-1" />
          <span>Wait for the AI to generate an answer</span>
        </li>
        <li className="flex gap-2">
          <ExternalLink className="size-4 mt-1" />
          <span>View source citations for more information</span>
        </li>
        <li className="flex gap-2">
          <RotateCcw className="size-4 mt-1" />
          <span>Ask another question</span>
        </li>
      </ul>
    </div>
  )
}
