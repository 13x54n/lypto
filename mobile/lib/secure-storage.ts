import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync()
  } catch {
    return false
  }
}

export const storage = {
  async setToken(token: string) {
    if (await isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      })
      return
    }
    // Web/dev fallback
    try {
      // @ts-ignore
      globalThis.localStorage?.setItem?.(TOKEN_KEY, token)
    } catch {}
  },
  async getToken() {
    if (await isSecureStoreAvailable()) {
      return await SecureStore.getItemAsync(TOKEN_KEY)
    }
    try {
      // @ts-ignore
      return globalThis.localStorage?.getItem?.(TOKEN_KEY) ?? null
    } catch {
      return null
    }
  },
  async removeToken() {
    if (await isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      return
    }
    try {
      // @ts-ignore
      globalThis.localStorage?.removeItem?.(TOKEN_KEY)
    } catch {}
  },
  async setUser(user: any) {
    if (await isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user), {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      })
      return
    }
    try {
      // @ts-ignore
      globalThis.localStorage?.setItem?.(USER_KEY, JSON.stringify(user))
    } catch {}
  },
  async getUser() {
    if (await isSecureStoreAvailable()) {
      const user = await SecureStore.getItemAsync(USER_KEY)
      return user ? JSON.parse(user) : null
    }
    try {
      // @ts-ignore
      const user = globalThis.localStorage?.getItem?.(USER_KEY)
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },
  async removeUser() {
    if (await isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(USER_KEY)
      return
    }
    try {
      // @ts-ignore
      globalThis.localStorage?.removeItem?.(USER_KEY)
    } catch {}
  },
  async clearAuth() {
    await this.removeToken()
    await this.removeUser()
  },
}


