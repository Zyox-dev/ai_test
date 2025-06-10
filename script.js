import { supabase } from './supabase.js'
import { getSession, logout } from './auth.js'

const API_KEY = 'AIzaSyBTo9FBL2oWDSBjRPH1Kohvi7cCoKW296I'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/...:generateContent?key=${API_KEY}`

let currentChatId = null

// Init
window.onload = async () => {
  const session = await getSession()
  if (!session) return window.location = 'login.html'
  loadChats()
}

// Load Sidebar Chats
async function loadChats() {
  const session = await getSession()
  const { data } = await supabase
    .from('chats').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })

  const list = document.getElementById('chat-list')
  list.innerHTML = ''
  data.forEach(chat => {
    const li = document.createElement('li')
    li.textContent = chat.title || 'New Chat'
    li.onclick = () => selectChat(chat.id)
    if (chat.id === currentChatId) li.classList.add('active')
    list.appendChild(li)
  })
}

// Select or Create Chat
async function selectChat(id) {
  currentChatId = id
  loadMessages()
  loadChats()
}

document.getElementById('new-chat-btn').onclick = async () => {
  const session = await getSession()
  const { data } = await supabase
    .from('chats').insert({ user_id: session.user.id, title: '' }).select().single()
  selectChat(data.id)
}

// Load Messages
async function loadMessages() {
  const { data } = await supabase
    .from('messages').select('*').eq('chat_id', currentChatId).order('created_at', { ascending: true })

  const chatBox = document.getElementById('chat-box')
  chatBox.innerHTML = ''
  data.forEach(msg => appendMessage(msg.role === 'user' ? '👾' : '🧠', msg.content))
}

// Send Chat Message
async function sendMessage() {
  const input = document.getElementById('user-input')
  const text = input.value.trim(); if (!text || !currentChatId) return
  appendMessage('👾', text)
  await supabase.from('messages').insert({ chat_id: currentChatId, role: 'user', content: text })

  const reply = await getBotReply(text)
  appendMessage('🧠', reply)
  await supabase.from('messages').insert({ chat_id: currentChatId, role: 'bot', content: reply })

  input.value = ''
}

// Append message UI
function appendMessage(avatar, text) {
  const div = document.createElement('div'); div.className = 'chat-message'
  div.innerHTML = `<div class="avatar">${avatar}</div><div class="text">${text}</div>`
  document.getElementById('chat-box').appendChild(div)
  document.getElementById('chat-box').scrollTop = 1e9
}

// Call Gemini API
async function getBotReply(userInput) {
  const body = { contents: [{ role: 'user', parts: [{ text: userInput }] }] }
  const res = await fetch(API_URL, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })
  const json = await res.json().catch(() => null)
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || '❌ Error'
}
