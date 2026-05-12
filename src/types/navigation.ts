export type RootStackParamList = {
    FirstScreen: undefined;
    AuthScreen: {isLogin: boolean};
    HomeScreen: undefined;
    SubjectsScreen: undefined;
    ProfileScreen: undefined;
    SchoolYearScreen: {
        name: string;
        email: string;
        passwordFormat: string;
    };
}