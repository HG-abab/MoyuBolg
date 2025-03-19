// db.js
import { openDB } from 'idb'

const DB_NAME = 'chatDB'
const STORE_NAME = 'messages'
const DB_VERSION = 1

// 初始化数据库
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
      }
    }
  })
}

// 保存消息到数据库
export async function saveMessage(db, message) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const messageObj = {
      content: message,
      timestamp: new Date().getTime(),
      role: 'user',
    }

    const request = store.add(messageObj)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveAIMessage(db, message) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const messageObj = {
      content: message,
      timestamp: new Date().getTime(),
      role: 'ai',
    }

    const request = store.add(messageObj)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 获取所有消息
export async function getMessages(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const messages = request.result.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
      resolve(messages)
    }
    request.onerror = () => reject(request.error)
  })
}
