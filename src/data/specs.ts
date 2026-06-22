// Exam board specifications — OCR GCSE and A Level Computer Science

export interface TopicSpec {
  id: string;
  name: string;
  qCount: number;
  board: 'ocr-gcse' | 'ocr-alevel';
  difficulty: 'Foundation' | 'Higher' | 'A-Level';
}

export const SPECS: TopicSpec[] = [
  // OCR GCSE (J277)
  { id: 'ocrg-1', name: 'Thinking Computationally', qCount: 45, board: 'ocr-gcse', difficulty: 'Foundation' },
  { id: 'ocrg-2', name: 'Computational Thinking Concepts', qCount: 52, board: 'ocr-gcse', difficulty: 'Foundation' },
  { id: 'ocrg-3', name: 'Data', qCount: 48, board: 'ocr-gcse', difficulty: 'Foundation' },
  { id: 'ocrg-4', name: 'Programming', qCount: 120, board: 'ocr-gcse', difficulty: 'Higher' },
  { id: 'ocrg-5', name: 'Computing Systems', qCount: 65, board: 'ocr-gcse', difficulty: 'Foundation' },
  { id: 'ocrg-6', name: 'Security and Networks', qCount: 55, board: 'ocr-gcse', difficulty: 'Foundation' },

  // OCR A Level (H446)
  { id: 'ocr-1', name: 'Computational Thinking', qCount: 60, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-2', name: 'Fundamentals of Programming', qCount: 150, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-3', name: 'Advanced Programming', qCount: 80, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-4', name: 'Data Structures', qCount: 90, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-5', name: 'Computer Architecture', qCount: 75, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-6', name: 'Networking', qCount: 65, board: 'ocr-alevel', difficulty: 'A-Level' },
  { id: 'ocr-7', name: 'Security', qCount: 55, board: 'ocr-alevel', difficulty: 'A-Level' },
];
