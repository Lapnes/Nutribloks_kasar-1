import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIChatScreenProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const REKOMENDASI_PERTANYAAN = [
  "Berapa kalori harian saya?",
  "Apa itu Lemak Trans?",
  "Beri contoh protein murah",
];

function generateAIResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes("kalori")) {
    return "Halo! Kebutuhan kalori harian rata-rata remaja dan dewasa adalah 2000-2500 kkal untuk laki-laki, dan 1500-2000 kkal untuk perempuan. Pastikan kamu memenuhinya dari makanan gizi seimbang ya!";
  } else if (lowerInput.includes("lemak trans")) {
    return "Lemak trans adalah tipe lemak 'jahat' yang sering ditemukan di gorengan dan biskuit olahan. Lemak ini bisa menaikkan kolesterol. Sebaiknya ganti dengan Lemak sehat (Blok Putih) seperti alpukat!";
  } else if (lowerInput.includes("protein")) {
    return "Sumber protein (Blok Merah) yang murah meriah dan padat gizi contohnya adalah tempe (Rp 2.000) dan telur (Rp 4.000). Sangat pas buat kantong pelajar!";
  } else {
    return "Pertanyaan yang bagus! Sebagai asisten NutriBlocks, saya selalu menyarankan kamu untuk menjaga proporsi Blok Kuning, Merah, Hijau, dan Putih di piringmu setiap hari.";
  }
}

export function AIChatScreen({ onBack }: AIChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Halo! Saya AI NutriBlocks. Ada yang ingin kamu tanyakan tentang nutrisi hari ini?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md px-4 pt-5 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 shrink-0 h-10 w-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-tight">
              Tanya AI
            </h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
              Asisten Nutrisi Pribadi
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 shrink-0 scrollbar-hide">
          {REKOMENDASI_PERTANYAAN.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full px-4 py-2 text-xs font-semibold text-zinc-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex flex-col gap-4 mt-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-white rounded-tr-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="w-full p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tanya apa saja seputar nutrisi..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shrink-0 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
