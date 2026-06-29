import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { HelpCircle } from 'lucide-react';
import type { FlatQuestion } from '../../lib/stats';

interface Props {
  question: FlatQuestion;
  flipped: boolean;
  onFlip: () => void;
}

export default function FocusFlashcard({ question, flipped, onFlip }: Props) {
  return (
    <div className="h-80 w-full [perspective:1200px] sm:h-96">
      <motion.div
        className="relative h-full w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={onFlip}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center [backface-visibility:hidden] light:border-slate-200 light:bg-white">
          <HelpCircle className="h-6 w-6 text-cyan-400" />
          <p className="text-lg font-medium text-slate-100 light:text-slate-800">{question.text}</p>
          <span className="text-xs text-slate-500">
            {question.moduleEmoji} {question.moduleTitle} · click or press space to reveal the answer
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col rounded-3xl border border-white/10 bg-slate-900/90 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] light:border-slate-200 light:bg-white/95">
          <span className="mb-2 flex-shrink-0 text-center text-[11px] text-slate-500">
            {question.moduleEmoji} {question.moduleTitle} · model answer
          </span>
          <div
            className="markdown-body flex-1 overflow-y-auto text-sm text-slate-300 light:text-slate-700 [&_strong]:text-cyan-300 light:[&_strong]:text-cyan-700"
            onClick={(e) => e.stopPropagation()}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {question.answer}
            </ReactMarkdown>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
