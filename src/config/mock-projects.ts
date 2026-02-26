// Mock projects data for development
export interface Project {
  id: string;
  name: string;
}

// Hebrew mock projects - this will be replaced by real Fireberry data
export const mockProjects: Project[] = [
  {
    id: 'project-001',
    name: 'אתר אינטרנט חדש',
  },
  {
    id: 'project-002',
    name: 'פיתוח אפליקציית מובייל',
  },
  {
    id: 'project-003',
    name: 'העברת מסד נתונים',
  },
  {
    id: 'project-004',
    name: 'שילוב מערכות API',
  },
  {
    id: 'project-005',
    name: 'ביקורת אבטחה',
  },
  {
    id: 'project-006',
    name: 'ייעול ביצועים',
  },
  {
    id: 'project-007',
    name: 'בדיקות משתמש',
  },
  {
    id: 'project-008',
    name: 'עדכון תיעוד',
  },
];

export const getMockProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([...mockProjects]);
    }, 300);
  });
};
