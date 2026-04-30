import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonScreenProps {
  onBack: () => void;
}

const lessonData = [
  {
    question: "Mana yang merupakan sumber Karbohidrat utama?",
    options: ["🍚 Nasi Putih", "🍳 Telur Dadar", "💧 Air Putih", "🥑 Alpukat"],
    correctAnswer: "🍚 Nasi Putih",
  },
  {
    question: "Fungsi utama dari Protein adalah untuk...",
    options: [
      "Menambah lemak",
      "Membangun & memperbaiki otot",
      "Memberikan energi instan",
      "Mencegah haus",
    ],
    correctAnswer: "Membangun & memperbaiki otot",
  },
  {
    question: "Di NutriBlocks, makronutrien Protein diwakili oleh blok warna apa?",
    options: ["Kuning", "Merah", "Hijau", "Putih"],
    correctAnswer: "Merah",
  },
];

export function LessonScreen({ onBack }: LessonScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const totalQuestions = lessonData.length;
  const currentQuestion = lessonData[currentQuestionIndex];

  const handleClose = () => {
    // Reset state before closing
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setIsLessonFinished(false);
    onBack();
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setIsLessonFinished(true);
    }
  };

  // Gamified success screen
  if (isLessonFinished) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 p-6 items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-orange-500/20 p-8 rounded-full border-[6px] border-orange-500/30 mb-8"
        >
          <Trophy size={80} className="text-orange-500" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-white mb-2"
        >
          Luar Biasa!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-zinc-400 font-medium mb-12"
        >
          Skormu: <span className="text-orange-500 font-bold">{score}</span> / {totalQuestions}
        </motion.p>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-auto"
        >
          <Button
            onClick={handleClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Selesai
          </Button>
        </motion.div>
      </div>
    );
  }

  // Calculate progress matching Duolingo style (visually represents completed questions)
  const progressWidth = `${(currentQuestionIndex / totalQuestions) * 100}%`;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-4 py-5 shrink-0">
        <button
          onClick={handleClose}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: progressWidth }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            <h2 className="text-2xl font-bold text-white mb-8 mt-4 leading-tight">
              {currentQuestion.question}
            </h2>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                // Disallow changing answer after checking
                const disabled = isAnswerChecked;
                
                return (
                  <motion.button
                    key={idx}
                    whileHover={!disabled ? { scale: 1.02 } : {}}
                    whileTap={!disabled ? { scale: 0.98 } : {}}
                    onClick={() => !disabled && setSelectedOption(option)}
                    className={`text-left p-4 rounded-2xl border-2 transition-colors duration-200 ${
                      isSelected
                        ? "bg-orange-500/20 border-orange-500"
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`text-base font-semibold ${
                        isSelected ? "text-orange-500" : "text-white"
                      }`}
                    >
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 w-full p-4 transition-colors duration-300 border-t backdrop-blur-md z-50 ${
          isAnswerChecked
            ? isCorrect
              ? "bg-emerald-950/90 border-emerald-900"
              : "bg-red-950/90 border-red-900"
            : "bg-zinc-950/90 border-zinc-800"
        }`}
        style={{
          // Only limit width if running in desktop container
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Feedback Text */}
          {isAnswerChecked && (
            <div className="flex items-start gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {isCorrect ? (
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <X size={16} strokeWidth={3} />
                )}
              </div>
              <div>
                <h3
                  className={`text-lg font-bold ${
                    isCorrect ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isCorrect ? "Benar sekali!" : "Jawaban kurang tepat"}
                </h3>
                {!isCorrect && (
                  <p className="text-red-300 font-semibold text-sm mt-1">
                    Jawaban yang benar: {currentQuestion.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isAnswerChecked ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`w-full h-14 rounded-2xl text-lg font-bold transition-all ${
                selectedOption
                  ? "bg-orange-500 hover:bg-orange-600 text-white active:scale-[0.98] shadow-lg shadow-orange-500/20"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              Periksa
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className={`w-full h-14 rounded-2xl text-lg font-bold active:scale-[0.98] transition-all shadow-lg text-white ${
                isCorrect
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                  : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
              }`}
            >
              {isCorrect ? "Lanjut" : "Mengerti"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
