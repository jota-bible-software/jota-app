'use strict';

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
var handleIdCounter = 0;
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
    const handleId = `mock_audio_${++handleIdCounter}`;
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

exports.MemoryStorageAdapter = MemoryStorageAdapter;
exports.MockAudioAdapter = MockAudioAdapter;
exports.MockNetworkAdapter = MockNetworkAdapter;
exports.MockPlatformAdapter = MockPlatformAdapter;
exports.createMemoryStorage = createMemoryStorage;
exports.createMockAudio = createMockAudio;
exports.createMockNetwork = createMockNetwork;
exports.createMockPlatform = createMockPlatform;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map