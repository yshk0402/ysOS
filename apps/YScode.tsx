import React, { useState, useRef, useEffect } from 'react';
import { Button95, Input95, ScrollPanel, W95Border } from '../components/SystemUI';
import { sendMessageToGemini } from '../services/geminiService';
import { FileText, Folder, Terminal, Play, Plus, X, ChevronRight, ChevronDown, Monitor, Code, Settings, Search, MoreHorizontal, Layout, GitBranch, MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface File {
    name: string;
    content: string;
    language: 'html' | 'css' | 'javascript' | 'typescript' | 'text';
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const YScode: React.FC = () => {
    const { theme } = useTheme();
    const isMac = theme === 'macos';

    // --- File System State ---
    const [files, setFiles] = useState<File[]>([
        { name: 'index.html', content: '<h1>Hello World</h1>\n<p>Welcome to YScode!</p>', language: 'html' },
        { name: 'style.css', content: 'body { background-color: #f0f0f0; }', language: 'css' },
        { name: 'script.js', content: 'console.log("Hello from YScode!");', language: 'javascript' },
    ]);
    const [activeFile, setActiveFile] = useState<string>('index.html');
    const [showPreview, setShowPreview] = useState(false);

    // --- AI State ---
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Welcome to YScode! I'm your AI coding assistant." }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // --- Terminal State ---
    const [terminalOutput, setTerminalOutput] = useState<string[]>(['YScode Terminal v1.0', 'Type "help" for commands.']);
    const [terminalInput, setTerminalInput] = useState('');
    const [showTerminal, setShowTerminal] = useState(true);
    const terminalBottomRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalOutput, showTerminal]);

    // --- File Operations ---
    const currentFile = files.find(f => f.name === activeFile);

    const handleFileChange = (content: string) => {
        setFiles(prev => prev.map(f => f.name === activeFile ? { ...f, content } : f));
    };

    const createNewFile = () => {
        const name = `new_file_${files.length + 1}.txt`;
        setFiles([...files, { name, content: '', language: 'text' }]);
        setActiveFile(name);
    };

    const deleteFile = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        const newFiles = files.filter(f => f.name !== name);
        setFiles(newFiles);
        if (activeFile === name && newFiles.length > 0) {
            setActiveFile(newFiles[0].name);
        } else if (newFiles.length === 0) {
            setActiveFile('');
        }
    };

    // --- AI Operations ---
    const handleAiSend = async () => {
        if (!aiInput.trim() || isAiLoading) return;

        const userMsg: Message = { role: 'user', text: aiInput };
        setMessages(prev => [...prev, userMsg]);
        setAiInput('');
        setIsAiLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const contextPrompt = `Current file: ${activeFile}\nContent:\n\`\`\`\n${currentFile?.content || ''}\n\`\`\`\n\nUser request: ${aiInput}\n\nIf you provide code, please wrap it in a single code block.`;

            const responseText = await sendMessageToGemini(contextPrompt, history);

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

            const codeMatch = responseText.match(/```(?:[\w]*\n)?([\s\S]*?)```/);
            if (codeMatch && codeMatch[1] && currentFile) {
                handleFileChange(codeMatch[1].trim());
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to AI service." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- Terminal Operations ---
    const handleTerminalCommand = () => {
        const cmd = terminalInput.trim();
        setTerminalOutput(prev => [...prev, `> ${cmd}`]);
        setTerminalInput('');

        const args = cmd.split(' ');
        const command = args[0].toLowerCase();

        switch (command) {
            case 'help':
                setTerminalOutput(prev => [...prev, 'Available commands: ls, cat [file], clear, echo [text], preview']);
                break;
            case 'ls':
                setFiles(prev => {
                    setTerminalOutput(curr => [...curr, ...prev.map(f => f.name)]);
                    return prev;
                });
                break;
            case 'cat':
                const targetFile = files.find(f => f.name === args[1]);
                if (targetFile) {
                    setTerminalOutput(prev => [...prev, targetFile.content]);
                } else {
                    setTerminalOutput(prev => [...prev, `File not found: ${args[1]}`]);
                }
                break;
            case 'clear':
                setTerminalOutput([]);
                break;
            case 'echo':
                setTerminalOutput(prev => [...prev, args.slice(1).join(' ')]);
                break;
            case 'preview':
                setShowPreview(true);
                setTerminalOutput(prev => [...prev, 'Opening preview...']);
                break;
            default:
                if (cmd) setTerminalOutput(prev => [...prev, `Command not found: ${command}`]);
        }
    };

    // --- Render Helpers ---
    const getPreviewContent = () => {
        const html = files.find(f => f.name === 'index.html')?.content || '';
        const css = files.find(f => f.name === 'style.css')?.content || '';
        const js = files.find(f => f.name === 'script.js')?.content || '';

        return `
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
    };

    if (isMac) {
        return (
            <div className="flex h-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
                {/* Activity Bar */}
                <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4 text-[#858585]">
                    <div className="text-white cursor-pointer"><FileText size={24} strokeWidth={1.5} /></div>
                    <div className="hover:text-white cursor-pointer"><Search size={24} strokeWidth={1.5} /></div>
                    <div className="hover:text-white cursor-pointer"><GitBranch size={24} strokeWidth={1.5} /></div>
                    <div className="hover:text-white cursor-pointer"><Play size={24} strokeWidth={1.5} /></div>
                    <div className="hover:text-white cursor-pointer"><Layout size={24} strokeWidth={1.5} /></div>
                    <div className="mt-auto hover:text-white cursor-pointer"><Settings size={24} strokeWidth={1.5} /></div>
                </div>

                {/* Sidebar (Explorer) */}
                <div className="w-60 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
                    <div className="px-4 py-2 text-xs font-bold text-[#bbbbbb] flex justify-between items-center">
                        <span>EXPLORER</span>
                        <MoreHorizontal size={16} />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-2 py-1 text-xs font-bold flex items-center gap-1 text-white cursor-pointer">
                            <ChevronDown size={16} /> <span>WORKSPACE</span>
                        </div>
                        {files.map(file => (
                            <div
                                key={file.name}
                                className={`flex items-center gap-1 px-4 py-1 text-sm cursor-pointer ${activeFile === file.name ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-[#cccccc]'}`}
                                onClick={() => { setActiveFile(file.name); setShowPreview(false); }}
                            >
                                <span className="text-[#e37933]"><FileText size={14} /></span>
                                <span className="truncate flex-1">{file.name}</span>
                                <button onClick={(e) => deleteFile(e, file.name)} className="opacity-0 group-hover:opacity-100 hover:text-white"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                    {/* Tabs */}
                    <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide">
                        {files.map(file => (
                            <div
                                key={file.name}
                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-r border-[#1e1e1e] min-w-[120px] max-w-[200px] group
                                    ${activeFile === file.name && !showPreview
                                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                                        : 'bg-[#2d2d2d] text-[#969696]'}`}
                                onClick={() => { setActiveFile(file.name); setShowPreview(false); }}
                            >
                                <span className={`truncate flex-1 ${file.name.endsWith('.html') ? 'text-[#e34c26]' : file.name.endsWith('.css') ? 'text-[#563d7c]' : 'text-[#f1e05a]'}`}>
                                    {file.name.endsWith('.html') ? '<>' : file.name.endsWith('.css') ? '#' : 'JS'}
                                </span>
                                <span className="truncate flex-1">{file.name}</span>
                                <button onClick={(e) => deleteFile(e, file.name)} className={`hover:bg-[#4e4e4e] rounded p-0.5 ${activeFile === file.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}><X size={12} /></button>
                            </div>
                        ))}
                        <div
                            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-r border-[#1e1e1e]
                                    ${showPreview
                                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                                    : 'bg-[#2d2d2d] text-[#969696]'}`}
                            onClick={() => setShowPreview(true)}
                        >
                            <Play size={12} className="text-[#4ec9b0]" /> Preview
                        </div>
                    </div>

                    {/* Editor / Preview Area */}
                    <div className="flex-1 relative">
                        {showPreview ? (
                            <iframe
                                srcDoc={getPreviewContent()}
                                className="w-full h-full bg-white"
                                title="preview"
                                sandbox="allow-scripts"
                            />
                        ) : (
                            currentFile ? (
                                <div className="flex h-full">
                                    <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-2 pt-2 text-xs select-none font-mono leading-relaxed">
                                        {currentFile.content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                                    </div>
                                    <textarea
                                        className="flex-1 h-full bg-[#1e1e1e] text-[#d4d4d4] p-2 font-mono text-sm resize-none outline-none leading-relaxed"
                                        value={currentFile.content}
                                        onChange={(e) => handleFileChange(e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-[#3b3b3b]">
                                    <div className="text-6xl mb-4 opacity-20"><Code /></div>
                                    <div className="text-sm">Select a file to start editing</div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Terminal Panel */}
                    {showTerminal && (
                        <div className="h-48 flex flex-col border-t border-[#414141] bg-[#1e1e1e]">
                            <div className="flex items-center justify-between px-4 py-1 bg-[#1e1e1e] text-[#cccccc] text-xs uppercase tracking-wider border-b border-[#414141]">
                                <div className="flex gap-4">
                                    <span className="cursor-pointer border-b border-white pb-1">Terminal</span>
                                    <span className="cursor-pointer text-[#6f6f6f] hover:text-[#cccccc]">Output</span>
                                    <span className="cursor-pointer text-[#6f6f6f] hover:text-[#cccccc]">Debug Console</span>
                                </div>
                                <button onClick={() => setShowTerminal(false)} className="hover:text-white"><X size={14} /></button>
                            </div>
                            <div className="flex-1 p-2 font-mono text-sm overflow-y-auto text-[#cccccc]">
                                {terminalOutput.map((line, i) => (
                                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                                ))}
                                <div ref={terminalBottomRef} />
                                <div className="flex gap-2 items-center mt-1">
                                    <span className="text-[#4ec9b0]">➜</span>
                                    <span className="text-[#569cd6]">vscode</span>
                                    <span className="text-[#9cdcfe]">git:(<span className="text-[#e34c26]">main</span>)</span>
                                    <input
                                        className="flex-1 bg-transparent outline-none text-[#cccccc] font-mono text-sm ml-1"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (AI) */}
                <div className="w-80 flex flex-col bg-[#252526] border-l border-[#1e1e1e]">
                    <div className="px-4 py-2 text-xs font-bold text-[#bbbbbb] flex justify-between items-center border-b border-[#1e1e1e]">
                        <span>AI ASSISTANT</span>
                        <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 p-4 font-sans text-sm overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                                <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    <span className="text-xs text-[#858585]">{msg.role === 'user' ? 'You' : 'YScode AI'}</span>
                                </div>
                                <div className={`p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#007acc] text-white' : 'bg-[#37373d] text-[#cccccc]'}`}>
                                    <span className="whitespace-pre-wrap">{msg.text}</span>
                                </div>
                            </div>
                        ))}
                        {isAiLoading && (
                            <div className="flex gap-1 ml-2 mb-4">
                                <div className="w-2 h-2 bg-[#858585] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[#858585] rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-[#858585] rounded-full animate-bounce delay-150"></div>
                            </div>
                        )}
                        <div ref={chatBottomRef} />
                    </div>

                    <div className="p-3 border-t border-[#1e1e1e]">
                        <div className="bg-[#3c3c3c] rounded-md flex items-center p-1 border border-[#3c3c3c] focus-within:border-[#007acc]">
                            <input
                                className="flex-1 bg-transparent outline-none text-[#cccccc] px-2 text-sm"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                                placeholder="Ask anything..."
                                disabled={isAiLoading}
                            />
                            <button
                                onClick={handleAiSend}
                                disabled={isAiLoading}
                                className="p-1 hover:bg-[#4e4e4e] rounded text-[#cccccc]"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-[#c0c0c0] text-black font-sans overflow-hidden p-1 gap-1">
            {/* Sidebar (Explorer) */}
            <div className="w-48 flex flex-col gap-1">
                <div className="bg-[#000080] text-white px-2 py-1 font-bold text-sm flex justify-between items-center">
                    <span>EXPLORER</span>
                    <button onClick={createNewFile} className="hover:bg-[#0000a0] p-0.5 rounded border border-transparent hover:border-white"><Plus size={14} /></button>
                </div>
                <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white overflow-y-auto p-1">
                    <div className="px-1 py-0.5 text-sm font-bold flex items-center gap-1 text-black mb-1">
                        <ChevronDown size={14} /> WORKSPACE
                    </div>
                    {files.map(file => (
                        <div
                            key={file.name}
                            className={`flex items-center gap-2 px-2 py-0.5 text-sm cursor-pointer border border-transparent ${activeFile === file.name ? 'bg-[#000080] text-white border-dotted border-white' : 'hover:underline'}`}
                            onClick={() => { setActiveFile(file.name); setShowPreview(false); }}
                        >
                            <FileText size={14} className={activeFile === file.name ? 'text-white' : 'text-black'} />
                            <span className="truncate flex-1">{file.name}</span>
                            <button onClick={(e) => deleteFile(e, file.name)} className={`hover:text-red-500 ${activeFile === file.name ? 'text-white' : 'text-gray-500'}`}><X size={12} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 gap-1">
                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5">
                    {files.map(file => (
                        <div
                            key={file.name}
                            className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer border-2 min-w-[100px] max-w-[150px]
                                ${activeFile === file.name && !showPreview
                                    ? 'bg-white border-t-white border-l-white border-r-[#808080] border-b-[#808080] font-bold'
                                    : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black'}`}
                            onClick={() => { setActiveFile(file.name); setShowPreview(false); }}
                        >
                            <span className="truncate flex-1">{file.name}</span>
                            <button onClick={(e) => deleteFile(e, file.name)} className="hover:bg-red-500 hover:text-white rounded p-0.5"><X size={10} /></button>
                        </div>
                    ))}
                    <div
                        className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer border-2
                             ${showPreview
                                ? 'bg-white border-t-white border-l-white border-r-[#808080] border-b-[#808080] font-bold'
                                : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black'}`}
                        onClick={() => setShowPreview(true)}
                    >
                        <Play size={12} className="text-green-700" /> Preview
                    </div>
                </div>

                {/* Editor / Preview Area */}
                <div className="flex-1 relative border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white">
                    {showPreview ? (
                        <iframe
                            srcDoc={getPreviewContent()}
                            className="w-full h-full bg-white"
                            title="preview"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        currentFile ? (
                            <textarea
                                className="w-full h-full bg-white text-black p-2 font-mono text-sm resize-none outline-none leading-relaxed"
                                value={currentFile.content}
                                onChange={(e) => handleFileChange(e.target.value)}
                                spellCheck={false}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No file open</div>
                        )
                    )}
                </div>

                {/* Terminal Panel */}
                {showTerminal && (
                    <div className="h-40 flex flex-col border-2 border-t-white border-l-white border-r-black border-b-black bg-[#c0c0c0]">
                        <div className="flex items-center justify-between px-2 py-0.5 bg-[#000080] text-white text-xs font-bold">
                            <span className="flex items-center gap-2"><Terminal size={12} /> Terminal</span>
                            <button onClick={() => setShowTerminal(false)} className="hover:bg-red-500 px-1"><X size={10} /></button>
                        </div>
                        <div className="flex-1 p-2 font-mono text-sm overflow-y-auto bg-black text-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white m-1">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className="whitespace-pre-wrap">{line}</div>
                            ))}
                            <div ref={terminalBottomRef} />
                            <div className="flex gap-1 items-center mt-1">
                                <span className="text-green-500">C:\&gt;</span>
                                <input
                                    className="flex-1 bg-transparent outline-none text-white font-mono text-sm"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar (AI) */}
            <div className="w-80 flex flex-col gap-1">
                <div className="bg-[#000080] text-white px-2 py-1 font-bold text-sm">
                    AI ASSISTANT
                </div>
                <ScrollPanel className="flex-1 p-2 font-sans text-sm bg-white">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-blue-800 font-bold' : 'text-black'}`}>
                            <span className="uppercase text-xs mr-1 mb-1 block text-[#808080]">
                                {msg.role === 'user' ? 'You' : 'AI'}:
                            </span>
                            <span className="whitespace-pre-wrap">{msg.text}</span>
                        </div>
                    ))}
                    {isAiLoading && <div className="text-[#808080] italic">Thinking...</div>}
                    <div ref={chatBottomRef} />
                </ScrollPanel>

                <W95Border type="in" className="p-1 bg-[#c0c0c0]">
                    <div className="flex gap-2">
                        <Input95
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                            placeholder="Ask AI..."
                            disabled={isAiLoading}
                        />
                        <Button95 onClick={handleAiSend} disabled={isAiLoading} className="w-16 font-bold">
                            Send
                        </Button95>
                    </div>
                </W95Border>
            </div>
        </div>
    );
};
