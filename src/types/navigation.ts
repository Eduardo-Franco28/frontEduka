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
  ActivityScreen: {
    topicId: number
  };
};
