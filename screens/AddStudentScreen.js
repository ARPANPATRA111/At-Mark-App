// screens/AddStudentScreen.js
import React, { useState } from 'react';
import {
  View, StyleSheet,
  Alert,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { addStudent, getStudents } from '../services/db';

export default function AddStudentScreen({ route, navigation }) {
  const { className } = route.params;
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const handleAddStudent = async () => {
    if (studentName.trim() === '' || rollNumber.trim() === '') {
      Alert.alert('Error', 'Please enter student name and roll number.');
      return;
    }
    try {
      const existingStudents = await getStudents(className);
      if (existingStudents.find((s) => s.rollNumber === rollNumber)) {
        Alert.alert('Error', 'This roll number already exists in the class.');
        return;
      }
      await addStudent(className, { name: studentName, rollNumber });
      setStudentName('');
      setRollNumber('');
      Alert.alert('Success', 'Student added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add student.');
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
        placeholder="Roll Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        keyboardType="default"
        style={{marginTop: 10, marginBottom: 20}}
      />
      <CustomButton title="Add Student" onPress={handleAddStudent} />
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
