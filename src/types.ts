export type Subject = 'Math' | 'Science' | 'History' | 'English' | 'Art' | 'Geography' | 'General' | 'CareerTech' | 'French' | 'RME' | 'Computing' | 'SocialStudies' | 'AsanteTwi';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SubjectInfo {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  description: string;
}
