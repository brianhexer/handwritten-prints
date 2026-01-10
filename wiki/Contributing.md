# Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements, your help is appreciated.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/handwritten-prints.git
   cd handwritten-prints
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`

## Making Changes

### Code Style
- Follow ESLint rules (runs automatically on commit)
- Use Prettier for formatting (runs automatically on commit)
- Write descriptive commit messages

### File Structure
```
handwritten-prints/
├── index.html          # Main HTML file
├── css/
│   ├── index.css       # Main styles
│   └── features.css    # Feature styles
├── js/
│   ├── app.mjs         # Main application logic
│   ├── generate-images.mjs
│   └── utils/
│       ├── translate.mjs       # Translation API
│       ├── transliterate.mjs   # Transliteration logic
│       ├── draw.mjs            # Drawing features
│       └── helpers.mjs         # Utility functions
```

## Commit Guidelines

- Use clear, descriptive messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Examples:
  - ✅ `Add Hindi transliteration support`
  - ✅ `Fix cursor position in live typing`
  - ❌ `update stuff`
  - ❌ `changes`

## Testing

Run tests before submitting PR:
```bash
npm test
npm run eslint
npm run format
```

## Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing changes
   - Description of what was changed and why
   - Screenshots if UI changes
   - Link to related issues

3. **Address review feedback**
   - Make requested changes
   - Push updates to same branch
   - Request re-review

## Types of Contributions

### 🐛 Bug Fixes
- Include steps to reproduce
- Explain expected vs actual behavior
- Test your fix thoroughly

### ✨ New Features
- Discuss in an issue first
- Keep features focused
- Add appropriate documentation

### 📚 Documentation
- Fix typos and unclear sections
- Add examples
- Improve wiki pages

### 🎨 UI/UX Improvements
- Screenshot before/after
- Explain user benefit
- Consider mobile responsiveness

## Language Support

Want to add a new language? Here's what's needed:

1. **Translation API support**
   - Check if Google Translate supports the language
   - Add language code to `translate.mjs`

2. **Transliteration mappings**
   - Create character maps in `transliterate.mjs`
   - Cover A-Z, 0-9, and punctuation

3. **Font selection**
   - Find appropriate Google Font
   - Add to `index.html` dropdown
   - Update `translate.mjs` detection

4. **Testing**
   - Test translation accuracy
   - Verify character rendering
   - Check on multiple browsers

## Style Guide

### JavaScript
- Use ES modules (`.mjs`)
- Use const/let, avoid var
- Use async/await for promises
- Add comments for complex logic

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes
- Use meaningful class names

### CSS
- Use CSS variables for colors
- Mobile-first approach
- Keep specificity low

## Community

- 💬 Questions? Ask on GitHub Issues
- 🤝 Discord: Join our community server
- 📧 Email: brianhexer@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](../CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Recognition

Contributors are recognized in:
- GitHub contributor list
- Release notes
- Wiki contributors section

Thank you for contributing! 🎉

