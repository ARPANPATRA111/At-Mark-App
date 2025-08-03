// screens/StudentAttendanceScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAttendanceForStudent, getTotalClassesForStudent } from '../services/db';
import { colors, sizes } from '../theme';
import { format } from 'date-fns';

export default function StudentAttendanceScreen({ route }) {
    const { className, student } = route.params;
    const [markedDates, setMarkedDates] = useState({});
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [totalClassesTaken, setTotalClassesTaken] = useState(0);
    const [totalClassesAttended, setTotalClassesAttended] = useState(0);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            try {
                const attendanceRecords = await getAttendanceForStudent(className, student.id);
                const totalClasses = await getTotalClassesForStudent(className);

                let attendedCount = 0;
                const records = {};

                attendanceRecords.forEach(record => {
                    const formattedDate = format(new Date(record.date), 'yyyy-MM-dd');
                    const wasPresent = record.present === 1;
                    if (wasPresent) {
                        attendedCount++;
                    }
                    records[formattedDate] = {
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
                });
                
                setMarkedDates(records);
                setTotalClassesTaken(totalClasses);
                setTotalClassesAttended(attendedCount);

                const percentage = totalClasses > 0 ? ((attendedCount / totalClasses) * 100).toFixed(2) : 0;
                setAttendancePercentage(percentage);

            } catch (error) {
                console.error('Error fetching attendance records:', error);
                Alert.alert('Error', 'Unable to load attendance records.');
            }
        };

        fetchAttendanceRecords();
    }, [className, student.id]);

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
                Total No. Of Classes: {totalClassesTaken}
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
