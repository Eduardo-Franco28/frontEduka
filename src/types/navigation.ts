// As 5 telas de atividade recebem os mesmos parâmetros. O tipo existe para a
// ResultScreen saber para qual delas voltar no "Tentar de novo".
export type ActivityRouteName =
  | "ActivityScreen"
  | "ActivityScreen2"
  | "ActivityScreen3"
  | "ActivityScreen4"
  | "ActivityScreen5";

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
  ResultScreen: {
    topicId: number;
    subjectId?: number;
    subjectName?: string;
    activityRoute?: ActivityRouteName;
  };
  EditProfileScreen: undefined
  ChangePasswordScreen: undefined
  AccessibilityScreen: undefined
};