// Course definitions — Computer Science revision + Digital Futures
// Used for menu navigation and student access control

export type CourseType = 'ocr-gcse' | 'ocr-alevel' | 'digital-futures';

export interface Course {
  id: CourseType;
  name: string;
  category: 'Computer Science' | 'Digital Futures';
  icon: string;
  color: string;
  description: string;
  href: string;
  badge?: string;
}

export const COURSES: Course[] = [
  // ═══════════════════════════════════════════════════════════
  // COMPUTER SCIENCE REVISION
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ocr-gcse',
    name: 'OCR GCSE (J277)',
    category: 'Computer Science',
    icon: '🟢',
    color: '#34d399',
    description: 'GCSE Computer Science - 2000+ questions, notes, flashcards',
    href: '/revision/ocr-gcse-computer-science',
    badge: 'GCSE',
  },
  {
    id: 'ocr-alevel',
    name: 'OCR A Level (H446)',
    category: 'Computer Science',
    icon: '🟢',
    color: '#34d399',
    description: 'A Level Computer Science - 3000+ questions, spec guides',
    href: '/revision/ocr-a-level-computer-science',
    badge: 'A Level',
  },

  // ═══════════════════════════════════════════════════════════
  // DIGITAL FUTURES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'digital-futures',
    name: 'Digital Futures',
    category: 'Digital Futures',
    icon: '✨',
    color: '#00d4ff',
    description: 'Year 8 & 9 curriculum - AI, Microsoft 365, digital skills',
    href: '/digital-futures',
  },
];

// Helper: get courses by category
export function getCoursesByCategory(category: 'Computer Science' | 'Digital Futures'): Course[] {
  return COURSES.filter(c => c.category === category);
}

// Helper: get course by ID
export function getCourseById(id: CourseType): Course | undefined {
  return COURSES.find(c => c.id === id);
}

// Helper: get all available course IDs
export function getAllCourseIds(): CourseType[] {
  return COURSES.map(c => c.id);
}
