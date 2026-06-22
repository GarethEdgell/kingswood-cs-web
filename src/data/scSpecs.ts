// Specification checklist statements per topic

export interface SpecChecklist {
  [key: string]: string[];
}

export const SC_SPECS: Record<string, SpecChecklist> = {
  'ocrgcse': {
    'ocrg-1': ['Can describe computational thinking', 'Understands abstraction and decomposition'],
    'ocrg-2': ['Can apply algorithms', 'Understands efficiency and optimization'],
    'ocrg-3': ['Can represent data', 'Understands number systems'],
    'ocrg-4': ['Can write programs', 'Can debug code'],
    'ocrg-5': ['Understands systems architecture', 'Understands Operating Systems'],
    'ocrg-6': ['Can identify threats', 'Understands cybersecurity measures'],
  },
  'ocralevel': {
    'ocr-1': ['Computational thinking in depth', 'Problem solving strategies'],
    'ocr-2': ['Programming paradigms', 'Algorithm design and analysis'],
    'ocr-3': ['Advanced data structures', 'Complexity analysis'],
    'ocr-4': ['Trees and graphs', 'Hash tables and searching'],
    'ocr-5': ['Processor architecture', 'Memory systems'],
    'ocr-6': ['Network protocols', 'Network design'],
    'ocr-7': ['Cryptography', 'Risk assessment'],
  },
};
