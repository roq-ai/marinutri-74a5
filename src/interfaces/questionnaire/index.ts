import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface QuestionnaireInterface {
  id?: string;
  questions: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface QuestionnaireGetQueryInterface extends GetQueryInterface {
  id?: string;
  questions?: string;
  user_id?: string;
}
