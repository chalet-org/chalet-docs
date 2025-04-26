import fs from "fs";
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";

const mdpages: string = "mdpages";

fs.watch(mdpages, { persistent: true, recursive: true }, async (eventType, fileName) => {
	clients.forEach((ws) => ws.send("refresh"));
});

const wss = new WebSocketServer({ port: 3201 });

const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
	clients.add(ws);
	ws.on("error", console.error);
	ws.on("close", () => clients.delete(ws));
});
