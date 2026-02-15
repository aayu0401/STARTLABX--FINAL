import { createServer } from "http";
import "dotenv/config";
import next from "next";
import { Server } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";

// Polyfill localStorage for SSR safety
try {
    // Force delete potential broken native implementation
    try {
        delete (global as any).localStorage;
    } catch (e) { }

    if (typeof localStorage === "undefined" || localStorage === null) {
        (global as any).localStorage = {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
            length: 0,
            key: () => null,
        };
    } else {
        // If it exists, try to fix it if needed
        const _localStorage = (global as any).localStorage;
        try {
            if (typeof _localStorage.getItem !== 'function') {
                _localStorage.getItem = () => null;
            }
            if (typeof _localStorage.setItem !== 'function') {
                _localStorage.setItem = () => { };
            }
            if (typeof _localStorage.removeItem !== 'function') {
                _localStorage.removeItem = () => { };
            }
            if (typeof _localStorage.clear !== 'function') {
                _localStorage.clear = () => { };
            }
        } catch (e) {
            console.warn("Could not patch existing localStorage:", e);
        }
    }
} catch (e) {
    console.warn("Could not polyfill localStorage:", e);
}

const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store active users and their status
const activeUsers = new Map<string, { socketId: string; status: string; lastSeen: Date }>();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        transports: ['websocket', 'polling']
    });

    // Make IO accessible globally for Next.js API routes
    (global as any).io = io;

    io.on("connection", (socket) => {
        console.log("✅ Client connected:", socket.id);

        // ============================================
        // CHAT & MESSAGING
        // ============================================

        socket.on("join_conversation", (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`💬 Socket ${socket.id} joined conversation ${conversationId}`);
        });

        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`👋 Socket ${socket.id} left conversation ${conversationId}`);
        });

        socket.on("send_message", (data) => {
            const room = `conversation:${data.conversationId}`;
            io.to(room).emit("receive_message", {
                ...data,
                timestamp: new Date(),
            });
            console.log(`📨 Message sent to ${room}`);
        });

        socket.on("typing", (data) => {
            const room = `conversation:${data.conversationId}`;
            socket.to(room).emit("typing", {
                userId: data.userId,
                isTyping: data.isTyping,
                conversationId: data.conversationId,
            });
        });

        // ============================================
        // FEED & POSTS
        // ============================================

        socket.on("join_feed", (feedType = "global") => {
            socket.join(`feed:${feedType}`);
            console.log(`📰 Socket ${socket.id} joined ${feedType} feed`);
        });

        socket.on("leave_feed", (feedType) => {
            socket.leave(`feed:${feedType}`);
        });

        socket.on('new_post', (data) => {
            socket.broadcast.emit('receive_post', data);
            console.log(`📝 New post broadcast to feed`);
        });

        socket.on("post_liked", (data) => {
            io.to("feed:global").emit("new_like", {
                postId: data.postId,
                userId: data.userId,
                timestamp: new Date(),
            });
        });

        socket.on("post_commented", (data) => {
            io.to("feed:global").emit("new_comment", {
                postId: data.postId,
                comment: data.comment,
                timestamp: new Date(),
            });
        });

        // ============================================
        // NOTIFICATIONS
        // ============================================

        socket.on("subscribe_notifications", (userId) => {
            socket.join(`notifications:${userId}`);
            console.log(`🔔 Socket ${socket.id} subscribed to notifications for user ${userId}`);
        });

        socket.on("unsubscribe_notifications", (userId) => {
            socket.leave(`notifications:${userId}`);
        });

        socket.on("send_notification", (data) => {
            io.to(`notifications:${data.userId}`).emit("new_notification", {
                ...data,
                timestamp: new Date(),
            });
        });

        // ============================================
        // ANALYTICS
        // ============================================

        socket.on("subscribe_analytics", (dashboardId) => {
            socket.join(`analytics:${dashboardId}`);
            console.log(`📊 Socket ${socket.id} subscribed to analytics ${dashboardId}`);
        });

        socket.on("unsubscribe_analytics", (dashboardId) => {
            socket.leave(`analytics:${dashboardId}`);
        });

        socket.on("analytics_event", (data) => {
            io.to(`analytics:${data.dashboardId}`).emit("analytics_update", {
                ...data,
                timestamp: new Date(),
            });
        });

        // ============================================
        // USER PRESENCE
        // ============================================

        socket.on("user_online", (data) => {
            const { userId, status } = data;
            activeUsers.set(userId, {
                socketId: socket.id,
                status: status || 'online',
                lastSeen: new Date(),
            });

            // Broadcast to all clients
            io.emit("user_online", {
                userId,
                status: status || 'online',
                timestamp: new Date(),
            });
            console.log(`👤 User ${userId} is now ${status || 'online'}`);
        });

        socket.on("update_presence", (data) => {
            const { userId, status } = data;
            if (activeUsers.has(userId)) {
                activeUsers.set(userId, {
                    ...activeUsers.get(userId)!,
                    status,
                    lastSeen: new Date(),
                });

                io.emit("user_status_changed", {
                    userId,
                    status,
                    timestamp: new Date(),
                });
            }
        });

        // ============================================
        // DISCONNECT
        // ============================================

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);

            // Find and remove user from active users
            for (const [userId, userData] of activeUsers.entries()) {
                if (userData.socketId === socket.id) {
                    activeUsers.delete(userId);
                    io.emit("user_offline", {
                        userId,
                        timestamp: new Date(),
                    });
                    console.log(`👤 User ${userId} went offline`);
                    break;
                }
            }
        });

        // ============================================
        // HEARTBEAT
        // ============================================

        socket.on("ping", () => {
            socket.emit("pong", { timestamp: new Date() });
        });
    });

    // Periodic cleanup of inactive users
    setInterval(() => {
        const now = new Date();
        for (const [userId, userData] of activeUsers.entries()) {
            const timeDiff = now.getTime() - userData.lastSeen.getTime();
            if (timeDiff > 5 * 60 * 1000) { // 5 minutes
                activeUsers.delete(userId);
                io.emit("user_offline", {
                    userId,
                    timestamp: now,
                });
            }
        }
    }, 60000); // Check every minute

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`🚀 Server ready on http://${hostname}:${port}`);
            console.log(`⚡ WebSocket server active`);
            console.log(`📡 Real-time features enabled`);
        });
});
