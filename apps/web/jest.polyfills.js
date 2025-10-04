/**
 * Jest polyfills for ShipSpeak web application
 * Provides browser APIs not available in Node.js test environment
 */

// TextEncoder/TextDecoder polyfill for Node.js
const { TextEncoder, TextDecoder } = require('util')

Object.assign(global, {
  TextEncoder,
  TextDecoder,
})

// Performance API polyfill
const { performance } = require('perf_hooks')
Object.assign(global, { performance })

// Fetch API polyfill for Node.js
const fetch = require('node-fetch')
global.fetch = fetch
global.Headers = fetch.Headers
global.Request = fetch.Request
global.Response = fetch.Response

// AudioBuffer mock for audio processing tests
global.AudioBuffer = class MockAudioBuffer {
  constructor(options = {}) {
    this.duration = options.duration || 0
    this.numberOfChannels = options.numberOfChannels || 1
    this.sampleRate = options.sampleRate || 44100
    this.length = this.duration * this.sampleRate
  }
  
  getChannelData(channel) {
    return new Float32Array(this.length)
  }
  
  copyFromChannel() {}
  copyToChannel() {}
}

// File API mock
global.File = class MockFile {
  constructor(bits, name, options = {}) {
    this.bits = bits
    this.name = name
    this.type = options.type || ''
    this.size = bits.reduce ? bits.reduce((sum, bit) => sum + bit.byteLength, 0) : bits.length
    this.lastModified = Date.now()
  }
}

// URL.createObjectURL mock
global.URL = {
  createObjectURL: jest.fn(),
  revokeObjectURL: jest.fn()
}

// ResizeObserver mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// IntersectionObserver mock
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// MediaRecorder mock for audio capture tests
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  state: 'inactive'
}))

// Console warning suppression for test output
const originalWarn = console.warn

// Export setup functions for use in test files
global.setupConsoleWarning = () => {
  console.warn = jest.fn()
}

global.restoreConsoleWarning = () => {
  console.warn = originalWarn
}