
import { useState, useEffect, useRef } from 'react';
import { ChatMessage, Character, ConnectedUser, PresencePayload } from '../types';

// This will be declared in index.html via CDN
declare const mqtt: any;

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const CHAT_TOPIC = 'dnd-players-toolkit/campaign-chat-v2';
const PRESENCE_TOPIC = 'dnd-players-toolkit/campaign-presence-v2';
const CHAT_HISTORY_KEY = 'dnd-toolkit-chat-history';


export const useMqttChat = (character: Character | null) => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const saved = localStorage.getItem(CHAT_HISTORY_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load chat history from localStorage", e);
            return [];
        }
    });
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<Record<string, ConnectedUser>>({});
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (messages.length > 0) {
        const last12 = messages.slice(-12);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(last12));
    }
  }, [messages]);

  useEffect(() => {
    if (!character || !character.name) return;

    if (typeof mqtt === 'undefined') {
        console.error("MQTT library is not available.");
        setIsConnected(false);
        return;
    }

    const myUserData: ConnectedUser = {
        id: character.id,
        name: character.name,
        abilityScores: character.abilityScores,
        notes: character.notes,
        crest: character.crest,
    };
    
    const lwt: PresencePayload = {
        type: 'leave',
        user: myUserData
    };

    try {
      if (!clientRef.current) {
        clientRef.current = mqtt.connect(MQTT_BROKER_URL, {
            will: {
                topic: PRESENCE_TOPIC,
                payload: JSON.stringify(lwt),
                qos: 1,
                retain: false,
            }
        });

        clientRef.current.on('connect', () => {
          setIsConnected(true);
          clientRef.current.subscribe([CHAT_TOPIC, PRESENCE_TOPIC], (err: Error | null) => {
            if (err) {
              console.error('Subscription error:', err);
            } else {
               const joinMessage: PresencePayload = { type: 'join', user: myUserData };
               clientRef.current.publish(PRESENCE_TOPIC, JSON.stringify(joinMessage));
            }
          });
        });

        clientRef.current.on('message', (topic: string, payload: any) => {
          if (topic === CHAT_TOPIC) {
            try {
              const messageData = JSON.parse(payload.toString());
              const newMessage: ChatMessage = {
                id: `${messageData.timestamp}-${Math.random()}`,
                ...messageData,
              };
              setMessages(prev => [...prev, newMessage].slice(-100));
            } catch (e) {
              console.error('Error parsing chat message:', e);
            }
          } else if (topic === PRESENCE_TOPIC) {
              try {
                const presenceMsg: PresencePayload = JSON.parse(payload.toString());
                const { type, user } = presenceMsg;

                // When another user joins, publish our own presence so they see us.
                if (type === 'join' && user.id !== myUserData.id) {
                    const myUpdateMessage: PresencePayload = { type: 'update', user: myUserData };
                    clientRef.current.publish(PRESENCE_TOPIC, JSON.stringify(myUpdateMessage));
                }

                setConnectedUsers(prev => {
                    const newUsers = { ...prev };
                    if (type === 'join' || type === 'update') {
                        newUsers[user.id] = user;
                    } else if (type === 'leave') {
                        delete newUsers[user.id];
                    }
                    return newUsers;
                });
              } catch (e) {
                  console.error('Error parsing presence message:', e);
              }
          }
        });

        clientRef.current.on('error', (err: Error) => {
          console.error('MQTT Client Error:', err);
          setIsConnected(false);
          clientRef.current.end();
        });
        
        clientRef.current.on('close', () => {
            setIsConnected(false);
            setConnectedUsers({});
        });
      }
    } catch (e) {
        console.error("MQTT connection failed to initialize.", e);
        setIsConnected(false);
    }
    
    return () => {
      if (clientRef.current) {
        if (clientRef.current.connected) {
            clientRef.current.publish(PRESENCE_TOPIC, JSON.stringify(lwt), () => {
                clientRef.current.end(true);
            });
        } else {
           clientRef.current.end(true);
        }
        clientRef.current = null;
        setIsConnected(false);
      }
    };
  }, [character]);

  const publishMessage = (type: ChatMessage['type'], payload: ChatMessage['payload']) => {
    if (clientRef.current && clientRef.current.connected && character) {
      const fullMessage: Omit<ChatMessage, 'id'> = {
        user: character.name,
        timestamp: Date.now(),
        type,
        payload
      };
      clientRef.current.publish(CHAT_TOPIC, JSON.stringify(fullMessage));
    }
  };

  return { messages, publishMessage, isConnected, connectedUsers: Object.values(connectedUsers) };
};
