// screens/AddStudentScreen.js
import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet,
  Button, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';

export default function AddStudentScreen({ route, navigation }) {
  const { className } = route.params;
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const addStudent = async () => {
    if (studentName.trim() === '' || rollNumber.trim() === '') {
      Alert.alert('Error', 'Please enter student name and roll number.');
      return;
    }
    try {
      const studentsData = await AsyncStorage.getItem(`students_${className}`);
      const students = studentsData ? JSON.parse(studentsData) : [];
      if (students.find((s) => s.rollNumber === rollNumber)) {
        Alert.alert('Error', 'This roll number already exists in the class.');
        return;
      }
      students.push({ name: studentName, rollNumber });
      await AsyncStorage.setItem(`students_${className}`, JSON.stringify(students));
      setStudentName('');
      setRollNumber('');
      alert('Student added successfully!');
      // navigation.navigate('Class', { className });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
      />
      <CustomTextInput
        placeholder="Mobile Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        keyboardType="numeric"
      />
      <CustomButton title="Add Student" onPress={addStudent} />   
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#34495e',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  
});
