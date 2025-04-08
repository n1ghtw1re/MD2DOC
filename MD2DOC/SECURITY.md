# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

### Content Processing
- DOMPurify for HTML sanitization
- Markdown safe parsing
- XSS attack prevention
- Input validation
- Output sanitization

### File Handling
- Size limitations (1MB max)
- Type verification
- Content validation
- Safe storage practices

### Local Storage
- Encrypted when supported
- Session-based
- No sensitive data storage
- Automatic clearing

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. Email details to n1ghtw1re@proton.me
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline
- Initial response: 24-48 hours
- Update frequency: Every 72 hours
- Resolution target: 7-14 days

## Best Practices

### For Users
1. Keep your browser updated
2. Clear local storage regularly
3. Don't process sensitive information
4. Verify downloaded files
5. Report suspicious behavior

### For Contributors
1. Follow secure coding guidelines
2. Implement input validation
3. Use content sanitization
4. Test security features
5. Review dependencies

## Security Measures

### Prevention
- XSS attacks
- CSRF attacks
- Injection attacks
- Data exposure
- Client-side vulnerabilities

### Implementation
- Content security policies
- Secure content handling
- Input validation
- Output encoding
- File validation

## Acknowledgments

We appreciate security researchers who help keep MD2DOC secure. Contributors will be acknowledged (with permission) for responsible disclosure.