// screens/AttendanceHistoryScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { getStudents, getAttendanceForDate } from '../services/db';
import { colors, sizes } from '../theme';

const PresentStudentItem = React.memo(({ item }) => (
  <View style={[styles.studentItem, styles.presentStudent]}>
    <Text style={styles.studentText}>{item.name}</Text>
    <Text style={styles.rollNumber}>Roll No: {item.rollNumber}</Text>
  </View>
));

export default function AttendanceHistoryScreen({ route }) {
  const { className } = route.params;
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentList = await getStudents(className);
        setStudents(studentList);

        const attendanceData = await getAttendanceForDate(className, date);
        setAttendance(attendanceData);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not load attendance history.");
      }
    };
    loadData();
  }, [className, date]);

  const presentStudents = students.filter(
    (student) => attendance[student.rollNumber]
  );

  const renderItem = useCallback(({ item }) => (
    <PresentStudentItem item={item} />
  ), []);

  const formatDate = useCallback((d) => format(d, 'EEEE, MMMM d, yyyy'), []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={showDatepicker}
      >
        <Text style={styles.dateButtonText}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {presentStudents.length > 0 ? (
        <FlatList
          data={presentStudents}
          keyExtractor={(item) => item.rollNumber.toString()}
          renderItem={renderItem}
          windowSize={10}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
        />
      ) : (
        <Text style={styles.noDataText}>
          No students were present on this date.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.padding,
    backgroundColor: colors.background,
  },
  dateButton: {
    padding: sizes.base,
    backgroundColor: colors.primary,
    borderRadius: sizes.radius,
    alignItems: 'center',
    marginBottom: sizes.margin,
  },
  dateButtonText: {
    color: colors.white,
    fontSize: sizes.base,
  },
  studentItem: {
    padding: sizes.base,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
    backgroundColor: '#d1f7c4',
    borderRadius: sizes.radius,
    marginBottom: sizes.base / 2,
  },
  studentText: {
    fontSize: sizes.base + 2,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  rollNumber: {
    fontSize: sizes.base - 2,
    color: colors.textSecondary,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: sizes.margin,
    fontSize: sizes.base,
    color: colors.textSecondary,
  },
  presentStudent: {
    backgroundColor: '#d1f7c4',
  },
});