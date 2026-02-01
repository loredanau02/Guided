import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, Highlighter,
} from 'lucide-react'
import clsx from 'clsx'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), title: 'Heading 1' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Quote' },
    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight'), title: 'Highlight' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false, title: 'Undo' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false, title: 'Redo' },
  ]

  return (
    <div className="border border-cream-200 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-cream-200 bg-cream-50">
        {tools.map(({ icon: Icon, action, active, title }) => (
          <button
            key={title}
            type="button"
            onClick={action}
            title={title}
            className={clsx(
              'p-1.5 rounded hover:bg-cream-200 transition-colors',
              active && 'bg-sage-100 text-sage-700'
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  )
}