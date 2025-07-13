import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, FileText, Lightbulb, CheckCircle, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface AIAssistantProps {
  userData: any;
  onComplete: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  attachments?: any[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: "Hello! I'm your Carbon Credit Policy Agent. I've analyzed your project documents and I'm ready to help you refine your project plan. Let me start by reviewing what I've learned about your project.",
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'ai',
    content: "Based on your uploaded documents, I can see you're working on a carbon avoidance project. I've identified several key areas where we can optimize your approach:\n\n• **Methodology Selection**: I recommend using the VCS methodology VM0032 for your renewable energy project\n• **Baseline Establishment**: Your current baseline calculations could be enhanced with additional data points\n• **Monitoring Plan**: I can help you set up automated monitoring systems\n\nWhat would you like to focus on first?",
    timestamp: new Date(),
    suggestions: [
      "Tell me more about methodology selection",
      "Help me improve my baseline calculations",
      "Set up monitoring systems",
      "Review my project timeline"
    ]
  }
];

export function AIAssistant({ userData, onComplete }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState('initial');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'ai', suggestions?: string[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getAIResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      let suggestions: string[] = [];

      // Simple AI response logic based on keywords
      if (userInput.toLowerCase().includes('methodology')) {
        response = "Great choice! For your renewable energy project, I recommend **VCS VM0032 - Methodology for Improved Energy Efficiency Measures**. This methodology is ideal because:\n\n• It's specifically designed for renewable energy projects\n• Has streamlined verification requirements\n• Offers competitive credit prices\n• Has a proven track record with 200+ registered projects\n\nWould you like me to help you prepare the methodology application documents?";
        suggestions = ["Yes, help me prepare documents", "Show me other methodology options", "What's the timeline for approval?"];
      } else if (userInput.toLowerCase().includes('baseline')) {
        response = "Excellent! Your baseline calculations are crucial for maximizing your carbon credits. I've reviewed your current approach and here are my recommendations:\n\n• **Historical Data**: Include 3 years of historical energy consumption data\n• **Grid Emission Factor**: Update to the latest regional grid emission factors\n• **Additionality Testing**: Strengthen your financial additionality analysis\n\nI can automatically generate updated baseline calculations using the latest IPCC guidelines. Shall I proceed?";
        suggestions = ["Generate updated calculations", "Explain additionality testing", "Review historical data requirements"];
      } else if (userInput.toLowerCase().includes('monitoring')) {
        response = "Perfect! A robust monitoring plan is essential for continuous credit generation. Based on your project type, I recommend:\n\n• **IoT Sensors**: Real-time energy production monitoring\n• **Smart Meters**: Automated data collection every 15 minutes\n• **Satellite Verification**: Monthly satellite imagery for large-scale projects\n• **Blockchain Logging**: Immutable data recording for verification\n\nI can help you set up automated monitoring that integrates with carbon credit registries. Would you like to see the monitoring equipment recommendations?";
        suggestions = ["Show equipment recommendations", "Set up automated monitoring", "Explain verification requirements"];
      } else if (userInput.toLowerCase().includes('timeline')) {
        response = "Based on your project details, here's a realistic timeline:\n\n**Phase 1: Documentation (4-6 weeks)**\n• Methodology application\n• Baseline study finalization\n• Monitoring plan approval\n\n**Phase 2: Validation (8-12 weeks)**\n• Third-party validation\n• Registry review\n• Project registration\n\n**Phase 3: Implementation (Ongoing)**\n• Project implementation\n• Monitoring and reporting\n• Credit issuance (quarterly)\n\nI can help accelerate this timeline by automating documentation and pre-validating your submissions. Interested?";
        suggestions = ["Help accelerate timeline", "Show detailed project plan", "Connect with validators"];
      } else {
        response = "I understand you'd like to know more about that aspect of your project. Based on the information you've provided, I can help you with:\n\n• Optimizing your carbon credit methodology selection\n• Improving baseline calculations for maximum credits\n• Setting up automated monitoring systems\n• Accelerating the validation timeline\n• Connecting with verified carbon credit buyers\n\nWhat specific area would you like to dive deeper into?";
        suggestions = ["Methodology optimization", "Baseline improvements", "Monitoring setup", "Buyer connections"];
      }

      setIsTyping(false);
      addMessage(response, 'ai', suggestions);
      
      // Update conversation stage
      if (conversationStage === 'initial') {
        setConversationStage('engaged');
      }
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    getAIResponse(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion, 'user');
    getAIResponse(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">AI Policy Agent</h3>
              <p className="text-sm text-muted-foreground">
                {isTyping ? 'Analyzing...' : 'Ready to help'}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {messages.length - 2} insights
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="max-w-md mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <Card className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <CardContent className="p-3">
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs mr-1 mb-1"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <Card className="bg-card">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your carbon credit project..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {messages.length > 5 && (
            <Button onClick={onComplete} className="w-full" variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete AI Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}