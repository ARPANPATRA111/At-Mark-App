import React, { useState, useCallback } from 'react';
import { Alert, View, StyleSheet, ScrollView, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseScreen from '../components/BaseScreen';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { colors, sizes, spacing } from '../theme';

const PREDEFINED_BATCHES = {
  'IC-2K22': [
  { "name": "ABHAY SINGH THAKUR", "rollNumber": "IC-2K22-2" },
  { "name": "ABHISHEK TAYDE", "rollNumber": "IC-2K22-3" },
  { "name": "ABHISHEK YADUWANSHI", "rollNumber": "IC-2K22-4" },
  { "name": "ADARSH YADAV", "rollNumber": "IC-2K22-5" },
  { "name": "ADITYA GIRI GOSWAMI", "rollNumber": "IC-2K22-6" },
  { "name": "ADITYA MALVIYA", "rollNumber": "IC-2K22-7" },
  { "name": "AKASH KUSHWAHA", "rollNumber": "IC-2K22-9" },
  { "name": "AKSHITA VERMA", "rollNumber": "IC-2K22-10" },
  { "name": "AMBIKA YADAV", "rollNumber": "IC-2K22-11" },
  { "name": "ANIMESH MISHRA", "rollNumber": "IC-2K22-12" },
  { "name": "ANIRUDH SAKSENA", "rollNumber": "IC-2K22-13" },
  { "name": "ANKITA TIWARI", "rollNumber": "IC-2K22-15" },
  { "name": "ANNAPURNA PAWAR", "rollNumber": "IC-2K22-16" },
  { "name": "ANUSHKA SAHU", "rollNumber": "IC-2K22-17" },
  { "name": "ANUSHKA SHRIVASTAVA", "rollNumber": "IC-2K22-18" },
  { "name": "ARCHI SINGHAI", "rollNumber": "IC-2K22-19" },
  { "name": "ARPAN PATRA", "rollNumber": "IC-2K22-20" },
  { "name": "ASHWIN CHOUHAN", "rollNumber": "IC-2K22-21" },
  { "name": "ASTHA PATWA", "rollNumber": "IC-2K22-22" },
  { "name": "BHAVIK JAIN", "rollNumber": "IC-2K22-23" },
  { "name": "CHARU SHARNAGAT", "rollNumber": "IC-2K22-24" },
  { "name": "CHHAVI GAWANDE", "rollNumber": "IC-2K22-25" },
  { "name": "CHINMAY NAROLIA", "rollNumber": "IC-2K22-27" },
  { "name": "DEEKSHIA GOUR", "rollNumber": "IC-2K22-28" },
  { "name": "DEVESH BAGORA", "rollNumber": "IC-2K22-29" },
  { "name": "DHANSHRI PATHAK", "rollNumber": "IC-2K22-30" },
  { "name": "DHINITHYA VERMA", "rollNumber": "IC-2K22-31" },
  { "name": "DIGPAL SINGH THAKUR", "rollNumber": "IC-2K22-32" },
  { "name": "GAURAV MANDLOI", "rollNumber": "IC-2K22-33" },
  { "name": "GEETANSHI JAIN", "rollNumber": "IC-2K22-34" },
  { "name": "HARSHITA JAIN", "rollNumber": "IC-2K22-35" },
  { "name": "HARSHITA TAYADE", "rollNumber": "IC-2K22-36" },
  { "name": "HEMANT SHARMA", "rollNumber": "IC-2K22-37" },
  { "name": "HIMANI VISHWAKARMA", "rollNumber": "IC-2K22-38" },
  { "name": "HITESH MAHAJAN", "rollNumber": "IC-2K22-39" },
  { "name": "ITI PATIDAR", "rollNumber": "IC-2K22-40" },
  { "name": "JASMEET KAUR SARAN", "rollNumber": "IC-2K22-41" },
  { "name": "KHUSHAL ARYA", "rollNumber": "IC-2K22-42" },
  { "name": "KRITI CHAUDHARY", "rollNumber": "IC-2K22-43" },
  { "name": "KUNAL PATEL", "rollNumber": "IC-2K22-44" },
  { "name": "KUSHAGRA SINGH BAIS", "rollNumber": "IC-2K22-45" },
  { "name": "LAKSHYA BAGORA", "rollNumber": "IC-2K22-46" },
  { "name": "LOKESH PATEL", "rollNumber": "IC-2K22-47" },
  { "name": "MADHAV TAWAR", "rollNumber": "IC-2K22-48" },
  { "name": "MADHURI GUPTA", "rollNumber": "IC-2K22-49" },
  { "name": "MAITREE BAPNA", "rollNumber": "IC-2K22-50" },
],
  'IC-2K24': [
  { "name": "AADITYA MALVIYA", "rollNumber": "IC-2K24-01" },
  { "name": "AAFIYA KHAN", "rollNumber": "IC-2K24-02" },
  { "name": "AASI MISHRA", "rollNumber": "IC-2K24-03" },
  { "name": "AAYUSH SINGH BAGHEL", "rollNumber": "IC-2K24-04" },
  { "name": "ABHIRAJ SINGH", "rollNumber": "IC-2K24-05" },
  { "name": "ADITI JAIN", "rollNumber": "IC-2K24-06" },
  { "name": "ADITI PATEL", "rollNumber": "IC-2K24-07" },
  { "name": "AISHWARYA KUMAR", "rollNumber": "IC-2K24-08" },
  { "name": "AKSHARA KACHOLE", "rollNumber": "IC-2K24-09" },
  { "name": "AKSHAT JAIN", "rollNumber": "IC-2K24-10" },
  { "name": "AMRITA PATEL", "rollNumber": "IC-2K24-12" },
  { "name": "ANISH KAJVE", "rollNumber": "IC-2K24-15" },
  { "name": "ANSHIKA MALI", "rollNumber": "IC-2K24-16" },
  { "name": "ANSHIKA PANDEY", "rollNumber": "IC-2K24-17" },
  { "name": "ANSHUL SINGH", "rollNumber": "IC-2K24-18" },
  { "name": "ANUSHKA SHARMA", "rollNumber": "IC-2K24-19" },
  { "name": "ANUSHKA SOLANKI", "rollNumber": "IC-2K24-20" },
  { "name": "ARIN GUPTA", "rollNumber": "IC-2K24-22" },
  { "name": "ARYAVEER SONI", "rollNumber": "IC-2K24-23" },
  { "name": "ATHARV CHOUDHARY", "rollNumber": "IC-2K24-24" },
  { "name": "BEDINA DIXIT", "rollNumber": "IC-2K24-25" },
  { "name": "BHAVYA DUBEY", "rollNumber": "IC-2K24-26" },
  { "name": "BHUMIKA MEGHANI", "rollNumber": "IC-2K24-27" },
  { "name": "BHUPENDRA SINGH", "rollNumber": "IC-2K24-28" },
  { "name": "CHAITANYA DUBEY", "rollNumber": "IC-2K24-29" },
  { "name": "CHETAN PATIL", "rollNumber": "IC-2K24-30" },
  { "name": "CHIRAG BORSE", "rollNumber": "IC-2K24-31" },
  { "name": "DEVAKSHI GOUR", "rollNumber": "IC-2K24-32" },
  { "name": "DHRUV GOEL", "rollNumber": "IC-2K24-33" },
  { "name": "DHRUV PARDESHI", "rollNumber": "IC-2K24-34" },
  { "name": "GOURVI JAIN", "rollNumber": "IC-2K24-35" },
  { "name": "HARSHIL SONI", "rollNumber": "IC-2K24-36" },
  { "name": "HARSHIT SAHU", "rollNumber": "IC-2K24-37" },
  { "name": "HITISHKA VAISHNAV", "rollNumber": "IC-2K24-38" },
  { "name": "ISHAAN SHARMA", "rollNumber": "IC-2K24-39" },
  { "name": "JAY RATHORE", "rollNumber": "IC-2K24-40" },
  { "name": "JHALAK SOLANKI", "rollNumber": "IC-2K24-41" },
  { "name": "KARTIK", "rollNumber": "IC-2K24-42" },
  { "name": "KESHAV PATIDAR", "rollNumber": "IC-2K24-43" },
  { "name": "KHUSHI GOUD", "rollNumber": "IC-2K24-44" },
  { "name": "KHUSHI JAT", "rollNumber": "IC-2K24-45" },
  { "name": "KHUSHVARDHAN", "rollNumber": "IC-2K24-46" },
  { "name": "KIRTI TOMAR", "rollNumber": "IC-2K24-47" },
  { "name": "KRISH PAWAR", "rollNumber": "IC-2K24-48" },
  { "name": "LAKSH PATHAK", "rollNumber": "IC-2K24-49" },
  { "name": "LAKSH VERMA", "rollNumber": "IC-2K24-50" },
  { "name": "LAKSHYA AKHOURI", "rollNumber": "IC-2K24-51" },
  { "name": "LAYAK RATHORE", "rollNumber": "IC-2K24-52" },
  { "name": "MAANYTA KATARE", "rollNumber": "IC-2K24-53" },
  { "name": "MANVENDRA SINGH", "rollNumber": "IC-2K24-54" },
  { "name": "MAYANK DUBEY", "rollNumber": "IC-2K24-55" },
  { "name": "MISHIKA LULLA", "rollNumber": "IC-2K24-56" },
  { "name": "MISHIKA UPADHYAY", "rollNumber": "IC-2K24-57" },
  { "name": "NARAYAN VERMA", "rollNumber": "IC-2K24-59" },
  { "name": "NARENDRA BHADLE", "rollNumber": "IC-2K24-60" },
  { "name": "NIRBHAY PRATAP SINGH", "rollNumber": "IC-2K24-61" },
  { "name": "NISHI PALIWAL", "rollNumber": "IC-2K24-62" },
  { "name": "NITISHA AHIIRWAR", "rollNumber": "IC-2K24-63" },
  { "name": "PARIDHI UPADHYAY", "rollNumber": "IC-2K24-64" },
  { "name": "PARTH AGRAWAL", "rollNumber": "IC-2K24-65" },
  { "name": "PARTH SALGIA", "rollNumber": "IC-2K24-66" },
  { "name": "PRAGYAN TIWARI", "rollNumber": "IC-2K24-67" },
  { "name": "PRANAV KHOTI", "rollNumber": "IC-2K24-68" },
  { "name": "PRATISHTHA PATEL", "rollNumber": "IC-2K24-70" },
  { "name": "PRIYANSHI MITTAL", "rollNumber": "IC-2K24-71" },
  { "name": "PURVA PATIDAR", "rollNumber": "IC-2K24-72" },
  { "name": "PURVANSHI LOVVANSHI", "rollNumber": "IC-2K24-73" },
  { "name": "RAHUL MANAWARE", "rollNumber": "IC-2K24-74" },
  { "name": "RAJKUMAR CHHUGANI", "rollNumber": "IC-2K24-75" },
  { "name": "RANVEER SILAWAT", "rollNumber": "IC-2K24-76" },
  { "name": "RASHI RAI", "rollNumber": "IC-2K24-77" },
  { "name": "RISHI VISHWAKARMA", "rollNumber": "IC-2K24-78" },
  { "name": "ROLLY YADAV", "rollNumber": "IC-2K24-79" },
  { "name": "SABHYATA YADAV", "rollNumber": "IC-2K24-80" },
  { "name": "SAHIL YADAV", "rollNumber": "IC-2K24-81" },
  { "name": "SAMARTH PANDIT", "rollNumber": "IC-2K24-82" },
  { "name": "SANSKRITI MADRELE", "rollNumber": "IC-2K24-85" },
  { "name": "SHIFA SHAIKH", "rollNumber": "IC-2K24-86" },
  { "name": "SHUBHI SAXENA", "rollNumber": "IC-2K24-87" },
  { "name": "SIDDHI TIWARI", "rollNumber": "IC-2K24-88" },
  { "name": "SONALI MARIA", "rollNumber": "IC-2K24-89" },
  { "name": "SOUMYA YADAV", "rollNumber": "IC-2K24-90" },
  { "name": "TANISH SHIVHARE", "rollNumber": "IC-2K24-91" },
  { "name": "VAIBHIKA LOT", "rollNumber": "IC-2K24-92" },
  { "name": "VEDIKA SAWARKAR", "rollNumber": "IC-2K24-93" },
  { "name": "VIHAN SINGH RATHORE", "rollNumber": "IC-2K24-94" },
  { "name": "VIJAY YADAV", "rollNumber": "IC-2K24-95" },
  { "name": "VIPUL PUROHIT", "rollNumber": "IC-2K24-96" },
  { "name": "VISHAL HARWAL", "rollNumber": "IC-2K24-97" },
  { "name": "VIVEK RAJORIYA", "rollNumber": "IC-2K24-98" },
  { "name": "YUKTI PATLE", "rollNumber": "IC-2K24-99" },
  { "name": "AAYUSHI SAINI", "rollNumber": "IC-2K24-100" },
  { "name": "PRADEEP LODHI", "rollNumber": "IC-2K24-101" },
  { "name": "RAJSHREE RAJPUT", "rollNumber": "IC-2K24-102" },
  { "name": "RISHI SHENDE", "rollNumber": "IC-2K24-103" },
  { "name": "SRISHTEE DAYMA", "rollNumber": "IC-2K24-104" },
  { "name": "SWAPNIL SAXENA", "rollNumber": "IC-2K24-105" }
],
  'Batch C': [{ name: 'Student 6', rollNumber: '1006' }],
  'Batch D': [{ name: 'Student 9', rollNumber: '1009' }],
  'Batch E': [{ name: 'Student 10', rollNumber: '1010' }],
  'Batch F': [{ name: 'Student 11', rollNumber: '1011' }],
  'Batch G': [{ name: 'Student 12', rollNumber: '1012' }],
  'Batch H': [{ name: 'Student 13', rollNumber: '1013' }],
};

const BatchItem = React.memo(({ item, selectedBatch, onSelect }) => (
  <CustomButton
    title={`${item.name}\n(${item.students.length} students)`}
    onPress={() => onSelect(item.name)}
    style={[
      styles.batchButton,
      selectedBatch === item.name && styles.selectedBatch
    ]}
    textStyle={[
      styles.batchButtonText,
      selectedBatch === item.name && styles.selectedBatchText
    ]}
  />
));

const StudentItem = React.memo(({ item }) => (
  <View style={styles.studentItem}>
    <Text style={styles.studentName}>{item.name}</Text>
    <Text style={styles.studentRoll}>Roll No: {item.rollNumber}</Text>
  </View>
));

export default function AddClassScreen({ navigation }) {
  const [className, setClassName] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const batchArray = Object.keys(PREDEFINED_BATCHES).map(key => ({
    name: key,
    students: PREDEFINED_BATCHES[key]
  }));

  const addClass = async () => {
    if (className.trim() === '') {
      Alert.alert('Error', 'Please enter a class name.');
      return;
    }
    
    if (!selectedBatch) {
      Alert.alert('Error', 'Please select a batch.');
      return;
    }

    setLoading(true);
    try {
      const classesData = await AsyncStorage.getItem('classes');
      const classes = classesData ? JSON.parse(classesData) : [];
      
      if (classes.includes(className)) {
        Alert.alert('Error', 'This class already exists.');
        return;
      }
      
      classes.push(className);
      await AsyncStorage.setItem('classes', JSON.stringify(classes));
      
      const batchStudents = PREDEFINED_BATCHES[selectedBatch];
      await AsyncStorage.setItem(
        `students_${className}`,
        JSON.stringify(batchStudents)
      );
      
      setClassName('');
      setSelectedBatch(null);
      Alert.alert('Success', 'Class created with students from the selected batch!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create class.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBatch = useCallback((batchName) => {
    setSelectedBatch(batchName);
  }, []);

  const renderBatchItem = useCallback(({ item }) => (
    <BatchItem 
      item={item} 
      selectedBatch={selectedBatch} 
      onSelect={handleSelectBatch}
    />
  ), [selectedBatch]);

  const renderStudentItem = useCallback(({ item }) => (
    <StudentItem item={item} />
  ), []);

  return (
    <BaseScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomTextInput
          placeholder="Class Name (Subject Name)"
          value={className}
          onChangeText={setClassName}
          style={styles.input}
        />
        
        <Text style={styles.sectionTitle}>Select a Batch</Text>
        
        <FlatList
          data={batchArray}
          renderItem={renderBatchItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
          contentContainerStyle={styles.batchesContainer}
          windowSize={5}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
        />
        
        {selectedBatch && (
          <View style={styles.studentsPreview}>
            <Text style={styles.previewTitle}>Students in {selectedBatch}:</Text>
            <FlatList
              data={PREDEFINED_BATCHES[selectedBatch]}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.rollNumber}
              scrollEnabled={false}
              windowSize={5}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
            />
          </View>
        )}
      </ScrollView>
      
      <CustomButton
        title="Create Class"
        onPress={addClass}
        iconName="add"
        loading={loading}
        disabled={!className.trim() || !selectedBatch}
        style={styles.createButton}
      />
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  input: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: sizes.base,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  batchesContainer: {
    marginBottom: spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  batchButton: {
    width: '48%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    justifyContent: 'center',
    minHeight: 60,
  },
  batchButtonText: {
    fontSize: sizes.base - 2,
    textAlign: 'center',
    color: colors.textPrimary,
    lineHeight: sizes.base,
  },
  selectedBatch: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedBatchText: {
    color: colors.white,
  },
  studentsPreview: {
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  previewTitle: {
    fontSize: sizes.base,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  studentName: {
    fontSize: sizes.base,
    color: colors.textPrimary,
  },
  studentRoll: {
    fontSize: sizes.base,
    color: colors.textSecondary,
  },
  createButton: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
});