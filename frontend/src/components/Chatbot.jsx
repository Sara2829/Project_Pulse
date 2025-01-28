import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, 
          { role: 'bot', content: 'Let me check that for you!' }
        ]);
      }, 800);
      
      setInput('');
    }
  };

  const styles = {
    container: {
      width: '380px',
      height: '600px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      background: 'linear-gradient(to bottom right, #f8f9ff, #f6f6f6)',
    },
    messagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    message: {
      maxWidth: '75%',
      padding: '0.8rem 1.2rem',
      borderRadius: '1.2rem',
      lineHeight: 1.4,
      animation: 'messageFade 0.3s ease-out',
      fontSize: '0.95rem',
    },
    userMessage: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      alignSelf: 'flex-end',
      borderRadius: '1.2rem 0.2rem 1.2rem 1.2rem',
      boxShadow: '0 2px 5px rgba(102, 126, 234, 0.3)',
    },
    botMessage: {
      background: 'white',
      color: '#2d3748',
      alignSelf: 'flex-start',
      borderRadius: '0.2rem 1.2rem 1.2rem 1.2rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    footer: {
      display: 'flex',
      padding: '1rem',
      background: 'white',
      borderTop: '1px solid rgba(0,0,0,0.05)',
    },
    input: {
      flex: 1,
      padding: '0.8rem 1.2rem',
      border: 'none',
      borderRadius: '2rem',
      background: '#f8f9ff',
      fontSize: '0.95rem',
      marginRight: '0.8rem',
      transition: 'all 0.2s',
      outline: 'none',
      color: '#1a1a1a', // Explicit black text color
    },
    sendButton: {
      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.3rem' }}>AI Assistant</h3>
        <p style={{ margin: '0.3rem 0 0', opacity: 0.9, fontSize: '0.85rem' }}>Powered by GPT</p>
      </div>
      
      <div style={styles.body}>
        <div style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(message.role === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.footer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{
            ...styles.input,
            placeholder: { color: '#a0aec0' },
          }}
          placeholder="Type your message..."
        />
        <button
          style={styles.sendButton}
          onClick={handleSendMessage}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.background = 'linear-gradient(135deg, #6d28d9, #4338ca)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.background = 'linear-gradient(135deg, #7c3aed, #4f46e5)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}