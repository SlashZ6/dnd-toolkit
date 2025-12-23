



import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Character, ConnectedUser, PresencePayload } from '../types';

// This will be declared in index.html via CDN
declare const Peer: any;

const CHAT_HISTORY_KEY = 'dnd-toolkit-chat-history';
const DM_PEER_ID_KEY = 'dnd-toolkit-dm-static-id'; 

// Chunk size for splitting large messages (12KB safe limit for WebRTC data channels)
const CHUNK_SIZE = 12000;

export const useMqttChat = (character: Character | null, role: 'DM' | 'PLAYER' = 'PLAYER', targetPeerId?: string) => {
    // --- State ---
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const saved = localStorage.getItem(CHAT_HISTORY_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    
    // Connection States
    const [isPeerReady, setIsPeerReady] = useState(false); // Is my local "radio" on?
    const [isConnected, setIsConnected] = useState(false); // Am I talking to the DM?
    const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...'); // Debug text
    const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
    const [myPeerId, setMyPeerId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // --- Refs ---
    const peerRef = useRef<any>(null);
    const activeConnectionRef = useRef<any>(null); // For Player: The link to DM
    const allConnectionsRef = useRef<any[]>([]); // For DM: Links to all players
    const retryTimeoutRef = useRef<number | null>(null);
    const targetIdRef = useRef<string | undefined>(targetPeerId);
    
    // Buffer for reassembling chunks: Map<ChunkId, { total, count, parts }>
    const chunksBufferRef = useRef<Record<string, { total: number; count: number; parts: string[] }>>({});

    // Keep ref updated for the retry logic closure
    useEffect(() => {
        targetIdRef.current = targetPeerId;
        
        // If target changes and we are ready, trigger a reconnect immediately
        if (role === 'PLAYER' && isPeerReady && targetPeerId && !isConnected) {
             connectToHost(targetPeerId);
        }
    }, [targetPeerId, role, isPeerReady, isConnected]);

    // Persist chat history - LIMIT CHANGED TO 6
    useEffect(() => {
        if (messages.length > 0) {
            const last6 = messages.slice(-6);
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(last6));
        }
    }, [messages]);

    // --- Internal: Send Data Safely (with Chunking) ---
    const sendDataSafely = useCallback((conn: any, data: any) => {
        if (!conn || !conn.open) return;

        try {
            const jsonStr = JSON.stringify(data);
            const size = jsonStr.length; // Approximate bytes (utf-16 but close enough for heuristic)

            if (size < CHUNK_SIZE) {
                conn.send(data);
            } else {
                // Split into chunks
                const id = Math.random().toString(36).substring(7);
                const totalChunks = Math.ceil(size / CHUNK_SIZE);
                
                for (let i = 0; i < totalChunks; i++) {
                    const chunkData = jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                    conn.send({
                        _chunkId: id,
                        _chunkIndex: i,
                        _chunkTotal: totalChunks,
                        _data: chunkData
                    });
                }
            }
        } catch (e) {
            console.error("Error sending data:", e);
        }
    }, []);

    // --- Data Handling ---
    const processIncomingData = useCallback((data: any, sourcePeerId?: string) => {
        if (data.type === 'chat' || data.type === 'stat' || data.type === 'action' || data.type.endsWith('_share') || data.type === 'session_control' || data.type === 'ready_response' || data.type === 'inspiration_claim' || data.type === 'canvas_update') {
            const msg = data as ChatMessage;
            setMessages(prev => {
                // Prevent duplicate messages
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg].slice(-100);
            });
        } 
        else if (data.type === 'presence') {
            const payload = data.payload as PresencePayload;
            if (payload.type === 'join' || payload.type === 'update') {
                const updatedUser: ConnectedUser = { ...payload.user, _peerId: sourcePeerId };
                setConnectedUsers(prev => {
                    const filtered = prev.filter(u => u.id !== payload.user.id);
                    return [...filtered, updatedUser];
                });
            } else if (payload.type === 'leave') {
                setConnectedUsers(prev => prev.filter(u => u.id !== payload.user.id));
            }
        } else if (data.type === 'full_user_list') {
            setConnectedUsers(data.payload);
        }
    }, []);

    const handleRawIncomingData = useCallback((data: any, sourcePeerId?: string) => {
        // Check for chunk
        if (data && data._chunkId) {
            const { _chunkId, _chunkIndex, _chunkTotal, _data } = data;
            
            if (!chunksBufferRef.current[_chunkId]) {
                chunksBufferRef.current[_chunkId] = { 
                    total: _chunkTotal, 
                    count: 0, 
                    parts: new Array(_chunkTotal) 
                };
            }
            
            const buffer = chunksBufferRef.current[_chunkId];
            buffer.parts[_chunkIndex] = _data;
            buffer.count++;
            
            if (buffer.count === buffer.total) {
                // Reassemble
                const fullJson = buffer.parts.join('');
                delete chunksBufferRef.current[_chunkId];
                
                try {
                    const parsedData = JSON.parse(fullJson);
                    processIncomingData(parsedData, sourcePeerId);
                    
                    // If DM, we need to relay the FULL message (not chunks, or re-chunked) to others
                    if (role === 'DM') {
                        broadcast(parsedData, undefined, sourcePeerId); // Exclude source from broadcast? Usually broadcast excludes sender if sender is peer.
                        // Actually broadcast logic is below.
                    }
                } catch (e) {
                    console.error("Failed to parse reassembled chunks", e);
                }
            }
            return;
        }

        // Standard message
        processIncomingData(data, sourcePeerId);
        
        // If DM, relay
        if (role === 'DM') {
             broadcast(data, undefined, sourcePeerId); // Relay to others
        }
    }, [processIncomingData, role]); // Broadcast dependency added below

    // --- DM Broadcasting ---
    // Modified to support re-broadcasting received data
    const broadcast = useCallback((data: any, excludeConnectionId?: string, excludePeerId?: string) => {
        // Pre-calculate chunks if large, so we don't re-slice for every client
        const jsonStr = JSON.stringify(data);
        const size = jsonStr.length;
        let packets: any[] = [data];

        if (size >= CHUNK_SIZE) {
            packets = [];
            const id = Math.random().toString(36).substring(7);
            const totalChunks = Math.ceil(size / CHUNK_SIZE);
            for (let i = 0; i < totalChunks; i++) {
                packets.push({
                    _chunkId: id,
                    _chunkIndex: i,
                    _chunkTotal: totalChunks,
                    _data: jsonStr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
                });
            }
        }

        allConnectionsRef.current.forEach(conn => {
            // Check exclusion criteria
            if (conn.open && conn.connectionId !== excludeConnectionId && conn.peer !== excludePeerId) {
                packets.forEach(p => conn.send(p));
            }
        });
    }, []);

    // --- Connect Logic (Player) ---
    const connectToHost = useCallback((hostId: string) => {
        if (!peerRef.current || !isPeerReady) {
            console.log("Peer not ready yet, skipping connect attempt.");
            return;
        }
        
        // If we are already connecting or connected to THIS host, skip
        if (activeConnectionRef.current && activeConnectionRef.current.peer === hostId && activeConnectionRef.current.open) {
             return;
        }

        if (activeConnectionRef.current) {
            activeConnectionRef.current.close();
        }

        setConnectionStatus(`Searching for Campaign: ${hostId}...`);
        
        const conn = peerRef.current.connect(hostId, {
            reliable: true,
            serialization: 'json'
        });

        activeConnectionRef.current = conn;

        conn.on('open', () => {
            console.log("SUCCESS: Connected to DM");
            setConnectionStatus('Connected');
            setIsConnected(true);
            setError(null);
            
            // Clear any retry loop
            if (retryTimeoutRef.current) {
                window.clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }

            // Send my details immediately
            if (character) {
                sendDataSafely(conn, {
                    type: 'presence',
                    payload: {
                        type: 'join',
                        user: {
                            id: character.id,
                            name: character.name,
                            abilityScores: character.abilityScores,
                            crest: character.crest
                        }
                    }
                });
            }
        });

        conn.on('data', (data: any) => handleRawIncomingData(data, hostId));

        conn.on('close', () => {
            console.log("Connection closed.");
            setIsConnected(false);
            setConnectionStatus('Connection lost. Retrying...');
            activeConnectionRef.current = null;
            setConnectedUsers([]);
            retryConnection();
        });

        conn.on('error', (err: any) => {
            console.error("Connection Error:", err);
            setIsConnected(false);
            setConnectionStatus('Connection error.');
            retryConnection();
        });

    }, [character, isPeerReady, handleRawIncomingData, sendDataSafely]);

    const retryConnection = useCallback(() => {
        if (role === 'DM') return;
        
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        
        // Retry every 3 seconds
        retryTimeoutRef.current = window.setTimeout(() => {
            if (targetIdRef.current && peerRef.current && !peerRef.current.destroyed) {
                console.log("...Retrying connection...");
                connectToHost(targetIdRef.current);
            }
        }, 3000);
    }, [role, connectToHost]);


    // --- Peer Initialization (Lifecycle) ---
    useEffect(() => {
        // Prevent double init in strict mode
        if (peerRef.current) return;

        const initializePeer = (idToAttempt?: string) => {
            console.log(`Initializing Peer as ${role} with ID attempt: ${idToAttempt || 'Auto (Random)'}`);
            setConnectionStatus('Initializing Network...');

            const peer = new Peer(idToAttempt, {
                debug: 1, // 0=none, 1=errors, 2=warnings, 3=all
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                }
            });

            peer.on('open', (id: string) => {
                console.log('PeerJS ID Open:', id);
                setMyPeerId(id);
                setIsPeerReady(true);
                peerRef.current = peer;

                if (role === 'DM') {
                    // If we successfully opened with an ID, save it so we try to keep it next time
                    localStorage.setItem(DM_PEER_ID_KEY, id);
                    setConnectionStatus('Online (Hosting)');
                    setIsConnected(true);
                } else {
                    setConnectionStatus('Ready to Connect');
                    // If we already have a target, try connecting now
                    if (targetIdRef.current) {
                        connectToHost(targetIdRef.current);
                    }
                }
            });

            peer.on('connection', (conn: any) => {
                // Incoming connection handling
                console.log("Incoming connection from:", conn.peer);
                
                conn.on('open', () => {
                    // Add to list, removing old stale connections from same peer if any
                    allConnectionsRef.current = allConnectionsRef.current.filter(c => c.peer !== conn.peer);
                    allConnectionsRef.current.push(conn);
                    
                    // If I am DM, send the full user list to this new person immediately
                    if (role === 'DM' && character) {
                        sendDataSafely(conn, {
                            type: 'full_user_list',
                            payload: [
                                { id: character.id, name: "DM", abilityScores: character.abilityScores },
                                ...connectedUsers
                            ]
                        });
                    }
                });

                conn.on('data', (data: any) => {
                    // Pass source peer ID to handleRawIncomingData
                    // Logic inside handleRawIncomingData handles chunk reassembly AND broadcasting if DM
                    handleRawIncomingData(data, conn.peer); 
                });

                conn.on('close', () => {
                    console.log("Peer closed connection:", conn.peer);
                    allConnectionsRef.current = allConnectionsRef.current.filter(c => c !== conn);
                    // Update connected users list by removing the disconnected peer
                    // Note: This relies on the peer ID being associated with the user, which we mapped on join
                    setConnectedUsers(prev => prev.filter(u => u._peerId !== conn.peer));
                });
                
                conn.on('error', (err: any) => console.error("Conn Error", err));
            });

            peer.on('error', (err: any) => {
                console.error("Peer Error:", err.type, err);
                
                if (err.type === 'unavailable-id') {
                    if (role === 'DM') {
                        console.warn("DM ID taken. Regenerating...");
                        // Collision! The stored ID is in use. Generate a new one and retry.
                        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
                        const newId = `CAMPAIGN-${randomPart}`;
                        
                        // We must destroy this dead instance before trying again
                        peer.destroy();
                        
                        // Retry with new ID
                        initializePeer(newId);
                    } else {
                        // Players shouldn't hit this as they use undefined IDs, but just in case
                        setError("ID Conflict. Please refresh.");
                    }
                } else if (err.type === 'peer-unavailable') {
                    // This is the specific error when looking for a DM who isn't there yet
                    setConnectionStatus('Campaign not found (yet)...');
                    retryConnection();
                } else if (err.type === 'network') {
                    setConnectionStatus('Network Error. Retrying...');
                } else {
                    setError(err.type || "Unknown Error");
                }
            });

            peer.on('disconnected', () => {
                console.log("Peer disconnected from server.");
                setConnectionStatus('Reconnecting to server...');
                // PeerJS auto-reconnect logic isn't perfect, manual nudge helps
                setTimeout(() => {
                    if(peer && !peer.destroyed) peer.reconnect();
                }, 2000);
            });
        };

        // Start Process
        if (role === 'DM') {
            // DM: Try stored ID or generate new
            let storedDmId = localStorage.getItem(DM_PEER_ID_KEY);
            if (!storedDmId) {
                const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
                storedDmId = `CAMPAIGN-${randomPart}`;
            }
            initializePeer(storedDmId);
        } else {
            // Player: Use undefined to let server assign a random unique ID (Prevents ID taken errors)
            initializePeer(undefined);
        }

        return () => {
            // Cleanup on unmount (rare for App root)
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        };
    }, [role]); // Only re-run if role changes

    const publishMessage = (type: ChatMessage['type'], payload: ChatMessage['payload'], targetPeerId?: string) => {
        if (!character) return;

        const msg: ChatMessage = {
            id: `${Date.now()}-${Math.random()}`,
            user: character.name,
            timestamp: Date.now(),
            type,
            payload,
            targetId: targetPeerId // Mark msg object with target if private
        };

        // 1. Update local
        setMessages(prev => [...prev, msg].slice(-100));

        // 2. Send to network
        if (role === 'DM') {
            if (targetPeerId) {
                // Private message from DM
                const targetConn = allConnectionsRef.current.find(c => c.peer === targetPeerId);
                if (targetConn && targetConn.open) {
                    sendDataSafely(targetConn, msg);
                } else {
                    console.warn(`Target peer ${targetPeerId} not found or closed.`);
                }
            } else {
                // Public broadcast
                broadcast(msg);
            }
        } else {
            // Player sending to DM
            if (activeConnectionRef.current && activeConnectionRef.current.open) {
                sendDataSafely(activeConnectionRef.current, msg);
            } else {
                console.warn("Cannot send, not connected to DM");
            }
        }
    };

    return { 
        messages, 
        publishMessage, 
        isConnected, 
        connectedUsers, 
        myPeerId, 
        error,
        connectionStatus // Export this so UI can show "Searching..." vs "Connected"
    };
};
