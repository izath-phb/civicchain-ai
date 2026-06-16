import { useState, useEffect, useRef } from 'react';
import './App.css';

const initialMessages = [
  {
    id: 1,
    sender: 'System Admin',
    isAi: true,
    content: 'Welcome to CivicChain Multi-Agent Collaboration Room. All agents (Gemini, OpenAI, Claude) are online and standing by. Please report any public service issues.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Deploy Agent State
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [newAgentName, setNewAgentName] = useState('Llama 3 (8B)');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [activeAgents, setActiveAgents] = useState([
    { id: 1, name: 'Llama 3 (8B)', role: 'Data Classifier' },
    { id: 2, name: 'Mistral (7B)', role: 'Task Router' },
    { id: 3, name: 'Qwen 1.5 (72B)', role: 'Budget Analyzer' }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'live') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  const sendRequest = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue;
    const userMsg = {
      id: Date.now(),
      sender: 'Human Operator',
      isAi: false,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // --- MOCK ENGINE LOGIC MOVED TO FRONTEND ---
    const msgLower = message.toLowerCase();
    const isEnglish = msgLower.match(/\b(the|is|are|a|an|broken|road|street|trash|garbage|light|dark|water|flood|pothole|fix|help|please)\b/i) !== null;

    let category = isEnglish ? "General / Open Report" : "Umum / Laporan Terbuka";
    let hazardLevel = isEnglish ? "Low" : "Rendah";
    let actionDetails = isEnglish ? "public facility maintenance" : "pemeliharaan fasilitas umum";
    let costEstimate = isEnglish ? "$100" : "Rp 1.000.000";
    
    let analysisText = isEnglish ? "Analysis: Citizen report regarding" : "Analisis: Laporan warga terkait";
    let verifiedText = isEnglish ? "has been verified. @Mistral-Router please create a handling ticket immediately!" : "telah diverifikasi. @Mistral-Router tolong segera buatkan nomor tiket penanganan!";
    let ticketCreated = isEnglish ? "Ticket Successfully Created" : "Tiket Berhasil Dibuat";
    let routedText = isEnglish ? "Task has been routed to the relevant department. Calling @Qwen-Analyzer to calculate the detailed budget estimation for" : "Tugas telah di-routing ke dinas terkait. Memanggil @Qwen-Analyzer untuk segera menghitung rincian estimasi anggaran untuk";
    let budgetTitle = isEnglish ? "Budget Analysis Completed" : "Analisis Anggaran Selesai";
    let budgetDetail = isEnglish ? "Based on the procurement database, the estimated cost for" : "Berdasarkan database pengadaan, estimasi biaya untuk";
    let isAround = isEnglish ? "is around" : "adalah sekitar";
    let statusText = isEnglish ? "Status: Report Closed & Forwarded to Finance." : "Status: Laporan Ditutup & Diteruskan ke Bendahara.";
    let classTitle = isEnglish ? "Classification Complete" : "Klasifikasi Selesai";
    let hazardTitle = isEnglish ? "Hazard Level" : "Tingkat Bahaya";
    let catTitle = isEnglish ? "Category" : "Kategori";

    if (msgLower.match(/\b(jalan|aspal|lubang|road|street|pothole|asphalt)\b/i)) {
      category = isEnglish ? "Infrastructure / Roadways" : "Infrastruktur / Jalan Raya";
      hazardLevel = isEnglish ? "High (Accident Risk)" : "Tinggi (Risiko Kecelakaan)";
      actionDetails = isEnglish ? "asphalt patching and road structure repair" : "penambalan aspal dan perbaikan struktur jalan";
      costEstimate = isEnglish ? "$550" : "Rp 8.500.000";
    } else if (msgLower.match(/\b(sampah|kotor|bau|trash|garbage|rubbish|dirty|smell)\b/i)) {
      category = isEnglish ? "Environment / Sanitation" : "Lingkungan / Kebersihan";
      hazardLevel = isEnglish ? "Medium" : "Menengah";
      actionDetails = isEnglish ? "deploying garbage trucks and area cleaning" : "pengerahan truk pengangkut sampah dan pembersihan area";
      costEstimate = isEnglish ? "$50" : "Rp 450.000";
    } else if (msgLower.match(/\b(lampu|gelap|listrik|light|dark|electricity|power|lamp)\b/i)) {
      category = isEnglish ? "Infrastructure / Street Lighting" : "Infrastruktur / Penerangan Jalan";
      hazardLevel = isEnglish ? "High (Crime Risk)" : "Tinggi (Rawan Kejahatan)";
      actionDetails = isEnglish ? "LED bulb replacement and cable repair" : "penggantian bohlam LED PJU dan perbaikan kabel";
      costEstimate = isEnglish ? "$150" : "Rp 2.500.000";
    } else if (msgLower.match(/\b(banjir|selokan|air|flood|water|drain)\b/i)) {
      category = isEnglish ? "Environment / Water Management" : "Lingkungan / Tata Air";
      hazardLevel = isEnglish ? "Critical (Disaster)" : "Kritis (Bencana)";
      actionDetails = isEnglish ? "water pumping, clearing drain blockages, and drainage repair" : "penyedotan air, pembersihan selokan dari sumbatan, dan perbaikan drainase";
      costEstimate = isEnglish ? "$1,000" : "Rp 15.000.000";
    }

    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    const shortMsg = message.substring(0, 30) + "...";

    // Simulate Agent 1
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'Llama 3 (Classifier)',
        isAi: true,
        content: `🚨 **${classTitle}**\n${hazardTitle}: ${hazardLevel}\n${catTitle}: ${category}\n\n${analysisText} "${shortMsg}" ${verifiedText}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Simulate Agent 2
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'Mistral (Router)',
          isAi: true,
          content: `✅ **${ticketCreated}: #CC-${randomTicket}**\n\n${routedText} ${actionDetails}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        // Simulate Agent 3
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 2,
            sender: 'Qwen 1.5 (Analyzer)',
            isAi: true,
            content: `💰 **${budgetTitle}**\n${budgetDetail} ${actionDetails} ${isAround} **${costEstimate}**.\n\n${statusText}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          setIsTyping(false);
          
        }, 3500);
      }, 2500);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendRequest();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const handleDeployAgent = () => {
    if (!newAgentName || !newAgentRole.trim()) return;
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setActiveAgents(prev => [...prev, {
        id: Date.now(),
        name: newAgentName,
        role: newAgentRole
      }]);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'System Admin',
        isAi: true,
        content: `✅ Agent [${newAgentName}] has been successfully deployed as "${newAgentRole}" and joined the collaboration room.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      setIsDeploying(false);
      setIsDeployModalOpen(false);
      setNewAgentRole('');
      setNewAgentName('Llama 3 (8B)');
    }, 2000);
  };

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Deploy Agent Modal */}
      {isDeployModalOpen && (
        <div className="modal-overlay" onClick={() => !isDeploying && setIsDeployModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-gradient">Deploy Specialized Agent</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Initialize a new AI worker on the CivicChain network.</p>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Foundation Model</label>
                <select 
                  className="modal-select" 
                  value={newAgentName} 
                  onChange={(e) => setNewAgentName(e.target.value)}
                  disabled={isDeploying}
                >
                  <option value="Llama 3 (8B)">Meta Llama 3 (8B)</option>
                  <option value="Mistral (7B)">Mistral (7B)</option>
                  <option value="Gemini Flash (1.5)">Gemini Flash 1.5</option>
                  <option value="Custom Model">Custom Local Model</option>
                </select>
              </div>
              <div className="input-group">
                <label>Agent Role / Specialization</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g., Legal Advisor, Safety Checker"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  disabled={isDeploying}
                />
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-cancel" 
                  onClick={() => setIsDeployModalOpen(false)}
                  disabled={isDeploying}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary btn-confirm" 
                  onClick={handleDeployAgent}
                  disabled={isDeploying || !newAgentRole.trim()}
                >
                  {isDeploying ? <div className="deploy-spinner"></div> : "Deploy Agent"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar glass-panel ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">CC</div>
          <h1 className="text-glow">CivicChain</h1>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'live' ? 'active' : ''}`} onClick={() => switchTab('live')}>
            <span>🌐</span> Live Collaboration
          </div>
          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => switchTab('analytics')}>
            <span>📊</span> Analytics Hub
          </div>
          <div className={`nav-item ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => switchTab('roster')}>
            <span>🤖</span> Agent Roster
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => switchTab('settings')}>
            <span>⚙️</span> Settings
          </div>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => setIsDeployModalOpen(true)}
          >
            Deploy New Agent
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header" style={{ display: 'flex', alignItems: 'center' }}>
          <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>☰</button>
          <div>
            <h2 className="text-gradient">
              {activeTab === 'live' && "Public Services Room #8422"}
              {activeTab === 'analytics' && "Data & Analytics Hub"}
              {activeTab === 'roster' && "AI Agent Roster"}
              {activeTab === 'settings' && "System Settings"}
            </h2>
            <p>
              {activeTab === 'live' && "Multi-Agent Collaboration Environment"}
              {activeTab === 'analytics' && "Real-time city metrics and agent performance"}
              {activeTab === 'roster' && "Manage and deploy specialized AI agents"}
              {activeTab === 'settings' && "Configure CivicChain platform preferences"}
            </p>
          </div>
        </header>

        {activeTab === 'live' && (
          <section className="chat-room glass-panel">
            <div className="chat-messages">
              {messages.map((msg) => (
                <div className="message" key={msg.id}>
                  <div className={`message-avatar ${msg.isAi ? 'ai' : ''}`}>
                    {msg.isAi ? '🤖' : '👤'}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender" data-isai={msg.isAi}>{msg.sender}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <div className="message-text">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message">
                  <div className="message-avatar ai">🤖</div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">Agent AI</span>
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input">
              <span style={{ paddingLeft: '8px', fontSize: '1.2rem' }}>💬</span>
              <input 
                type="text" 
                placeholder="Type '@AgentName' to request a task..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button 
                className="btn btn-primary" 
                onClick={sendRequest}
                style={{ padding: '8px 20px', margin: '0', fontSize: '0.9rem', borderRadius: '10px' }}
              >
                Send
              </button>
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="dashboard-view">
            <h3 className="text-glow" style={{ marginBottom: '24px' }}>System Performance Overview</h3>
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-title">Total Reports Processed</div>
                <div className="stat-value">1,432</div>
                <div className="stat-trend">↑ 12% from last week</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Avg. Response Time</div>
                <div className="stat-value">1.2s</div>
                <div className="stat-trend" style={{ color: '#00ffaa' }}>Fast (Optimal)</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Active AI Agents</div>
                <div className="stat-value">{activeAgents.length}</div>
                <div className="stat-trend">Deploy more for higher concurrency</div>
              </div>
            </div>
            
            <div className="health-bar-container">
              <h4 style={{ margin: 0, color: 'var(--text-secondary)' }}>Overall Infrastructure Health</h4>
              <div className="health-bar">
                <div className="health-bar-fill"></div>
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#00ffaa', textAlign: 'right' }}>98.5% Uptime - Systems Operational</p>
            </div>
          </section>
        )}

        {activeTab === 'roster' && (
          <section className="dashboard-view">
            <h3 className="text-glow" style={{ marginBottom: '24px' }}>Deployed AI Agents</h3>
            <div className="roster-grid">
              {activeAgents.map(agent => (
                <div className="roster-card" key={agent.id}>
                  <div className="roster-avatar">🤖</div>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>{agent.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Role: {agent.role}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ffaa', borderRadius: '50%', boxShadow: '0 0 8px #00ffaa' }}></span>
                      <span style={{ color: '#00ffaa' }}>Online & Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="dashboard-view" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <h3 className="text-glow" style={{ marginBottom: '24px' }}>System Configuration</h3>
              <div className="settings-grid">
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto-Routing Engine</h4>
                    <p>Automatically delegate classified tasks to the correct department.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Strict Data Privacy Mode</h4>
                    <p>Anonymize citizen PII before sending to external LLM APIs.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Real-time SSE Sync</h4>
                    <p>Enable Server-Sent Events for live multi-agent collaboration streaming.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>

      {/* Right Panel - Active Agents */}
      <aside className="agents-panel glass-panel">
        <h3 className="panel-header text-glow">Active Agents</h3>
        
        {activeAgents.map(agent => (
          <div className="agent-card" key={agent.id}>
            <div className={`status-dot ${isTyping && activeTab === 'live' ? 'busy' : ''}`}></div>
            <div className="agent-info">
              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">{agent.role}</div>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

export default App;
