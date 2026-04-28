import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Erro ao responder 😢",
          sender: "ai",
        },
      ]);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        marginLeft: 2,
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Paper
          elevation={3}
          sx={{
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              bgcolor: "#4F46E5",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon />
            <Typography fontWeight={600}>ChatBox • Online</Typography>
          </Box>

          {/* MESSAGES */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  {msg.sender === "ai" && (
                    <Avatar sx={{ bgcolor: "#4F46E5" }}>
                      <SmartToyIcon />
                    </Avatar>
                  )}

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: "70%",
                      bgcolor: msg.sender === "user" ? "#DCFCE7" : "white",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>

                  {msg.sender === "user" && (
                    <Avatar sx={{ bgcolor: "#22C55E" }}>
                      <PersonIcon />
                    </Avatar>
                  )}
                </Stack>
              </Box>
            ))}

            {/* ÂNCORA DO SCROLL */}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #E5E7EB",
              bgcolor: "white",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <IconButton
                onClick={handleSend}
                sx={{
                  bgcolor: "#4F46E5",
                  color: "white",
                  "&:hover": { bgcolor: "#4338CA" },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
