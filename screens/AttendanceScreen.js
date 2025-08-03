// screens/AttendanceScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import BaseScreen from '../components/BaseScreen';
import CustomButton from '../components/CustomButton';
import { getStudents, saveAttendance, getAttendanceForDate, deleteAttendanceForDate } from '../services/db';
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

  const loadData = useCallback(async (newDate) => {
    try {
      const studentList = await getStudents(className);
      setStudents(studentList);

      const attendanceData = await getAttendanceForDate(className, newDate);
      setAttendance(attendanceData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load data.");
    }
  }, [className]);

  useEffect(() => {
    loadData(date);
  }, [className, date, loadData]);

  const showDatepicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const onChangeDate = useCallback((event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
  }, [date]);

  const toggleAttendance = useCallback((student) => {
    setAttendance(prev => ({
      ...prev,
      [student.rollNumber]: !prev[student.rollNumber],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      await saveAttendance(className, date, attendance);
      Alert.alert('Success', 'Attendance has been saved.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save attendance.');
    }
  }, [attendance, className, date]);

  const handleDeleteAttendance = useCallback(() => {
    Alert.alert(
      "Delete Attendance",
      `Are you sure you want to delete the attendance record for ${formatDate(date)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const changes = await deleteAttendanceForDate(className, date);
              if (changes > 0) {
                setAttendance({}); // Clear the state
                Alert.alert("Success", "Attendance record for this date has been deleted.");
              } else {
                Alert.alert("Info", "No attendance record found for this date to delete.");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete attendance record.");
            }
          }
        }
      ]
    );
  }, [className, date, formatDate]);

  const formatDate = useCallback((d) => format(d, 'EEEE, MMMM d, yyyy'), []);

  const renderItem = useCallback(({ item }) => (
    <AttendanceItem
      item={item}
      isPresent={!!attendance[item.rollNumber]}
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
          <Text style={styles.statValue}>{Object.values(attendance).filter(Boolean).length}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {students.length - Object.values(attendance).filter(Boolean).length}
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
          onPress={handleDeleteAttendance}
          style={styles.deleteButton}
          textStyle={styles.buttonText}
          iconName="delete"
        />
        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          style={styles.submitButton}
          textStyle={styles.buttonText}
          iconName="check-circle"
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
