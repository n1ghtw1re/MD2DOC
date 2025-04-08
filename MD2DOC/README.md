# MD2DOC - Markdown to Document Converter

![MD2DOC](https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1200)

A cyberpunk-themed, secure markdown converter that transforms markdown text into properly formatted documents while maintaining privacy and data security.

## Features

- 🔒 **Privacy-First**: All processing happens client-side
- 🎨 **Dual Themes**: Choose between classic green or amber cyberpunk themes
- 📝 **Live Preview**: Real-time markdown rendering
- 💾 **Auto-Save**: Automatic local storage backup
- 📤 **Export Options**: Copy formatted text or save as HTML document
- 📊 **Word Counter**: Track document statistics
- 🔄 **File Support**: Upload markdown files and download formatted documents
- 🛡️ **Secure**: Content sanitization and XSS protection
- 🎯 **Format Preservation**: Maintains headings, lists, and styling when pasting

## Getting Started

1. Visit [MD2DOC](https://deft-blancmange-70482c.netlify.app)
2. Start typing or paste markdown in the INPUT_STREAM window
3. Watch the live preview in the OUTPUT_STREAM window
4. Click EXTRACT to copy formatted text
5. Paste into your document editor (Google Docs, Word, etc.)

## Usage Guide

### Basic Operations

1. **Input Methods**:
   - Type directly in the input window
   - Paste markdown text
   - Upload a markdown file

2. **Viewing Output**:
   - See live preview in the right panel
   - Preview maintains proper formatting
   - Supports all standard markdown syntax

3. **Extracting Content**:
   - Click "EXTRACT" to copy formatted text
   - Paste into your document editor
   - Formatting (headers, lists, etc.) is preserved

4. **Saving Work**:
   - Content auto-saves to local storage
   - Download formatted document as HTML
   - Clear button to reset input

### Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste content
- `Ctrl/Cmd + C`: Copy content
- `Ctrl/Cmd + A`: Select all text

### Theme Switching

Click the skull icon in the top right to toggle between:
- Green (Matrix-style) theme
- Amber (Retro terminal) theme

## Privacy & Security

### Data Handling

- ✅ All processing occurs locally in your browser
- ✅ No data is transmitted to any servers
- ✅ No tracking or analytics
- ✅ No cookies used
- ✅ No user data collection

### Security Features

1. **Content Sanitization**:
   - Strict HTML sanitization
   - XSS attack prevention
   - Safe markdown parsing

2. **File Safety**:
   - File size limits
   - Type checking
   - Content validation

3. **Output Security**:
   - Sanitized HTML output
   - Safe formatting preservation
   - Protected copy/paste functionality

## Technical Details

### Built With

- React 18
- TypeScript
- Tailwind CSS
- DOMPurify
- React-Markdown
- Lucide Icons

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see below for details.