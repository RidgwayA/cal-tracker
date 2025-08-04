export interface User {
  id: number;
  email: string;
  name: string;
  date_of_birth: string;
  hashed_password: string;
  daily_calorie_goal: number;
}
