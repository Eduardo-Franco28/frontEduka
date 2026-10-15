export type RootStackParamList = {
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