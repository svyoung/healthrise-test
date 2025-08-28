<template>
    <div>
      <div class="flex gap-2 mb-2">
        <button type="button" @click="toggleBold" :class="buttonClass('bold')"><strong>Bold</strong></button>
        <button type="button" @click="toggleItalic" :class="buttonClass('italic')"><em>Italic</em></button>
        <button type="button" @click="toggleStrike" :class="buttonClass('strike')">Strike</button>
        <button type="button" @click="toggleBulletList" :class="buttonClass('bulletList')">• List</button>
        <button type="button" @click="toggleOrderedList" :class="buttonClass('orderedList')">1. List</button>
      </div>
  
      <editor-content :editor="editor" class="prose border border-gray-300 rounded p-2 w-full h-20 text-left  list-disc list-inside" />
    </div>
  </template>
  
  <script>
  import { EditorContent, useEditor } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  
  export default {
    components: { EditorContent },
    props: {
      modelValue: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const editor = useEditor({
        extensions: [StarterKit],
        content: props.modelValue || '<p></p>',
        onUpdate({ editor }) {
          emit('update:modelValue', editor.getHTML())
        },
      })

      const toggleBold = () => {
        if (!editor?.value) return
        editor.value.chain().focus().toggleBold().run()
      }

      const toggleItalic = () => {
        if (!editor?.value) return
        editor.value.chain().focus().toggleItalic().run()
      }

      const toggleStrike = () => {
        if (!editor?.value) return
        editor.value.chain().focus().toggleStrike().run()
      }

      const toggleBulletList = () => {
        if (!editor?.value) return
        editor.value.chain().focus().toggleBulletList().run()
      }

      const toggleOrderedList = () => {
        if (!editor?.value) return
        editor.value.chain().focus().toggleOrderedList().run()
      }


      const buttonClass = (format) => {
        if (!editor) return 'bg-gray-100 px-2 py-1 rounded hover:bg-gray-200'
        const active = editor.isActive?.(format) ?? false
        return active
            ? 'bg-blue-600 text-white px-2 py-1 rounded'
            : 'bg-gray-100 px-2 py-1 rounded hover:bg-gray-200'
      }
  
      return {
        editor,
        toggleBold,
        toggleItalic,
        toggleStrike,
        toggleBulletList,
        toggleOrderedList,
        buttonClass
      }
    }
  }
  </script>
