// src/interfaces/storage.ts
var StorageError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "StorageError";
  }
};

// src/interfaces/network.ts
var NetworkError = class extends Error {
  constructor(message, code, status, response) {
    super(message);
    this.code = code;
    this.status = status;
    this.response = response;
    this.name = "NetworkError";
  }
};

// src/interfaces/audio.ts
var AudioError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "AudioError";
  }
};

// src/interfaces/platform.ts
var PlatformError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "PlatformError";
  }
};

// src/storage/storage-interface.ts
var StorageError2 = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "StorageError";
  }
};

// src/web/local-storage-adapter.ts
function isQuotaExceededError(error) {
  return error instanceof DOMException && (error.code === 22 || error.code === 1014 || error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
}
var LocalStorageAdapter = class {
  constructor(prefix = "") {
    this.prefix = prefix;
  }
  getKey(key) {
    return this.prefix ? `${this.prefix}.${key}` : key;
  }
  get(key) {
    try {
      const value = localStorage.getItem(this.getKey(key));
      if (value === null) return null;
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        throw new StorageError2("localStorage quota exceeded", "QUOTA_EXCEEDED");
      }
      throw error;
    }
  }
  remove(key) {
    localStorage.removeItem(this.getKey(key));
  }
  has(key) {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
  clear() {
    if (this.prefix) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } else {
      localStorage.clear();
    }
  }
  keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        if (this.prefix) {
          if (key.startsWith(this.prefix)) {
            keys.push(key.substring(this.prefix.length + 1));
          }
        } else {
          keys.push(key);
        }
      }
    }
    return keys;
  }
  /**
   * Get approximate localStorage usage in bytes
   */
  getSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += key.length + (localStorage.getItem(key)?.length || 0);
      }
    }
    return total;
  }
  /**
   * Get localStorage usage as a percentage (assumes 5MB limit)
   */
  getUsagePercent() {
    const size = this.getSize();
    const estimatedLimit = 5 * 1024 * 1024;
    return Math.min(100, size / estimatedLimit * 100);
  }
};
function createLocalStorage(prefix) {
  return new LocalStorageAdapter(prefix);
}

// src/web/indexed-db-adapter.ts
var DEFAULT_DB_NAME = "jota-db";
var DEFAULT_VERSION = 1;
var KV_STORE = "keyvalue";
var COLLECTIONS_STORE = "collections";
var IndexedDBAdapter = class {
  constructor(config = {}) {
    this.db = null;
    this.listeners = /* @__PURE__ */ new Set();
    this.initPromise = null;
    this.dbName = config.dbName ?? DEFAULT_DB_NAME;
    this.prefix = config.prefix ?? "";
  }
  async init() {
    if (this.db) return;
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in globalThis)) {
        reject(new StorageError("IndexedDB is not available", "NOT_AVAILABLE"));
        return;
      }
      const request = indexedDB.open(this.dbName, DEFAULT_VERSION);
      request.onerror = () => {
        reject(new StorageError("Failed to open IndexedDB", "UNKNOWN"));
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(KV_STORE)) {
          db.createObjectStore(KV_STORE);
        }
        if (!db.objectStoreNames.contains(COLLECTIONS_STORE)) {
          const store = db.createObjectStore(COLLECTIONS_STORE, {
            keyPath: ["collection", "id"]
          });
          store.createIndex("collection", "collection", { unique: false });
        }
      };
    });
    return this.initPromise;
  }
  getKey(key) {
    return this.prefix ? `${this.prefix}.${key}` : key;
  }
  notifyChange(key, oldValue, newValue) {
    const event = { key, oldValue, newValue };
    this.listeners.forEach((listener) => listener(event));
  }
  // Key-value operations
  async get(key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(KV_STORE, "readonly");
      const store = transaction.objectStore(KV_STORE);
      const request = store.get(this.getKey(key));
      request.onerror = () => reject(new StorageError("Failed to get value", "UNKNOWN"));
      request.onsuccess = () => resolve(request.result ?? null);
    });
  }
  async set(key, value) {
    await this.init();
    const oldValue = await this.get(key);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(KV_STORE, "readwrite");
      const store = transaction.objectStore(KV_STORE);
      const request = store.put(value, this.getKey(key));
      request.onerror = () => {
        const error = request.error;
        if (error?.name === "QuotaExceededError") {
          reject(new StorageError("Storage quota exceeded", "QUOTA_EXCEEDED"));
        } else {
          reject(new StorageError("Failed to set value", "UNKNOWN"));
        }
      };
      request.onsuccess = () => {
        this.notifyChange(key, oldValue, value);
        resolve();
      };
    });
  }
  async delete(key) {
    await this.init();
    const oldValue = await this.get(key);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(KV_STORE, "readwrite");
      const store = transaction.objectStore(KV_STORE);
      const request = store.delete(this.getKey(key));
      request.onerror = () => reject(new StorageError("Failed to delete value", "UNKNOWN"));
      request.onsuccess = () => {
        this.notifyChange(key, oldValue, null);
        resolve();
      };
    });
  }
  async clear() {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([KV_STORE, COLLECTIONS_STORE], "readwrite");
      if (this.prefix) {
        const kvStore = transaction.objectStore(KV_STORE);
        const cursorRequest = kvStore.openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (cursor) {
            const key = cursor.key;
            if (key.startsWith(this.prefix)) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
        const collectionsStore = transaction.objectStore(COLLECTIONS_STORE);
        const collCursorRequest = collectionsStore.openCursor();
        collCursorRequest.onsuccess = () => {
          const cursor = collCursorRequest.result;
          if (cursor) {
            const item = cursor.value;
            if (item.collection.startsWith(this.prefix)) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
      } else {
        transaction.objectStore(KV_STORE).clear();
        transaction.objectStore(COLLECTIONS_STORE).clear();
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new StorageError("Failed to clear storage", "UNKNOWN"));
    });
  }
  async keys() {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(KV_STORE, "readonly");
      const store = transaction.objectStore(KV_STORE);
      const request = store.getAllKeys();
      request.onerror = () => reject(new StorageError("Failed to get keys", "UNKNOWN"));
      request.onsuccess = () => {
        let keys = request.result;
        if (this.prefix) {
          keys = keys.filter((k) => k.startsWith(this.prefix)).map((k) => k.substring(this.prefix.length + 1));
        }
        resolve(keys);
      };
    });
  }
  // Structured storage operations
  async getStructured(collection, id) {
    await this.init();
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(COLLECTIONS_STORE, "readonly");
      const store = transaction.objectStore(COLLECTIONS_STORE);
      const request = store.get([collectionKey, id]);
      request.onerror = () => reject(new StorageError("Failed to get structured value", "UNKNOWN"));
      request.onsuccess = () => {
        const item = request.result;
        resolve(item?.value ?? null);
      };
    });
  }
  async setStructured(collection, id, value) {
    await this.init();
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(COLLECTIONS_STORE, "readwrite");
      const store = transaction.objectStore(COLLECTIONS_STORE);
      const item = { collection: collectionKey, id, value };
      const request = store.put(item);
      request.onerror = () => {
        const error = request.error;
        if (error?.name === "QuotaExceededError") {
          reject(new StorageError("Storage quota exceeded", "QUOTA_EXCEEDED"));
        } else {
          reject(new StorageError("Failed to set structured value", "UNKNOWN"));
        }
      };
      request.onsuccess = () => resolve();
    });
  }
  async deleteStructured(collection, id) {
    await this.init();
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(COLLECTIONS_STORE, "readwrite");
      const store = transaction.objectStore(COLLECTIONS_STORE);
      if (id !== void 0) {
        const request = store.delete([collectionKey, id]);
        request.onerror = () => reject(new StorageError("Failed to delete structured value", "UNKNOWN"));
        request.onsuccess = () => resolve();
      } else {
        const index = store.index("collection");
        const request = index.openCursor(IDBKeyRange.only(collectionKey));
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(new StorageError("Failed to delete collection", "UNKNOWN"));
      }
    });
  }
  async listStructured(collection) {
    await this.init();
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(COLLECTIONS_STORE, "readonly");
      const store = transaction.objectStore(COLLECTIONS_STORE);
      const index = store.index("collection");
      const request = index.getAllKeys(IDBKeyRange.only(collectionKey));
      request.onerror = () => reject(new StorageError("Failed to list structured items", "UNKNOWN"));
      request.onsuccess = () => {
        const ids = request.result.map(([, id]) => id);
        resolve(ids);
      };
    });
  }
  // Batch operations
  async getBatch(keys) {
    await this.init();
    const results = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.get(key);
      })
    );
    return results;
  }
  async setBatch(data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(KV_STORE, "readwrite");
      const store = transaction.objectStore(KV_STORE);
      for (const [key, value] of Object.entries(data)) {
        store.put(value, this.getKey(key));
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        const error = transaction.error;
        if (error?.name === "QuotaExceededError") {
          reject(new StorageError("Storage quota exceeded", "QUOTA_EXCEEDED"));
        } else {
          reject(new StorageError("Failed to set batch values", "UNKNOWN"));
        }
      };
    });
  }
  // Events
  onChanged(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  // Cleanup
  async close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
  /**
   * Get storage usage estimate (if supported)
   */
  async getStorageEstimate() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage ?? 0,
        quota: estimate.quota ?? 0
      };
    }
    return null;
  }
};
function createIndexedDBStorage(config) {
  return new IndexedDBAdapter(config);
}

// src/web/web-network-adapter.ts
var DEFAULT_TIMEOUT = 3e4;
var DEFAULT_CACHE_TTL = 36e5;
var WebNetworkAdapter = class {
  constructor(config = {}) {
    this.cache = /* @__PURE__ */ new Map();
    this.onlineListeners = /* @__PURE__ */ new Set();
    this.config = {
      timeout: DEFAULT_TIMEOUT,
      ...config
    };
    this.boundOnlineHandler = () => this.notifyConnectionChange(true);
    this.boundOfflineHandler = () => this.notifyConnectionChange(false);
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.boundOnlineHandler);
      window.addEventListener("offline", this.boundOfflineHandler);
    }
  }
  notifyConnectionChange(online) {
    this.onlineListeners.forEach((listener) => listener(online));
  }
  buildUrl(url) {
    if (this.config.baseUrl && !url.startsWith("http")) {
      return `${this.config.baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return url;
  }
  buildHeaders(options) {
    return {
      ...this.config.headers,
      ...options?.headers
    };
  }
  parseResponseHeaders(headers) {
    const result = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  async request(method, url, body, options) {
    const fullUrl = this.buildUrl(url);
    const timeout = options?.timeout ?? this.config.timeout ?? DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const fetchOptions = {
        method,
        headers: this.buildHeaders(options),
        signal: options?.signal ?? controller.signal,
        credentials: options?.credentials
      };
      if (body !== void 0 && method !== "GET" && method !== "HEAD") {
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers = {
          "Content-Type": "application/json",
          ...fetchOptions.headers
        };
      }
      const response = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);
      let data;
      const responseType = options?.responseType ?? "json";
      switch (responseType) {
        case "text":
          data = await response.text();
          break;
        case "blob":
          data = await response.blob();
          break;
        case "arraybuffer":
          data = await response.arrayBuffer();
          break;
        case "json":
        default:
          data = await response.json();
          break;
      }
      return {
        data,
        status: response.status,
        headers: this.parseResponseHeaders(response.headers),
        ok: response.ok
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          if (!navigator.onLine) {
            throw new NetworkError("No internet connection", "OFFLINE");
          }
          throw new NetworkError("Request timeout", "TIMEOUT");
        }
        throw new NetworkError(error.message, "NETWORK_ERROR");
      }
      throw new NetworkError("Unknown network error", "UNKNOWN");
    }
  }
  // HTTP methods
  async get(url, options) {
    return this.request("GET", url, void 0, options);
  }
  async post(url, data, options) {
    return this.request("POST", url, data, options);
  }
  async put(url, data, options) {
    return this.request("PUT", url, data, options);
  }
  async patch(url, data, options) {
    return this.request("PATCH", url, data, options);
  }
  async delete(url, options) {
    return this.request("DELETE", url, void 0, options);
  }
  // File downloads
  async downloadFile(url, onProgress) {
    const fullUrl = this.buildUrl(url);
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new NetworkError(`Download failed: ${response.status}`, "SERVER_ERROR", response.status);
    }
    if (!response.body) {
      return response.blob();
    }
    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : null;
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onProgress) {
        onProgress({
          loaded,
          total,
          percent: total ? Math.round(loaded / total * 100) : 0
        });
      }
    }
    const blob = new Blob(chunks);
    return blob;
  }
  async downloadJson(url, onProgress) {
    const blob = await this.downloadFile(url, onProgress);
    const text = await blob.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new NetworkError("Failed to parse JSON", "PARSE_ERROR");
    }
  }
  // Caching
  async getCached(url, maxAge) {
    const cacheKey = this.buildUrl(url);
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;
    const age = Date.now() - cached.cachedAt;
    const effectiveMaxAge = maxAge ?? cached.ttl;
    if (age > effectiveMaxAge) {
      this.cache.delete(cacheKey);
      return null;
    }
    return cached.data;
  }
  async setCached(url, data, ttl) {
    const cacheKey = this.buildUrl(url);
    this.cache.set(cacheKey, {
      data,
      cachedAt: Date.now(),
      ttl: ttl ?? DEFAULT_CACHE_TTL
    });
  }
  async invalidateCache(url) {
    const cacheKey = this.buildUrl(url);
    this.cache.delete(cacheKey);
  }
  async clearCache() {
    this.cache.clear();
  }
  // Connection status
  async isOnline() {
    return navigator.onLine;
  }
  onConnectionChange(callback) {
    this.onlineListeners.add(callback);
    return () => {
      this.onlineListeners.delete(callback);
    };
  }
  // Cleanup
  dispose() {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.boundOnlineHandler);
      window.removeEventListener("offline", this.boundOfflineHandler);
    }
    this.onlineListeners.clear();
    this.cache.clear();
  }
};
function createWebNetwork(config) {
  return new WebNetworkAdapter(config);
}

// src/web/web-audio-adapter.ts
var handleIdCounter = 0;
function generateHandleId() {
  return `audio_${++handleIdCounter}_${Date.now()}`;
}
var WebAudioAdapter = class {
  constructor(config = {}) {
    this.instances = /* @__PURE__ */ new Map();
    this.preloadedAudio = /* @__PURE__ */ new Map();
    this.config = {
      defaultVolume: 1,
      defaultPlaybackRate: 1,
      ...config
    };
  }
  createAudioElement(url, options) {
    const preloaded = this.preloadedAudio.get(url);
    if (preloaded) {
      this.preloadedAudio.delete(url);
      return preloaded;
    }
    const audio = new Audio();
    audio.src = url;
    audio.preload = options?.preload ?? "auto";
    return audio;
  }
  getState(audio) {
    if (audio.error) return "error";
    if (audio.ended) return "ended";
    if (audio.paused && audio.currentTime === 0 && audio.readyState < 2) return "loading";
    if (audio.paused) return "paused";
    if (!audio.paused) return "playing";
    return "idle";
  }
  notifyListeners(instance, eventType) {
    const audio = instance.element;
    const event = {
      type: eventType,
      handle: {
        ...instance.handle,
        state: this.getState(audio)
      },
      currentTime: audio.currentTime,
      duration: isNaN(audio.duration) ? void 0 : audio.duration
    };
    if (eventType === "error" && audio.error) {
      event.error = audio.error.message;
    }
    instance.listeners.forEach((callback) => callback(event));
  }
  setupEventListeners(instance) {
    const audio = instance.element;
    const events = [
      "play",
      "pause",
      "ended",
      "error",
      "loadedmetadata",
      "timeupdate"
    ];
    events.forEach((eventName) => {
      audio.addEventListener(eventName, () => {
        instance.handle.state = this.getState(audio);
        let eventType;
        switch (eventName) {
          case "play":
          case "pause":
            eventType = "statechange";
            break;
          case "ended":
            eventType = "ended";
            break;
          case "error":
            eventType = "error";
            break;
          case "loadedmetadata":
            eventType = "loaded";
            break;
          case "timeupdate":
            eventType = "timeupdate";
            break;
          default:
            return;
        }
        this.notifyListeners(instance, eventType);
      });
    });
  }
  // Playback control
  async play(url, options) {
    const audio = this.createAudioElement(url, options);
    const handleId = generateHandleId();
    const handle = {
      id: handleId,
      url,
      state: "loading"
    };
    const instance = {
      handle,
      element: audio,
      listeners: /* @__PURE__ */ new Set(),
      isMuted: false,
      previousVolume: options?.volume ?? this.config.defaultVolume ?? 1
    };
    this.instances.set(handleId, instance);
    this.setupEventListeners(instance);
    audio.volume = options?.volume ?? this.config.defaultVolume ?? 1;
    audio.playbackRate = options?.playbackRate ?? this.config.defaultPlaybackRate ?? 1;
    audio.loop = options?.loop ?? false;
    if (options?.startTime) {
      audio.currentTime = options.startTime;
    }
    try {
      await audio.play();
      handle.state = "playing";
      return handle;
    } catch (error) {
      handle.state = "error";
      if (error instanceof Error && error.name === "NotAllowedError") {
        throw new AudioError(
          "Playback not allowed. User interaction required.",
          "PERMISSION_DENIED"
        );
      }
      throw new AudioError("Failed to play audio", "UNKNOWN");
    }
  }
  async pause(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.element.pause();
    instance.handle.state = "paused";
  }
  async resume(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    try {
      await instance.element.play();
      instance.handle.state = "playing";
    } catch (error) {
      throw new AudioError("Failed to resume playback", "UNKNOWN");
    }
  }
  async stop(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.element.pause();
    instance.element.currentTime = 0;
    instance.element.src = "";
    instance.listeners.clear();
    instance.handle.state = "idle";
    this.instances.delete(handle.id);
  }
  // Seek and position
  async getCurrentTime(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return 0;
    return instance.element.currentTime;
  }
  async setCurrentTime(handle, time) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.element.currentTime = time;
  }
  async getDuration(handle) {
    if (typeof handle === "string") {
      const metadata = await this.getMetadata(handle);
      return metadata.duration;
    }
    const instance = this.instances.get(handle.id);
    if (!instance) return 0;
    const duration = instance.element.duration;
    return isNaN(duration) ? 0 : duration;
  }
  // Volume control
  async getVolume(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return 0;
    return instance.element.volume;
  }
  async setVolume(handle, volume) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    instance.element.volume = clampedVolume;
    instance.previousVolume = clampedVolume;
    instance.isMuted = false;
  }
  async mute(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    if (!instance.isMuted) {
      instance.previousVolume = instance.element.volume;
      instance.element.volume = 0;
      instance.isMuted = true;
    }
  }
  async unmute(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    if (instance.isMuted) {
      instance.element.volume = instance.previousVolume;
      instance.isMuted = false;
    }
  }
  // Playback rate
  async getPlaybackRate(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return 1;
    return instance.element.playbackRate;
  }
  async setPlaybackRate(handle, rate) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    const clampedRate = Math.max(0.25, Math.min(4, rate));
    instance.element.playbackRate = clampedRate;
  }
  // Metadata
  async getMetadata(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = url;
      const cleanup = () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("error", onError);
      };
      const onLoaded = () => {
        cleanup();
        resolve({
          duration: audio.duration
        });
      };
      const onError = () => {
        cleanup();
        reject(new AudioError("Failed to load audio metadata", "NETWORK_ERROR"));
      };
      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("error", onError);
    });
  }
  // Preloading
  async preload(url) {
    if (this.preloadedAudio.has(url)) return;
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.removeEventListener("error", onError);
      };
      const onCanPlay = () => {
        cleanup();
        this.preloadedAudio.set(url, audio);
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new AudioError("Failed to preload audio", "NETWORK_ERROR"));
      };
      audio.addEventListener("canplaythrough", onCanPlay);
      audio.addEventListener("error", onError);
    });
  }
  async cancelPreload(url) {
    const audio = this.preloadedAudio.get(url);
    if (audio) {
      audio.src = "";
      this.preloadedAudio.delete(url);
    }
  }
  // Events
  onPlaybackChange(handle, callback) {
    const instance = this.instances.get(handle.id);
    if (!instance) {
      return () => {
      };
    }
    instance.listeners.add(callback);
    return () => {
      instance.listeners.delete(callback);
    };
  }
  // Cleanup
  async dispose() {
    for (const [, instance] of this.instances) {
      instance.element.pause();
      instance.element.src = "";
      instance.listeners.clear();
    }
    this.instances.clear();
    for (const [, audio] of this.preloadedAudio) {
      audio.src = "";
    }
    this.preloadedAudio.clear();
  }
};
function createWebAudio(config) {
  return new WebAudioAdapter(config);
}

// src/web/web-platform-adapter.ts
function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";
  if (ua.includes("iphone") || ua.includes("ipad")) return "ios";
  if (ua.includes("android")) return "android";
  return "unknown";
}
function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mobile")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  return "desktop";
}
function wrapFile(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    text: () => file.text(),
    arrayBuffer: () => file.arrayBuffer()
  };
}
var WebPlatformAdapter = class {
  constructor() {
    this.colorSchemeMediaQuery = null;
    this.colorSchemeListeners = /* @__PURE__ */ new Set();
    this.notificationClickListeners = /* @__PURE__ */ new Set();
    if (typeof window !== "undefined" && window.matchMedia) {
      this.colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    }
  }
  // Platform detection
  getPlatform() {
    return "web";
  }
  getPlatformInfo() {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    return {
      platform: "web",
      version: navigator.userAgent,
      userAgent: navigator.userAgent,
      os: detectOS(),
      deviceType: detectDeviceType(),
      isTouch,
      isStandalone
    };
  }
  getVersion() {
    return navigator.userAgent;
  }
  getCapabilities() {
    return {
      fileSystem: false,
      // Web doesn't have direct file system access
      notifications: "Notification" in window,
      clipboard: "clipboard" in navigator,
      share: "share" in navigator,
      filePicker: "showOpenFilePicker" in window || true,
      // Fallback with input element
      windowManagement: false,
      // Web can't manage windows
      deepLinking: true,
      // URLs work as deep links
      persistentStorage: "storage" in navigator && "persist" in navigator.storage
    };
  }
  // Clipboard
  async copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
      }
    }
    this.copyTextLegacy(text);
  }
  copyTextLegacy(text) {
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
  async readFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return null;
      }
    }
    return null;
  }
  // File picker
  async selectFile(options) {
    const files = await this.selectFilesInternal(options, false);
    return files.length > 0 ? files[0] : null;
  }
  async selectFiles(options) {
    return this.selectFilesInternal(options, true);
  }
  async selectFilesInternal(options, multiple = false) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = multiple || (options?.multiple ?? false);
      if (options?.accept) {
        input.accept = options.accept.join(",");
      }
      input.onchange = () => {
        const files = Array.from(input.files ?? []).map(wrapFile);
        resolve(files);
      };
      input.oncancel = () => resolve([]);
      input.click();
    });
  }
  async selectFolder() {
    throw new PlatformError(
      "Folder selection is not supported in web browsers",
      "NOT_SUPPORTED"
    );
  }
  // Share
  canShare() {
    return "share" in navigator;
  }
  async share(data) {
    if (!navigator.share) {
      throw new PlatformError("Web Share API not supported", "NOT_SUPPORTED");
    }
    try {
      await navigator.share(data);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      throw new PlatformError("Share failed", "UNKNOWN");
    }
  }
  // Notifications
  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      throw new PlatformError("Notifications not supported", "NOT_SUPPORTED");
    }
    const result = await Notification.requestPermission();
    return result;
  }
  async showNotification(title, options) {
    if (!("Notification" in window)) {
      throw new PlatformError("Notifications not supported", "NOT_SUPPORTED");
    }
    if (Notification.permission !== "granted") {
      throw new PlatformError("Notification permission denied", "PERMISSION_DENIED");
    }
    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon,
      badge: options?.badge,
      tag: options?.tag,
      requireInteraction: options?.requireInteraction,
      data: options?.data
    });
    notification.onclick = () => {
      const event = {
        tag: options?.tag,
        data: options?.data
      };
      this.notificationClickListeners.forEach((callback) => callback(event));
    };
    if (options?.timeout) {
      setTimeout(() => notification.close(), options.timeout);
    }
  }
  onNotificationClick(callback) {
    this.notificationClickListeners.add(callback);
    return () => {
      this.notificationClickListeners.delete(callback);
    };
  }
  // Window management (limited in web)
  async setWindowTitle(title) {
    document.title = title;
  }
  async toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }
  async isFullscreen() {
    return document.fullscreenElement !== null;
  }
  // System
  async openExternalUrl(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  getLocale() {
    return navigator.language || "en-US";
  }
  getColorScheme() {
    if (!this.colorSchemeMediaQuery) return "system";
    return this.colorSchemeMediaQuery.matches ? "dark" : "light";
  }
  onColorSchemeChange(callback) {
    if (!this.colorSchemeMediaQuery) {
      return () => {
      };
    }
    const handler = (e) => {
      callback(e.matches ? "dark" : "light");
    };
    this.colorSchemeMediaQuery.addEventListener("change", handler);
    this.colorSchemeListeners.add(callback);
    return () => {
      this.colorSchemeMediaQuery?.removeEventListener("change", handler);
      this.colorSchemeListeners.delete(callback);
    };
  }
  // Deep linking (handled by URL/router in web)
  registerDeepLinkHandler(callback) {
    const handler = () => {
      callback(window.location.href);
    };
    window.addEventListener("popstate", handler);
    return () => {
      window.removeEventListener("popstate", handler);
    };
  }
};
function createWebPlatform() {
  return new WebPlatformAdapter();
}

// src/web/clipboard-adapter.ts
async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
    }
  }
  copyTextLegacy(text);
}
function copyTextLegacy(text) {
  const textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}
async function readFromClipboard() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }
  return null;
}

// src/web/keyboard-adapter.ts
function parseKeyBinding(binding) {
  const parts = binding.split("+");
  const key = parts[parts.length - 1];
  return {
    key,
    shift: parts.includes("Shift"),
    alt: parts.includes("Alt"),
    ctrl: parts.includes("Ctrl"),
    meta: parts.includes("Meta") || parts.includes("Cmd")
  };
}
function bindKeyEvent(binding, callback) {
  const config = parseKeyBinding(binding);
  return (event) => {
    const ctrlOrMeta = config.ctrl ? event.ctrlKey || event.metaKey : true;
    if (event.key === config.key && event.shiftKey === (config.shift ?? false) && event.altKey === (config.alt ?? false) && ctrlOrMeta) {
      callback(event);
    }
  };
}
function focusInput(ref) {
  if (ref) {
    const inputElement = ref.querySelector("input");
    inputElement?.focus();
  }
}

// src/web/http-adapter.ts
async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = options.timeout ?? 3e4;
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        ...options.headers
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    return {
      data,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
async function loadTranslation(baseUrl, locale, symbol) {
  const url = `${baseUrl}/${locale}/${symbol}.json`;
  const response = await fetchJson(url);
  if (!response.ok) {
    throw new Error(`Failed to load translation: ${response.status}`);
  }
  return response.data;
}
function isOnline() {
  return navigator.onLine;
}
function onConnectivityChange(onOnline, onOffline) {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}

// src/memory/memory-storage-adapter.ts
var MemoryStorageAdapter = class {
  constructor(config = {}) {
    this.storage = /* @__PURE__ */ new Map();
    this.collections = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.prefix = config.prefix ?? "";
  }
  getKey(key) {
    return this.prefix ? `${this.prefix}.${key}` : key;
  }
  getCollectionKey(collection) {
    return this.prefix ? `${this.prefix}.${collection}` : collection;
  }
  notifyChange(key, oldValue, newValue) {
    const event = { key, oldValue, newValue };
    this.listeners.forEach((listener) => listener(event));
  }
  // Key-value operations
  async get(key) {
    const value = this.storage.get(this.getKey(key));
    return value ?? null;
  }
  async set(key, value) {
    const fullKey = this.getKey(key);
    const oldValue = this.storage.get(fullKey) ?? null;
    this.storage.set(fullKey, value);
    this.notifyChange(key, oldValue, value);
  }
  async delete(key) {
    const fullKey = this.getKey(key);
    const oldValue = this.storage.get(fullKey) ?? null;
    this.storage.delete(fullKey);
    this.notifyChange(key, oldValue, null);
  }
  async clear() {
    if (this.prefix) {
      for (const key of this.storage.keys()) {
        if (key.startsWith(this.prefix)) {
          this.storage.delete(key);
        }
      }
      for (const key of this.collections.keys()) {
        if (key.startsWith(this.prefix)) {
          this.collections.delete(key);
        }
      }
    } else {
      this.storage.clear();
      this.collections.clear();
    }
  }
  async keys() {
    const keys = [];
    for (const key of this.storage.keys()) {
      if (this.prefix) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length + 1));
        }
      } else {
        keys.push(key);
      }
    }
    return keys;
  }
  // Structured storage operations
  async getStructured(collection, id) {
    const collKey = this.getCollectionKey(collection);
    const coll = this.collections.get(collKey);
    if (!coll) return null;
    return coll[id] ?? null;
  }
  async setStructured(collection, id, value) {
    const collKey = this.getCollectionKey(collection);
    let coll = this.collections.get(collKey);
    if (!coll) {
      coll = {};
      this.collections.set(collKey, coll);
    }
    coll[id] = value;
  }
  async deleteStructured(collection, id) {
    const collKey = this.getCollectionKey(collection);
    if (id !== void 0) {
      const coll = this.collections.get(collKey);
      if (coll) {
        delete coll[id];
      }
    } else {
      this.collections.delete(collKey);
    }
  }
  async listStructured(collection) {
    const collKey = this.getCollectionKey(collection);
    const coll = this.collections.get(collKey);
    if (!coll) return [];
    return Object.keys(coll);
  }
  // Batch operations
  async getBatch(keys) {
    const result = {};
    for (const key of keys) {
      result[key] = await this.get(key);
    }
    return result;
  }
  async setBatch(data) {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value);
    }
  }
  // Events
  onChanged(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  // Utility methods
  /**
   * Get approximate size of stored data in bytes
   */
  size() {
    let total = 0;
    for (const [key, value] of this.storage) {
      total += key.length + JSON.stringify(value).length;
    }
    for (const [key, coll] of this.collections) {
      total += key.length + JSON.stringify(coll).length;
    }
    return total;
  }
  /**
   * Dump all data for debugging
   */
  dump() {
    return {
      storage: Object.fromEntries(this.storage),
      collections: Object.fromEntries(this.collections)
    };
  }
};
function createMemoryStorage(config) {
  return new MemoryStorageAdapter(config);
}

// src/memory/mock-network-adapter.ts
var MockNetworkAdapter = class {
  constructor(options = {}) {
    this.routes = [];
    this.cache = /* @__PURE__ */ new Map();
    this.isOnlineState = true;
    this.connectionListeners = /* @__PURE__ */ new Set();
    this.defaultDelay = 0;
    this.defaultDelay = options.delay ?? 0;
  }
  /**
   * Register a mock route
   */
  mock(method, pattern, handler, delay) {
    this.routes.push({
      method,
      pattern,
      handler,
      delay: delay ?? this.defaultDelay
    });
    return this;
  }
  /**
   * Shorthand for GET routes
   */
  onGet(pattern, handler, delay) {
    return this.mock("GET", pattern, handler, delay);
  }
  /**
   * Shorthand for POST routes
   */
  onPost(pattern, handler, delay) {
    return this.mock("POST", pattern, handler, delay);
  }
  /**
   * Shorthand for any method
   */
  onAny(pattern, handler, delay) {
    return this.mock("*", pattern, handler, delay);
  }
  /**
   * Clear all mock routes
   */
  clearMocks() {
    this.routes = [];
  }
  /**
   * Set online state
   */
  setOnline(online) {
    if (this.isOnlineState !== online) {
      this.isOnlineState = online;
      this.connectionListeners.forEach((cb) => cb(online));
    }
  }
  matchRoute(method, url) {
    return this.routes.find((route) => {
      if (route.method !== "*" && route.method !== method) return false;
      if (typeof route.pattern === "string") {
        return url.includes(route.pattern);
      }
      return route.pattern.test(url);
    });
  }
  async executeRequest(method, url, body, options) {
    if (!this.isOnlineState) {
      throw new NetworkError("No internet connection", "OFFLINE");
    }
    const route = this.matchRoute(method, url);
    if (!route) {
      throw new NetworkError(`No mock handler for ${method} ${url}`, "NOT_FOUND", 404);
    }
    if (route.delay) {
      await new Promise((resolve) => setTimeout(resolve, route.delay));
    }
    try {
      const data = await route.handler(url, { ...options, body });
      return {
        data,
        status: 200,
        headers: {},
        ok: true
      };
    } catch (error) {
      if (error instanceof NetworkError) throw error;
      throw new NetworkError(
        error instanceof Error ? error.message : "Mock handler error",
        "UNKNOWN"
      );
    }
  }
  // HTTP methods
  async get(url, options) {
    return this.executeRequest("GET", url, void 0, options);
  }
  async post(url, data, options) {
    return this.executeRequest("POST", url, data, options);
  }
  async put(url, data, options) {
    return this.executeRequest("PUT", url, data, options);
  }
  async patch(url, data, options) {
    return this.executeRequest("PATCH", url, data, options);
  }
  async delete(url, options) {
    return this.executeRequest("DELETE", url, void 0, options);
  }
  // File downloads
  async downloadFile(url, onProgress) {
    const response = await this.get(url, { responseType: "arraybuffer" });
    if (onProgress) {
      onProgress({ loaded: 0, total: 100, percent: 0 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      onProgress({ loaded: 50, total: 100, percent: 50 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      onProgress({ loaded: 100, total: 100, percent: 100 });
    }
    return new Blob([response.data]);
  }
  async downloadJson(url, onProgress) {
    if (onProgress) {
      onProgress({ loaded: 0, total: 100, percent: 0 });
    }
    const response = await this.get(url);
    if (onProgress) {
      onProgress({ loaded: 100, total: 100, percent: 100 });
    }
    return response.data;
  }
  // Caching
  async getCached(url, maxAge) {
    const cached = this.cache.get(url);
    if (!cached) return null;
    const age = Date.now() - cached.cachedAt;
    const effectiveMaxAge = maxAge ?? cached.ttl;
    if (age > effectiveMaxAge) {
      this.cache.delete(url);
      return null;
    }
    return cached.data;
  }
  async setCached(url, data, ttl = 36e5) {
    this.cache.set(url, {
      data,
      cachedAt: Date.now(),
      ttl
    });
  }
  async invalidateCache(url) {
    this.cache.delete(url);
  }
  async clearCache() {
    this.cache.clear();
  }
  // Connection status
  async isOnline() {
    return this.isOnlineState;
  }
  onConnectionChange(callback) {
    this.connectionListeners.add(callback);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }
};
function createMockNetwork(options) {
  return new MockNetworkAdapter(options);
}

// src/memory/mock-audio-adapter.ts
var handleIdCounter2 = 0;
var MockAudioAdapter = class {
  constructor(config = {}) {
    this.instances = /* @__PURE__ */ new Map();
    this.preloadedUrls = /* @__PURE__ */ new Set();
    this.mockDurations = /* @__PURE__ */ new Map();
    this.config = {
      defaultVolume: 1,
      defaultPlaybackRate: 1,
      ...config
    };
  }
  /**
   * Set mock duration for a URL
   */
  setMockDuration(url, duration) {
    this.mockDurations.set(url, duration);
  }
  notifyListeners(instance, eventType) {
    const event = {
      type: eventType,
      handle: { ...instance.handle },
      currentTime: instance.currentTime,
      duration: instance.duration
    };
    instance.listeners.forEach((callback) => callback(event));
  }
  // Playback control
  async play(url, options) {
    const handleId = `mock_audio_${++handleIdCounter2}`;
    const handle = {
      id: handleId,
      url,
      state: "playing"
    };
    const instance = {
      handle,
      currentTime: options?.startTime ?? 0,
      duration: this.mockDurations.get(url) ?? 180,
      // Default 3 minutes
      volume: options?.volume ?? this.config.defaultVolume ?? 1,
      playbackRate: options?.playbackRate ?? this.config.defaultPlaybackRate ?? 1,
      isMuted: false,
      previousVolume: options?.volume ?? this.config.defaultVolume ?? 1,
      listeners: /* @__PURE__ */ new Set()
    };
    this.instances.set(handleId, instance);
    setTimeout(() => this.notifyListeners(instance, "loaded"), 0);
    return handle;
  }
  async pause(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.handle.state = "paused";
    this.notifyListeners(instance, "statechange");
  }
  async resume(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.handle.state = "playing";
    this.notifyListeners(instance, "statechange");
  }
  async stop(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.handle.state = "idle";
    instance.currentTime = 0;
    this.notifyListeners(instance, "statechange");
    this.instances.delete(handle.id);
  }
  // Seek and position
  async getCurrentTime(handle) {
    const instance = this.instances.get(handle.id);
    return instance?.currentTime ?? 0;
  }
  async setCurrentTime(handle, time) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.currentTime = Math.max(0, Math.min(time, instance.duration));
    this.notifyListeners(instance, "timeupdate");
  }
  async getDuration(handle) {
    if (typeof handle === "string") {
      return this.mockDurations.get(handle) ?? 180;
    }
    const instance = this.instances.get(handle.id);
    return instance?.duration ?? 0;
  }
  // Volume control
  async getVolume(handle) {
    const instance = this.instances.get(handle.id);
    return instance?.volume ?? 0;
  }
  async setVolume(handle, volume) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.volume = Math.max(0, Math.min(1, volume));
    instance.previousVolume = instance.volume;
    instance.isMuted = false;
  }
  async mute(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    if (!instance.isMuted) {
      instance.previousVolume = instance.volume;
      instance.volume = 0;
      instance.isMuted = true;
    }
  }
  async unmute(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    if (instance.isMuted) {
      instance.volume = instance.previousVolume;
      instance.isMuted = false;
    }
  }
  // Playback rate
  async getPlaybackRate(handle) {
    const instance = this.instances.get(handle.id);
    return instance?.playbackRate ?? 1;
  }
  async setPlaybackRate(handle, rate) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.playbackRate = Math.max(0.25, Math.min(4, rate));
  }
  // Metadata
  async getMetadata(url) {
    return {
      duration: this.mockDurations.get(url) ?? 180
    };
  }
  // Preloading
  async preload(url) {
    this.preloadedUrls.add(url);
  }
  async cancelPreload(url) {
    this.preloadedUrls.delete(url);
  }
  /**
   * Check if a URL was preloaded (for testing)
   */
  isPreloaded(url) {
    return this.preloadedUrls.has(url);
  }
  // Events
  onPlaybackChange(handle, callback) {
    const instance = this.instances.get(handle.id);
    if (!instance) {
      return () => {
      };
    }
    instance.listeners.add(callback);
    return () => {
      instance.listeners.delete(callback);
    };
  }
  // Cleanup
  async dispose() {
    this.instances.clear();
    this.preloadedUrls.clear();
  }
  /**
   * Get all active instances (for testing)
   */
  getActiveInstances() {
    return Array.from(this.instances.values()).map((i) => i.handle);
  }
  /**
   * Simulate end of playback (for testing)
   */
  simulateEnd(handle) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.handle.state = "ended";
    instance.currentTime = instance.duration;
    this.notifyListeners(instance, "ended");
  }
  /**
   * Simulate error (for testing)
   */
  simulateError(handle, message) {
    const instance = this.instances.get(handle.id);
    if (!instance) return;
    instance.handle.state = "error";
    const event = {
      type: "error",
      handle: { ...instance.handle },
      error: message
    };
    instance.listeners.forEach((callback) => callback(event));
  }
};
function createMockAudio(config) {
  return new MockAudioAdapter(config);
}

// src/memory/mock-platform-adapter.ts
function createMockFile(name, content, type = "text/plain") {
  return {
    name,
    size: content.length,
    type,
    text: async () => content,
    arrayBuffer: async () => new TextEncoder().encode(content).buffer
  };
}
var MockPlatformAdapter = class {
  constructor() {
    this.clipboardContent = "";
    this.colorScheme = "light";
    this.colorSchemeListeners = /* @__PURE__ */ new Set();
    this.notificationClickListeners = /* @__PURE__ */ new Set();
    this.deepLinkListeners = /* @__PURE__ */ new Set();
    this.windowTitle = "";
    this.locale = "en-US";
    this.notifications = [];
    this.mockFiles = [];
  }
  // Configure mock behavior
  /**
   * Set mock files for file picker
   */
  setMockFiles(files) {
    this.mockFiles = files.map((f) => createMockFile(f.name, f.content, f.type));
  }
  /**
   * Set mock locale
   */
  setMockLocale(locale) {
    this.locale = locale;
  }
  /**
   * Set mock color scheme
   */
  setMockColorScheme(scheme) {
    if (this.colorScheme !== scheme) {
      this.colorScheme = scheme;
      this.colorSchemeListeners.forEach((cb) => cb(scheme));
    }
  }
  /**
   * Simulate deep link
   */
  simulateDeepLink(url) {
    this.deepLinkListeners.forEach((cb) => cb(url));
  }
  /**
   * Simulate notification click
   */
  simulateNotificationClick(event) {
    this.notificationClickListeners.forEach((cb) => cb(event));
  }
  /**
   * Get shown notifications (for testing)
   */
  getNotifications() {
    return [...this.notifications];
  }
  /**
   * Get window title (for testing)
   */
  getWindowTitle() {
    return this.windowTitle;
  }
  // Platform detection
  getPlatform() {
    return "web";
  }
  getPlatformInfo() {
    return {
      platform: "web",
      version: "mock-1.0.0",
      userAgent: "MockPlatformAdapter/1.0",
      os: "unknown",
      deviceType: "desktop",
      isTouch: false,
      isStandalone: false
    };
  }
  getVersion() {
    return "mock-1.0.0";
  }
  getCapabilities() {
    return {
      fileSystem: false,
      notifications: true,
      clipboard: true,
      share: true,
      filePicker: true,
      windowManagement: true,
      deepLinking: true,
      persistentStorage: true
    };
  }
  // Clipboard
  async copyToClipboard(text) {
    this.clipboardContent = text;
  }
  async readFromClipboard() {
    return this.clipboardContent || null;
  }
  // File picker
  async selectFile(options) {
    const filtered = this.filterFiles(options);
    return filtered.length > 0 ? filtered[0] : null;
  }
  async selectFiles(options) {
    return this.filterFiles(options);
  }
  filterFiles(options) {
    if (!options?.accept) return this.mockFiles;
    return this.mockFiles.filter((file) => {
      return options.accept.some((accept) => {
        if (accept.startsWith(".")) {
          return file.name.endsWith(accept);
        }
        return file.type.includes(accept.replace("/*", ""));
      });
    });
  }
  async selectFolder() {
    return "/mock/folder/path";
  }
  // Share
  canShare() {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async share(_data) {
  }
  // Notifications
  async requestNotificationPermission() {
    return "granted";
  }
  async showNotification(title, options) {
    this.notifications.push({ title, options });
  }
  onNotificationClick(callback) {
    this.notificationClickListeners.add(callback);
    return () => {
      this.notificationClickListeners.delete(callback);
    };
  }
  // Window management
  async setWindowTitle(title) {
    this.windowTitle = title;
  }
  async minimizeWindow() {
  }
  async maximizeWindow() {
  }
  async restoreWindow() {
  }
  async closeWindow() {
  }
  async toggleFullscreen() {
  }
  async isMaximized() {
    return false;
  }
  async isFullscreen() {
    return false;
  }
  // Deep linking
  registerDeepLinkHandler(callback) {
    this.deepLinkListeners.add(callback);
    return () => {
      this.deepLinkListeners.delete(callback);
    };
  }
  // System
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async openExternalUrl(_url) {
  }
  getLocale() {
    return this.locale;
  }
  getColorScheme() {
    return this.colorScheme;
  }
  onColorSchemeChange(callback) {
    this.colorSchemeListeners.add(callback);
    return () => {
      this.colorSchemeListeners.delete(callback);
    };
  }
  /**
   * Reset mock state
   */
  reset() {
    this.clipboardContent = "";
    this.colorScheme = "light";
    this.windowTitle = "";
    this.notifications = [];
    this.mockFiles = [];
  }
};
function createMockPlatform() {
  return new MockPlatformAdapter();
}

// src/factory/config.ts
var defaultWebConfig = {
  storage: {
    type: "hybrid",
    small: { type: "localStorage" },
    large: { type: "indexedDB" }
  },
  network: {
    type: "fetch",
    cache: { enabled: true, maxAge: 36e5 }
  },
  audio: {
    type: "webAudio"
  },
  platform: {
    type: "web"
  }
};
var defaultTestConfig = {
  storage: {
    type: "memory"
  },
  network: {
    type: "mock"
  },
  audio: {
    type: "mock"
  },
  platform: {
    type: "mock"
  }
};
function mergeConfig(config, defaults = defaultWebConfig) {
  return {
    storage: { ...defaults.storage, ...config.storage },
    network: { ...defaults.network, ...config.network },
    audio: { ...defaults.audio, ...config.audio },
    platform: { ...defaults.platform, ...config.platform }
  };
}

// src/factory/adapter-factory.ts
var HybridStorageAdapter = class {
  constructor(small, large) {
    this.small = small;
    this.large = large;
  }
  // Key-value uses small storage
  get(key) {
    return this.small.get(key);
  }
  set(key, value) {
    return this.small.set(key, value);
  }
  delete(key) {
    return this.small.delete(key);
  }
  async clear() {
    await this.small.clear();
    await this.large.clear();
  }
  keys() {
    return this.small.keys();
  }
  // Structured storage uses large storage
  getStructured(collection, id) {
    return this.large.getStructured(collection, id);
  }
  setStructured(collection, id, value) {
    return this.large.setStructured(collection, id, value);
  }
  deleteStructured(collection, id) {
    return this.large.deleteStructured(collection, id);
  }
  listStructured(collection) {
    return this.large.listStructured(collection);
  }
  // Batch uses small storage
  getBatch(keys) {
    return this.small.getBatch(keys);
  }
  setBatch(data) {
    return this.small.setBatch(data);
  }
  // Events from both
  onChanged(callback) {
    const unsub1 = this.small.onChanged(callback);
    const unsub2 = this.large.onChanged(callback);
    return () => {
      unsub1();
      unsub2();
    };
  }
};
var AsyncLocalStorageAdapter = class {
  constructor(prefix) {
    this.listeners = /* @__PURE__ */ new Set();
    this.adapter = new LocalStorageAdapter(prefix);
  }
  async get(key) {
    return this.adapter.get(key);
  }
  async set(key, value) {
    const oldValue = this.adapter.get(key);
    this.adapter.set(key, value);
    this.notifyChange(key, oldValue, value);
  }
  async delete(key) {
    const oldValue = this.adapter.get(key);
    this.adapter.remove(key);
    this.notifyChange(key, oldValue, null);
  }
  async clear() {
    this.adapter.clear();
  }
  async keys() {
    return this.adapter.keys();
  }
  // Structured storage - simulate with prefixed keys
  async getStructured(collection, id) {
    return this.adapter.get(`_coll_${collection}_${id}`);
  }
  async setStructured(collection, id, value) {
    this.adapter.set(`_coll_${collection}_${id}`, value);
  }
  async deleteStructured(collection, id) {
    if (id !== void 0) {
      this.adapter.remove(`_coll_${collection}_${id}`);
    } else {
      const prefix = `_coll_${collection}_`;
      const keys = this.adapter.keys().filter((k) => k.startsWith(prefix));
      keys.forEach((k) => this.adapter.remove(k));
    }
  }
  async listStructured(collection) {
    const prefix = `_coll_${collection}_`;
    return this.adapter.keys().filter((k) => k.startsWith(prefix)).map((k) => k.substring(prefix.length));
  }
  async getBatch(keys) {
    const result = {};
    for (const key of keys) {
      result[key] = this.adapter.get(key);
    }
    return result;
  }
  async setBatch(data) {
    for (const [key, value] of Object.entries(data)) {
      this.adapter.set(key, value);
    }
  }
  notifyChange(key, oldValue, newValue) {
    this.listeners.forEach((cb) => cb({ key, oldValue, newValue }));
  }
  onChanged(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
};
function createStorageAdapter(config) {
  const cfg = config ?? defaultWebConfig.storage;
  switch (cfg.type) {
    case "memory":
      return new MemoryStorageAdapter(cfg);
    case "localStorage":
      return new AsyncLocalStorageAdapter(cfg.prefix);
    case "indexedDB":
      return new IndexedDBAdapter({
        prefix: cfg.prefix,
        dbName: cfg.dbName
      });
    case "hybrid": {
      const smallConfig = cfg.small ?? { type: "localStorage" };
      const largeConfig = cfg.large ?? { type: "indexedDB" };
      const smallAdapter = smallConfig.type === "memory" ? new MemoryStorageAdapter(smallConfig.config) : new AsyncLocalStorageAdapter(smallConfig.config?.prefix);
      const largeAdapter = largeConfig.type === "memory" ? new MemoryStorageAdapter(largeConfig.config) : new IndexedDBAdapter({
        prefix: largeConfig.config?.prefix,
        dbName: largeConfig.config?.dbName
      });
      return new HybridStorageAdapter(smallAdapter, largeAdapter);
    }
    default:
      return new MemoryStorageAdapter();
  }
}
function createNetworkAdapter(config) {
  const cfg = config ?? defaultWebConfig.network;
  switch (cfg.type) {
    case "mock":
      return new MockNetworkAdapter();
    case "fetch":
    default:
      return new WebNetworkAdapter({
        baseUrl: cfg.baseUrl,
        timeout: cfg.timeout,
        headers: cfg.headers,
        debug: cfg.debug,
        retry: cfg.retry
      });
  }
}
function createAudioAdapter(config) {
  const cfg = config ?? defaultWebConfig.audio;
  switch (cfg.type) {
    case "mock":
      return new MockAudioAdapter(cfg);
    case "webAudio":
    default:
      return new WebAudioAdapter(cfg);
  }
}
function createPlatformAdapter(config) {
  const cfg = config ?? defaultWebConfig.platform;
  switch (cfg.type) {
    case "mock":
      return new MockPlatformAdapter();
    case "web":
    default:
      return new WebPlatformAdapter();
  }
}
function createAdapterSuite(config) {
  const mergedConfig = mergeConfig(config ?? {});
  return {
    storage: createStorageAdapter(mergedConfig.storage),
    network: createNetworkAdapter(mergedConfig.network),
    audio: createAudioAdapter(mergedConfig.audio),
    platform: createPlatformAdapter(mergedConfig.platform)
  };
}
var AdapterFactory = class {
  constructor(config) {
    this.config = mergeConfig(config ?? {});
  }
  createStorage() {
    return createStorageAdapter(this.config.storage);
  }
  createNetwork() {
    return createNetworkAdapter(this.config.network);
  }
  createAudio() {
    return createAudioAdapter(this.config.audio);
  }
  createPlatform() {
    return createPlatformAdapter(this.config.platform);
  }
  createSuite() {
    return {
      storage: this.createStorage(),
      network: this.createNetwork(),
      audio: this.createAudio(),
      platform: this.createPlatform()
    };
  }
  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update configuration
   */
  updateConfig(config) {
    this.config = mergeConfig(config, this.config);
  }
};

// src/factory/detection.ts
function detectEnvironment() {
  if (typeof process !== "undefined" && (process.env.NODE_ENV === "test" || process.env.VITEST)) {
    return "test";
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }
  if (typeof self !== "undefined" && typeof globalThis.WorkerGlobalScope !== "undefined") {
    return "worker";
  }
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }
  return "unknown";
}
function detectCapabilities() {
  const env = detectEnvironment();
  if (env !== "browser") {
    return {
      localStorage: false,
      indexedDB: false,
      fetch: env === "node",
      // Node has fetch in v18+
      webAudio: false,
      notifications: false,
      clipboard: false,
      share: false,
      serviceWorker: false,
      online: true
    };
  }
  return {
    localStorage: typeof localStorage !== "undefined",
    indexedDB: typeof indexedDB !== "undefined",
    fetch: typeof fetch !== "undefined",
    webAudio: typeof AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined",
    notifications: "Notification" in window,
    clipboard: "clipboard" in navigator,
    share: "share" in navigator,
    serviceWorker: "serviceWorker" in navigator,
    online: navigator.onLine
  };
}
function getRecommendedConfig() {
  const env = detectEnvironment();
  const caps = detectCapabilities();
  if (env === "test") {
    return defaultTestConfig;
  }
  if (env !== "browser") {
    return defaultTestConfig;
  }
  const config = { ...defaultWebConfig };
  if (caps.indexedDB && caps.localStorage) {
    config.storage = {
      type: "hybrid",
      small: { type: "localStorage" },
      large: { type: "indexedDB" }
    };
  } else if (caps.localStorage) {
    config.storage = { type: "localStorage" };
  } else if (caps.indexedDB) {
    config.storage = { type: "indexedDB" };
  } else {
    config.storage = { type: "memory" };
  }
  if (caps.fetch) {
    config.network = {
      type: "fetch",
      cache: { enabled: true, maxAge: 36e5 }
    };
  } else {
    config.network = { type: "mock" };
  }
  if (caps.webAudio) {
    config.audio = { type: "webAudio" };
  } else {
    config.audio = { type: "mock" };
  }
  config.platform = { type: "web" };
  return config;
}
function isSecureContext() {
  if (typeof window === "undefined") return false;
  return window.isSecureContext ?? false;
}
function isPWA() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}
function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mobile")) return "mobile";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}
function getPreferredColorScheme() {
  if (typeof window === "undefined") return "light";
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}
async function getStorageQuota() {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return null;
  }
  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage ?? 0,
      quota: estimate.quota ?? 0
    };
  } catch {
    return null;
  }
}
async function requestPersistentStorage() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export { AdapterFactory, AudioError, IndexedDBAdapter, LocalStorageAdapter, MemoryStorageAdapter, MockAudioAdapter, MockNetworkAdapter, MockPlatformAdapter, NetworkError, PlatformError, StorageError, WebAudioAdapter, WebNetworkAdapter, WebPlatformAdapter, bindKeyEvent, copyToClipboard, createAdapterSuite, createAudioAdapter, createIndexedDBStorage, createLocalStorage, createMemoryStorage, createMockAudio, createMockNetwork, createMockPlatform, createNetworkAdapter, createPlatformAdapter, createStorageAdapter, createWebAudio, createWebNetwork, createWebPlatform, defaultTestConfig, defaultWebConfig, detectCapabilities, detectEnvironment, fetchJson, focusInput, getDeviceType, getPreferredColorScheme, getRecommendedConfig, getStorageQuota, isOnline, isPWA, isQuotaExceededError, isSecureContext, loadTranslation, mergeConfig, onConnectivityChange, parseKeyBinding, readFromClipboard, requestPersistentStorage };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map