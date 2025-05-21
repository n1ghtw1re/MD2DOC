import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Terminal, Copy, CheckCheck, Trash2, Skull, Upload, Download, Hash, AlertTriangle } from 'lucide-react';

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const AUTO_SAVE_DELAY = 1000; // 1 second
const LOCAL_STORAGE_KEY = 'md2doc-content';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAmberTheme, setIsAmberTheme] = useState(false);
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });
  const [error, setError] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load saved content
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        setMarkdown(DOMPurify.sanitize(savedContent));
      }
    } catch (err) {
      console.error('Error loading saved content:', err);
      setError('Failed to load saved content');
    }
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, markdown);
        setUnsavedChanges(false);
      } catch (err) {
        console.error('Error saving content:', err);
        setError('Failed to save changes');
      }
      
      const words = markdown.trim().split(/\s+/).filter(word => word.length > 0).length;
      const chars = markdown.length;
      setWordCount({ words, chars });
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(timer);
  }, [markdown]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const getFormattedContent = useCallback(() => {
    const previewElement = document.querySelector('.markdown-preview');
    if (!previewElement) {
      throw new Error('Preview element not found');
    }

    const tempDiv = document.createElement('div');
    const clone = previewElement.cloneNode(true) as HTMLElement;
    
    // Sanitize the content
    const sanitizedHtml = DOMPurify.sanitize(clone.innerHTML, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'em', 'strong', 'del', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br'],
      ALLOWED_ATTR: ['href', 'src', 'alt']
    });
    
    clone.innerHTML = sanitizedHtml;

    // Apply clean formatting
    clone.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      heading.style.fontSize = '';
      heading.style.fontWeight = 'bold';
      heading.style.color = 'black';
      heading.style.fontFamily = 'Arial';
    });

    clone.querySelectorAll('p, li, a, code, blockquote').forEach(element => {
      element.style.color = 'black';
      element.style.fontFamily = 'Arial';
      element.style.fontSize = '';
      element.style.backgroundColor = '';
    });

    clone.querySelectorAll('*').forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.margin = '';
        element.style.padding = '';
        element.className = '';
      }
    });

    tempDiv.appendChild(clone);
    return tempDiv.innerHTML;
  }, []);

  const handleCopy = async () => {
    try {
      const formattedContent = getFormattedContent();
      const blob = new Blob([formattedContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blob
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      setError('Failed to copy content. Please try selecting and copying manually.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleClear = () => {
    if (markdown && window.confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      setMarkdown('');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUnsavedChanges(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.md')) {
      setError('Please upload a markdown (.md) file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Sanitize content
        const sanitized = DOMPurify.sanitize(content, {
          ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'em', 'strong', 'del'],
          ALLOWED_ATTR: ['href']
        });
        setMarkdown(sanitized);
        setUnsavedChanges(true);
      } catch (err) {
        console.error('File processing error:', err);
        setError('Failed to process file. Please try again.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    try {
      const formattedContent = getFormattedContent();
      const blob = new Blob([formattedContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to save document. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    setUnsavedChanges(true);
  };

  const toggleTheme = () => {
    setIsAmberTheme(!isAmberTheme);
  };

  const themeClasses = isAmberTheme ? 'amber-theme' : 'green-theme';

  return (
    <div className={`min-h-screen bg-black flex flex-col ${themeClasses}`}>
      <div className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full relative">
        <button 
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 cyber-border rounded-full hover:bg-amber-900/20 transition-all duration-300"
          title="Toggle Theme"
        >
          <Skull className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-10 h-10 cyber-glow" />
          <h1 className="text-3xl font-bold cyber-glow tracking-wider">MD2DOC</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 cyber-border bg-red-900/20 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="mb-8 p-4 cyber-border rounded-lg bg-black/20">
          <h2 className="text-lg font-mono mb-2 uppercase tracking-wider">&gt; INSTRUCTIONS:</h2>
          <ol className="list-decimal list-inside space-y-1 font-mono text-sm">
            <li>PASTE or TYPE markdown text in the INPUT_STREAM window</li>
            <li>VIEW formatted output in the OUTPUT_STREAM window</li>
            <li>Click EXTRACT to copy formatted text</li>
            <li>Click SAVE to download as formatted document</li>
            <li>PASTE into your document (Google Docs, Word, etc.)</li>
            <li>Use CLEAR to reset the INPUT_STREAM</li>
          </ol>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="markdown" className="block text-sm font-mono uppercase tracking-wider">
                &gt; INPUT_STREAM {unsavedChanges && <span className="text-amber-500">*</span>}
              </label>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono 
                  cyber-border rounded hover:bg-opacity-20 cursor-pointer
                  transition-all duration-300 uppercase tracking-wider">
                  <Upload className="w-4 h-4" />
                  UPLOAD
                  <input
                    type="file"
                    accept=".md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono 
                    cyber-border rounded hover:bg-opacity-20 
                    transition-all duration-300 uppercase tracking-wider"
                >
                  <Trash2 className="w-4 h-4" />
                  CLEAR
                </button>
              </div>
            </div>
            <textarea
              id="markdown"
              value={markdown}
              onChange={handleMarkdownChange}
              className="w-full h-[500px] p-4 bg-black/20 font-mono border-0 rounded-lg 
                cyber-border focus:outline-none focus:ring-1 
                placeholder-opacity-50"
              placeholder="&gt; INJECT_MARKDOWN_HERE..."
              maxLength={100000}
              spellCheck="true"
            />
            <div className="flex items-center justify-end gap-4 text-sm font-mono">
              <span className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Words: {wordCount.words}
              </span>
              <span>Chars: {wordCount.chars}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-mono uppercase tracking-wider">
                &gt; OUTPUT_STREAM
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono 
                    cyber-border rounded hover:bg-opacity-20 
                    transition-all duration-300 uppercase tracking-wider"
                >
                  {copied ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? 'EXTRACTED' : 'EXTRACT'}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono 
                    cyber-border rounded hover:bg-opacity-20 
                    transition-all duration-300 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  SAVE
                </button>
              </div>
            </div>
            <div className="w-full h-[500px] p-4 matrix-bg cyber-border rounded-lg terminal-shadow overflow-y-auto">
              <div className="markdown-preview prose prose-invert max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-opacity-20 bg-black/50 backdrop-blur-sm py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-4">
            <p className="font-mono text-sm">Designed by: N1ghtw1re Studios</p>
            <a href="mailto:n1ghtw1re@proton.me" className="font-mono text-sm hover:opacity-80 transition-colors">
              contact: n1ghtw1re@proton.me
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3 font-mono text-sm">
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Facebook</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Threads</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Bluesky</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Mastodon</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Github</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">Patreon</a>
            <a href="#" className="px-3 py-1 cyber-border rounded hover:bg-opacity-20 transition-all duration-300">BuyMeACoffee</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;