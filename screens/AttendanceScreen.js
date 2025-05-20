// screens/AttendenceScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import BaseScreen from '../components/BaseScreen';
import CustomButton from '../components/CustomButton';
import { colors, sizes, spacing } from '../theme';

const AttendanceItem = React.memo(({ item, isPresent, onToggle }) => (
  <TouchableOpacity
    style={[
      styles.studentItem,
      isPresent && styles.presentStudent,
    ]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.studentInfo}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.studentRoll}>Roll No: {item.rollNumber}</Text>
    </View>
    <View style={[
      styles.attendanceMarker,
      isPresent && styles.presentMarker
    ]}>
      {isPresent && (
        <Text style={styles.markerText}>✓</Text>
      )}
    </View>
  </TouchableOpacity>
));

export default function AttendanceScreen({ route, navigation }) {
  const { className } = route.params;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatepicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const onChangeDate = useCallback((event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
    } else {
      setShowDatePicker(Platform.OS === 'ios');
    }
  }, [date]);

  const deleteAttendanceForDay = useCallback(async () => {
    try {
      const attendanceKey = `attendance_${className}_${date.toDateString()}`;
  
      const keys = await AsyncStorage.getAllKeys();
      if (!keys.includes(attendanceKey)) {
        Alert.alert('Error', 'No attendance record found for the selected date.');
        return;
      }
  
      await AsyncStorage.removeItem(attendanceKey);
  
      Alert.alert('Success', `Attendance for ${formatDate(date)} has been deleted.`);
      setAttendance({});
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      Alert.alert('Error', 'Failed to delete attendance record.');
    }
  }, [className, date]);

  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        const studentsData = await AsyncStorage.getItem(`students_${className}`);
        if (studentsData) setStudents(JSON.parse(studentsData));

        const attendanceKey = `attendance_${className}_${date.toDateString()}`;
        const attendanceData = await AsyncStorage.getItem(attendanceKey);
        if (attendanceData) {
          setAttendance(JSON.parse(attendanceData));
        } else {
          setAttendance({});
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadAttendanceData();
  }, [className, date]);

  const toggleAttendance = useCallback((student) => {
    setAttendance(prevAttendance => {
      const updatedAttendance = { ...prevAttendance };
      if (updatedAttendance[student.rollNumber]) {
        delete updatedAttendance[student.rollNumber];
      } else {
        updatedAttendance[student.rollNumber] = true;
      }
      return updatedAttendance;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const attendanceKey = `attendance_${className}_${date.toDateString()}`;
      await AsyncStorage.setItem(attendanceKey, JSON.stringify(attendance));
      Alert.alert('Success', 'Attendance has been saved.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save attendance.');
    }
  }, [attendance, className, date]);

  const formatDate = useCallback((date) => format(date, 'EEEE, MMMM d, yyyy'), []);

  const renderItem = useCallback(({ item }) => (
    <AttendanceItem
      item={item}
      isPresent={attendance[item.rollNumber]}
      onToggle={() => toggleAttendance(item)}
    />
  ), [attendance, toggleAttendance]);

  return (
    <BaseScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.classTitle}>{className}</Text>
        <CustomButton
          title={formatDate(date)}
          onPress={showDatepicker}
          style={styles.dateButton}
          textStyle={styles.dateButtonText}
          iconName="calendar-today"
          iconPosition="right"
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{students.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Object.keys(attendance).length}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {students.length - Object.keys(attendance).length}
          </Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.rollNumber.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        windowSize={10}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
      />

      <View style={styles.footer}>
        <CustomButton
          title="Delete"
          onPress={deleteAttendanceForDay}
          style={styles.deleteButton}
          textStyle={styles.buttonText}
          iconName="delete"
          iconColor="#fff"
        />
        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          style={styles.submitButton}
          textStyle={styles.buttonText}
          iconName="check-circle"
          iconColor="#fff"
        />
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sm,
  },
  header: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  classTitle: {
    fontSize: sizes.h4,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: sizes.radius,
  },
  dateButtonText: {
    color: colors.primary,
    fontSize: sizes.base,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: sizes.h4,
    fontWeight: 'bold',
    color: colors.success,
  },
  statLabel: {
    fontSize: sizes.base - 2,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 100,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    elevation: 1,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: sizes.base+2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: sizes.base - 2,
    color: colors.textSecondary,
  },
  attendanceMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  presentMarker: {
    backgroundColor: colors.success,
    borderColor: colors.primary,
  },
  markerText: {
    color: colors.white,
    fontSize: sizes.base - 2,
  },
  presentStudent: {
    borderLeftWidth: 5,
    borderLeftColor: colors.success,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  deleteButton: {
    flex: 1,
    marginRight: spacing.xs,
    backgroundColor: colors.danger,
  },
  submitButton: {
    flex: 1,
    marginLeft: spacing.xs,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});