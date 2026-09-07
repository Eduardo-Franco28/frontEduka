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
  ActivityScreen2: {
    topicId: number
  };
  ActivityScreen3: {
    topicId: number
  };
  ActivityScreen4: {
    topicId: number
  };
  ActivityScreen5: {
    topicId: number
  };
  EditProfileScreen: undefined
  ChangePasswordScreen: undefined
  AccessibilityScreen: undefined
};