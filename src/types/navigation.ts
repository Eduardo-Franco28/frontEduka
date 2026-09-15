export type RootStackParamList = {
  WelcomeScreen: undefined;
  FirstScreen: undefined;
  AuthScreen: { isLogin: boolean };
  HomeScreen: undefined;
  SubjectsScreen: undefined;
  ProfileScreen: undefined;
  SchoolYearScreen: {
    name: string;
    email: string;
    passwordFormat: string;
  };
  TopicsScreen: {
    subjectId: number;
    subjectName: string;
  };
  // Uma tela só pra qualquer atividade: ela escolhe o componente pelo tipo
  // de cada questão.
  ActivityScreen: {
    topicId: number
  };
  ResultScreen: {
    topicId: number;
    subjectId?: number;
    subjectName?: string;
  };
  EditProfileScreen: undefined
  ChangePasswordScreen: undefined
  AccessibilityScreen: undefined
  AchievementsScreen: undefined
};