import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import BaseScreen from '../components/BaseScreen';
import CustomButton from '../components/CustomButton';
import { colors, sizes } from '../theme';

const StudentItem = React.memo(({ item, onEdit, onDelete, onPress }) => (
  <View style={styles.studentItem}>
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={onPress}
    >
      <Text style={styles.studentText}>{item.name}</Text>
      <Text style={styles.rollNumber}>Roll No: {item.rollNumber}</Text>
    </TouchableOpacity>
    <View style={styles.actionButtons}>
      <CustomButton
        onPress={onEdit}
        style={styles.editButton}
        iconName="edit"
      />
      <CustomButton
        onPress={onDelete}
        style={styles.deleteButton}
        iconName="delete"
      />
    </View>
  </View>
));

export default function ClassScreen({ route, navigation }) {
  const { className } = route.params;
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newName, setNewName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const sortedStudents = [...students].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  useEffect(() => {
    navigation.setOptions({ title: className });
    const loadStudents = async () => {
      try {
        const studentsData = await AsyncStorage.getItem(`students_${className}`);
        if (studentsData) setStudents(JSON.parse(studentsData));
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadStudents);
    return unsubscribe;
  }, [navigation, className]);

  const handleDeleteStudent = useCallback(async (rollNumber) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedStudents = students.filter(
                (student) => student.rollNumber !== rollNumber
              );
              setStudents(updatedStudents);
              await AsyncStorage.setItem(
                `students_${className}`,
                JSON.stringify(updatedStudents)
              );
              Alert.alert('Success', 'Student deleted successfully.');
            } catch (error) {
              console.error('Error deleting student:', error);
              Alert.alert('Error', 'Failed to delete student.');
            }
          },
        },
      ]
    );
  }, [className, students]);

  const handleEditButton = useCallback((student) => {
    setSelectedStudent(student);
    setNewName(student.name);
    setModalVisible(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (newName.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }

    try {
      const updatedStudents = students.map((student) =>
        student.rollNumber === selectedStudent.rollNumber
          ? { ...student, name: newName }
          : student
      );
      setStudents(updatedStudents);
      await AsyncStorage.setItem(
        `students_${className}`,
        JSON.stringify(updatedStudents)
      );
      setModalVisible(false);
      Alert.alert('Success', 'Student name updated successfully.');
    } catch (error) {
      console.error('Failed to update student:', error);
      Alert.alert('Error', 'Could not update the student name.');
    }
  }, [className, newName, selectedStudent, students]);

  const handleStudentPress = useCallback((student) => {
    navigation.navigate('StudentAttendance', { className, student });
  }, [className, navigation]);

  const renderItem = useCallback(({ item }) => (
    <StudentItem
      item={item}
      onPress={() => handleStudentPress(item)}
      onEdit={() => handleEditButton(item)}
      onDelete={() => handleDeleteStudent(item.rollNumber)}
    />
  ), [handleStudentPress, handleEditButton, handleDeleteStudent]);

  const exportAttendanceHistory = async () => {
    setIsExporting(true);
    try {
      const studentsData = await AsyncStorage.getItem(`students_${className}`);
      if (!studentsData) {
        Alert.alert('No Data', 'No student data available.');
        setIsExporting(false);
        return;
      }
  
      const studentsList = JSON.parse(studentsData);
      const keys = await AsyncStorage.getAllKeys();
      const attendanceKeys = keys.filter((key) =>
        key.startsWith(`attendance_${className}_`)
      );

      if (attendanceKeys.length === 0) {
        Alert.alert('No Data', 'No attendance history to export.');
        setIsExporting(false);
        return;
      }

      // Process attendance data
      const attendanceData = {};
      const uniqueDates = new Set();

      for (const key of attendanceKeys) {
        const date = key.replace(`attendance_${className}_`, '');
        uniqueDates.add(date);
        const attendanceRecord = await AsyncStorage.getItem(key);
        const attendance = JSON.parse(attendanceRecord || '{}');

        studentsList.forEach((student) => {
          if (!attendanceData[student.rollNumber]) {
            attendanceData[student.rollNumber] = {
              name: student.name,
              rollNumber: student.rollNumber,
              attendance: {}
            };
          }
          attendanceData[student.rollNumber].attendance[date] = attendance[student.rollNumber] ? 'P' : 'A';
        });
      }

      const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));
      const MAX_DATES_PER_PAGE = 18;
      const MAX_STUDENTS_PER_PAGE = 50;
      const totalDatePages = Math.ceil(sortedDates.length / MAX_DATES_PER_PAGE);
      const totalStudentPages = Math.ceil(studentsList.length / MAX_STUDENTS_PER_PAGE);

      let htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
            h2 { text-align: center; margin-bottom: 10px; font-size: 14px; }
            table { 
              width: 100%; 
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 10px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 6px; 
              text-align: center;
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold;
              position: sticky;
              top: 0;
            }
            .P { background-color: #d4edda; }
            .A { background-color: #f8d7da; }
            .student-name { text-align: left; width: 150px; }
            .roll-number { text-align: center; width: 80px; }
            .summary { 
              margin-top: 20px;
              font-size: 12px;
              page-break-before: avoid;
            }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
          <h1>${className} - Attendance Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()}</h2>
      `;

      for (let datePage = 0; datePage < totalDatePages; datePage++) {
        const startDateIdx = datePage * MAX_DATES_PER_PAGE;
        const endDateIdx = Math.min(startDateIdx + MAX_DATES_PER_PAGE, sortedDates.length);
        const datesForPage = sortedDates.slice(startDateIdx, endDateIdx);

        const studentEntries = Object.values(attendanceData);
        for (let studentPage = 0; studentPage < totalStudentPages; studentPage++) {
          const startStudentIdx = studentPage * MAX_STUDENTS_PER_PAGE;
          const endStudentIdx = Math.min(startStudentIdx + MAX_STUDENTS_PER_PAGE, studentEntries.length);
          const studentsForPage = studentEntries.slice(startStudentIdx, endStudentIdx);

          htmlContent += `
            <table>
              <thead>
                <tr>
                  <th class="student-name">Student Name</th>
                  <th class="roll-number">Roll No.</th>
          `;

          datesForPage.forEach(date => {
            htmlContent += `<th>${new Date(date).toLocaleDateString()}</th>`;
          });

          htmlContent += `
                </tr>
              </thead>
              <tbody>
          `;

          studentsForPage.forEach(student => {
            htmlContent += `
              <tr>
                <td class="student-name">${student.name}</td>
                <td class="roll-number">${student.rollNumber}</td>
            `;

            datesForPage.forEach(date => {
              const status = student.attendance[date] || '';
              htmlContent += `<td class="${status}">${status}</td>`;
            });

            htmlContent += `</tr>`;
          });

          htmlContent += `
              </tbody>
            </table>
          `;

          if (studentPage < totalStudentPages - 1 || datePage < totalDatePages - 1) {
            htmlContent += `<div class="page-break"></div>`;
          }
        }
      }

      htmlContent += `
          <div class="summary">
            <p>Total Students: ${studentsList.length}</p>
            <p>Total Attendance Days: ${sortedDates.length}</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 842,
        height: 1190,
        base64: false
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share Attendance PDF',
          UTI: '.pdf'
        });
      } else {
        Alert.alert('Export Successful', `PDF saved at: ${uri}`);
      }
    } catch (error) {
      console.error('Error exporting attendance:', error);
      Alert.alert('Error', 'Failed to export attendance.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <BaseScreen>
      <Text style={styles.studentNumber}>Number of Students: {sortedStudents.length}</Text>
      <FlatList
        data={sortedStudents}
        keyExtractor={(item) => item.rollNumber.toString()}
        renderItem={renderItem}
        windowSize={10}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />

      <View style={styles.actionContainer}>
        <CustomButton
          title="Add Student"
          onPress={() => navigation.navigate('AddStudent', { className })}
          iconName="person-add"
          style={styles.actionButton}
          disabled={isExporting}
        />
        <CustomButton
          title="Take Attendance"
          onPress={() => navigation.navigate('Attendance', { className })}
          iconName="edit"
          style={styles.actionButton}
          disabled={isExporting}
        />
        <CustomButton
          title="View History"
          onPress={() => navigation.navigate('AttendanceHistory', { className })}
          iconName="history"
          style={styles.actionButton}
          disabled={isExporting}
        />
        <CustomButton
          title={isExporting ? "Exporting..." : "Export PDF"}
          onPress={exportAttendanceHistory}
          iconName={isExporting ? null : "file-download"}
          style={styles.exportButton}
          disabled={isExporting}
        >
          {isExporting && (
            <ActivityIndicator color="#fff" style={styles.loader} />
          )}
        </CustomButton>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Student Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              />
              <CustomButton
                title="Save"
                onPress={handleSaveEdit}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: sizes.base,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: sizes.radius,
    marginBottom: sizes.base / 2,
    backgroundColor: colors.white,
    elevation: 1,
  },
  studentText: {
    fontSize: sizes.base + 2,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  studentNumber: {
    fontSize: sizes.base + 2,
    color: colors.textPrimary,
    backgroundColor: colors.lightGray,
    fontWeight: 'bold',
    borderRadius: sizes.radius,
    textAlign: 'center',
    padding: sizes.base / 2,
    margin: sizes.base,
  },
  rollNumber: {
    fontSize: sizes.base - 2,
    color: colors.textSecondary,
  },
  actionContainer: {
    padding: sizes.base,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: sizes.base / 2,
  },
  exportButton: {
    width: '48%',
    marginBottom: sizes.base / 2,
    backgroundColor: colors.primary,
  },
  loader: {
    marginLeft: sizes.base / 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: sizes.base / 2,
    backgroundColor: colors.primary,
    padding: sizes.base / 3,
    borderRadius: sizes.radius,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: sizes.base / 3,
    borderRadius: sizes.radius,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: sizes.base * 1.5,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    elevation: 5,
  },
  modalTitle: {
    fontSize: sizes.base + 4,
    fontWeight: 'bold',
    marginBottom: sizes.base,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: sizes.radius,
    padding: sizes.base,
    marginBottom: sizes.base * 1.5,
    fontSize: sizes.base,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: colors.danger,
    flex: 1,
    marginRight: sizes.base / 2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flex: 1,
    marginLeft: sizes.base / 2,
  },
});