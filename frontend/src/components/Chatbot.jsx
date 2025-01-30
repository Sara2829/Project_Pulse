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
      width: '350px',  // Slightly reduced width
      height: '80vh',  // Changed to viewport-based height
      maxHeight: '600px',  // Added maximum height
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden',
      position: 'fixed',  // Added positioning
      bottom: '20px',     // Position from bottom
      right: '20px'       // Position from right
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.2rem',  // Reduced padding
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',  // Reduced padding
      background: 'linear-gradient(to bottom right, #f8f9ff, #f6f6f6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem'  // Added gap between messages
    },
    message: {
      maxWidth: '85%',  // Increased width
      padding: '0.8rem 1rem',  // Adjusted padding
      borderRadius: '1.2rem',
      lineHeight: 1.4,
      animation: 'messageFade 0.3s ease-out',
      fontSize: '0.9rem',  // Slightly reduced font size
    },
    // ... keep other styles the same ...
    footer: {
      display: 'flex',
      padding: '0.8rem',  // Reduced padding
      background: 'white',
      borderTop: '1px solid rgba(0,0,0,0.05)',
    },
    input: {
      flex: 1,
      padding: '0.7rem 1rem',  // Adjusted padding
      fontSize: '0.9rem',  // Slightly reduced font size
      // ... rest remains the same ...
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.2rem' }}>AI Assistant</h3>
        <p style={{ margin: '0.3rem 0 0', opacity: 0.9, fontSize: '0.8rem' }}>Powered by GPT</p>
      </div>
      
      <div style={styles.body}>
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
      
      <div style={styles.footer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={styles.input}
          placeholder="Type your message..."
        />
        {/* ... rest of the footer remains the same ... */}
      </div>
      
      {/* Add placeholder styling */}
      <style>{`
        ::placeholder {
          color: #a0aec0 !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}