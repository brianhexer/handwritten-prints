# Security Policy

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Security vulnerabilities should be reported privately to allow time for a fix to be developed and released.

### How to Report

1. **Email:** Send a detailed report to **brianhexer@gmail.com**
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Assessment:** Within 1 week
- **Fix Development:** 1-4 weeks depending on severity
- **Release:** Once fix is tested and validated

### Security Vulnerability Severity

#### Critical
- Remote code execution
- Unauthorized data access
- Authentication bypass
- Full application compromise
- **Response:** Immediate (24 hours)

#### High
- Partial unauthorized access
- Denial of service
- Significant functionality impact
- **Response:** 1-3 days

#### Medium
- Limited unauthorized access
- Requires specific conditions
- Minor functionality bypass
- **Response:** 1 week

#### Low
- Information disclosure
- UI security issues
- Non-critical edge cases
- **Response:** 2-4 weeks

## Security Best Practices for Users

### For Developers Using This Tool

1. **Keep Updated**
   - Regularly update to the latest version
   - Subscribe to security updates

2. **Input Validation**
   - Sanitize any user input before using
   - Don't trust client-side validation alone

3. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Rotate keys regularly

4. **Browser Security**
   - Use HTTPS only
   - Keep browser and extensions updated
   - Clear cache regularly for sensitive data

### For Contributors

1. **Code Review**
   - All code changes require review before merge
   - Security-focused code review checklist

2. **Dependencies**
   - Regularly audit npm dependencies
   - Run `npm audit` before committing
   - Update vulnerable packages immediately

3. **Secrets Management**
   - Never hardcode credentials
   - Use `.gitignore` for sensitive files
   - Rotate compromised credentials

4. **Testing**
   - Write security-focused tests
   - Test input validation
   - Test edge cases and error handling

## Known Security Considerations

### Translation API
- Uses Google Translate public API
- No authentication required
- Text is sent to Google's servers
- Consider this when translating sensitive content

### Local Storage
- User preferences stored in browser localStorage
- Not encrypted
- Don't store sensitive data

### File Upload
- Only TTF/OTF font files supported
- Validate file types server-side (when applicable)
- Maximum file size: 5MB

## Security Checklist

- [ ] No hardcoded credentials or secrets
- [ ] Input validation on all user inputs
- [ ] No direct eval() or innerHTML injection
- [ ] HTTPS only for API calls
- [ ] Dependencies regularly updated
- [ ] No unnecessary permissions requested
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting implemented (if applicable)

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. Acknowledged reporters will be:
- Credited in security advisories (if desired)
- Recognized in release notes
- Listed in SECURITY_ACKNOWLEDGMENTS.md

## Contact

**Security Issues:** brianhexer@gmail.com  
**General Questions:** See [Contributing Guidelines](CONTRIBUTING.md)

---

**Last Updated:** January 11, 2026  
**Policy Version:** 1.0
