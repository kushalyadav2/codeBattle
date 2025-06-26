import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useSocket } from '../contexts/SocketContext';
import { 
  Play, 
  Save, 
  Settings, 
  Maximize2, 
  Minimize2,
  Copy,
  Check
} from 'lucide-react';

const CodeEditor = ({ 
  roomId, 
  problem, 
  onSubmit, 
  readOnly = false,
  showSubmitButton = true 
}) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { sendCodeChange } = useSocket();

  const languages = [
    { value: 'javascript', label: 'JavaScript', id: 63 },
    { value: 'python', label: 'Python', id: 71 },
    { value: 'cpp', label: 'C++', id: 54 },
    { value: 'java', label: 'Java', id: 62 }
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (showSubmitButton && onSubmit) {
        handleSubmit();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  const handleCodeChange = (value) => {
    setCode(value || '');
    
    // Send real-time code changes to other participants
    if (roomId && !readOnly) {
      sendCodeChange(roomId, value || '', language);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (problem?.starterCode?.[newLanguage]) {
      setCode(problem.starterCode[newLanguage]);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && code.trim()) {
      const selectedLang = languages.find(lang => lang.value === language);
      onSubmit({
        code: code.trim(),
        language: language,
        languageId: selectedLang?.id || 63
      });
    }
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(`codebattle_${roomId}_${language}`, code);
    // Could also save to backend here
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-96'
    }`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={readOnly}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          
          {!readOnly && (
            <button
              onClick={handleSave}
              className="text-gray-400 hover:text-white transition-colors"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 border-b border-gray-700 bg-gray-750">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <label className="text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-700 text-white rounded px-2 py-1 border border-gray-600"
              >
                {themes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-gray-300">Font Size:</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-gray-300 w-8">{fontSize}</span>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className={`${isFullscreen ? 'h-full' : 'h-80'} relative`}>
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: readOnly,
            fontSize: fontSize,
            minimap: { enabled: isFullscreen },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on'
          }}
        />
      </div>

      {/* Submit Button */}
      {showSubmitButton && !readOnly && (
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>Submit Solution</span>
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Press Ctrl+Enter to submit quickly
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
