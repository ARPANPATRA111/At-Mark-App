// screens/StudentAttendanceScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { colors, sizes } from '../theme';

export default function StudentAttendanceScreen({ route }) {
    const { className, student } = route.params;
    const [markedDates, setMarkedDates] = useState({});
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [totalClassesTaken, setTotalClassesTaken] = useState(0);
    const [totalClassesAttended, setTotalClassesAttended] = useState(0);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const attendanceKeys = keys.filter((key) =>
                    key.startsWith(`attendance_${className}_`)
                );

                let attendedCount = 0;
                let totalCount = 0;
                const records = {};

                for (const key of attendanceKeys) {
                    const attendanceData = await AsyncStorage.getItem(key);
                    const attendance = JSON.parse(attendanceData || '{}');
                    const rawDate = key.split('_').pop(); // Extract raw date from key
                    const formattedDate = new Date(rawDate).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    totalCount++; // Increment total classes count

                    // Mark attendance with green or red dots
                    if (attendance.hasOwnProperty(student.rollNumber)) {
                        const wasPresent = attendance[student.rollNumber];
                        if (wasPresent) attendedCount++; // Increment attended classes count
                        records[formattedDate] = {
                            // marked: true,
                            customStyles: {
                                container: {
                                    backgroundColor: wasPresent ? '#b3ffb3' : '#ff8888',
                                    borderRadius: 50,
                                },
                                text: {
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                            },
                        };
                    } else {
                        const wasPresent = attendance[student.rollNumber];
                        records[formattedDate] = {
                            // marked: true,
                            customStyles: {
                                container: {
                                    backgroundColor: wasPresent ? '#b3ffb3' : '#ff8888',
                                    borderRadius: 50,
                                },
                                text: {
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                            },
                        };
                    }
                }
                setMarkedDates(records);
                setTotalClassesTaken(totalCount);
                setTotalClassesAttended(attendedCount);
                // Calculate attendance percentage
                // console.log(attendedClasses);
                // console.log(totalClasses);
                const percentage =
                totalCount > 0
                        ? ((attendedCount / totalCount) * 100).toFixed(2)
                        : 0;
                setAttendancePercentage(percentage);
            } catch (error) {
                console.error('Error fetching attendance records:', error);
                Alert.alert('Error', 'Unable to load attendance records.');
            }
        };

        fetchAttendanceRecords();
    }, [className, student.rollNumber]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Attendance for {student.name} ({student.rollNumber})
            </Text>
            <Calendar
                markedDates={markedDates}
                theme={{
                    todayTextColor: colors.primary,
                    arrowColor: colors.primary,
                }}
                markingType="custom"
            />
            <Text style={styles.percentageText}>
                Total No.Of Classes: {totalClassesTaken}
            </Text>
            <Text style={styles.percentageText}>
            Classes Attended: {totalClassesAttended}
            </Text>
            <Text style={styles.percentageText}>
                Attendance Percentage: {attendancePercentage}%
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: sizes.padding,
        backgroundColor: colors.background,
    },
    header: {
        fontSize: sizes.base + 4,
        fontWeight: 'bold',
        marginBottom: sizes.margin,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    percentageText: {
        marginTop: sizes.margin,
        fontSize: sizes.base + 2,
        fontWeight: 'bold',
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
