// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import DashboardScreen from '../screens/DashboardScreen';
import AddClassScreen from '../screens/AddClassScreen';
import ClassScreen from '../screens/ClassScreen';
import AddStudentScreen from '../screens/AddStudentScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';
import StudentAttendanceScreen from '../screens/StudentAttendanceScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'At-Mark' }}
        />
        <Stack.Screen
          name="AddClass"
          component={AddClassScreen}
          options={{ title: 'Add Class' }}
        />
        <Stack.Screen
          name="Class"
          component={ClassScreen}
          options={({ route }) => ({ title: route.params.className })}
        />
        <Stack.Screen
          name="AddStudent"
          component={AddStudentScreen}
          options={{ title: 'Add Student' }}
        />
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{ title: 'Attendance' }}
        />
        <Stack.Screen
          name="AttendanceHistory"
          component={AttendanceHistoryScreen}
          options={{ title: 'Attendance History' }}
        />
        <Stack.Screen
          name="StudentAttendance"
          component={StudentAttendanceScreen}
          options={{ title: 'Student Attendance' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
