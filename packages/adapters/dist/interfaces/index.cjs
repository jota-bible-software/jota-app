'use strict';

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

exports.AudioError = AudioError;
exports.NetworkError = NetworkError;
exports.PlatformError = PlatformError;
exports.StorageError = StorageError;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map