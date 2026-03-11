<template>
  <div>
    <div ref="editorContainer" :style="editorStyle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import axios from '@/utils/axios'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter content...'
  },
  height: {
    type: String,
    default: '300px'
  }
})

const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
let quill = null

const editorStyle = {
  minHeight: props.height,
  background: 'var(--surface)',
  borderRadius: '10px',
  border: '1px solid var(--border-white)'
}

// Custom image handler for uploading images
async function imageHandler() {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await axios.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const imageUrl = response.data.url
        const range = quill.getSelection()
        quill.insertEmbed(range.index, 'image', imageUrl)
      } catch (error) {
        console.error('Image upload failed:', error)
        alert('Failed to upload image. Please try again.')
      }
    }
  }
}

onMounted(() => {
  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      }
    }
  })

  // Set initial content
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  // Listen for text changes
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })

  // Apply dark theme styles
  const toolbar = editorContainer.value.querySelector('.ql-toolbar')
  const editor = editorContainer.value.querySelector('.ql-container')
  
  if (toolbar) {
    toolbar.style.background = 'var(--surface2)'
    toolbar.style.borderColor = 'var(--border-white)'
    toolbar.style.borderRadius = '10px 10px 0 0'
  }
  
  if (editor) {
    editor.style.borderColor = 'var(--border-white)'
    editor.style.borderRadius = '0 0 10px 10px'
    editor.style.color = 'var(--text)'
  }
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue
  }
})

onBeforeUnmount(() => {
  if (quill) {
    quill = null
  }
})
</script>

<style>
/* Quill editor dark theme customization */
.ql-toolbar {
  background: var(--surface2) !important;
  border-color: var(--border-white) !important;
}

.ql-container {
  background: var(--surface) !important;
  color: var(--text) !important;
  border-color: var(--border-white) !important;
  font-family: inherit !important;
}

.ql-editor {
  min-height: 250px;
  color: var(--text) !important;
}

.ql-editor.ql-blank::before {
  color: var(--text-muted) !important;
  font-style: normal !important;
}

.ql-snow .ql-stroke {
  stroke: var(--text-muted) !important;
}

.ql-snow .ql-fill {
  fill: var(--text-muted) !important;
}

.ql-snow .ql-picker-label {
  color: var(--text-muted) !important;
}

.ql-snow .ql-picker-options {
  background: var(--surface2) !important;
  border-color: var(--border-white) !important;
}

.ql-snow .ql-picker-item {
  color: var(--text) !important;
}

.ql-snow .ql-picker-item:hover {
  background: var(--surface) !important;
  color: var(--gold) !important;
}

.ql-toolbar button:hover,
.ql-toolbar button.ql-active {
  color: var(--gold) !important;
}

.ql-toolbar button:hover .ql-stroke,
.ql-toolbar button.ql-active .ql-stroke {
  stroke: var(--gold) !important;
}

.ql-toolbar button:hover .ql-fill,
.ql-toolbar button.ql-active .ql-fill {
  fill: var(--gold) !important;
}

.ql-snow a {
  color: var(--gold) !important;
}
</style>
