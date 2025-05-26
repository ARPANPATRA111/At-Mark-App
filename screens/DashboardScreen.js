// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, TouchableOpacity,StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import BaseScreen from '../components/BaseScreen';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { colors, sizes, spacing } from '../theme';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DashboardScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [classToEdit, setClassToEdit] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const editClass = (item) => {
    setClassToEdit(item);
    setNewClassName(item);
    setEditModalVisible(true);
  };

  const saveClassName = async () => {
    if (newClassName.trim() === '') {
      Alert.alert('Error', 'Please enter a valid class name.');
      return;
    }
    if (classes.includes(newClassName) && newClassName !== classToEdit) {
      Alert.alert('Error', 'A class with this name already exists.');
      return;
    }
    try {
      // Update the classes array
      const updatedClasses = classes.map((cls) =>
        cls === classToEdit ? newClassName : cls
      );
      setClasses(updatedClasses);
      await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));

      // Update students key
      const studentsData = await AsyncStorage.getItem(`students_${classToEdit}`);
      if (studentsData) {
        await AsyncStorage.setItem(`students_${newClassName}`, studentsData);
        await AsyncStorage.removeItem(`students_${classToEdit}`);
      }

      // Update attendance records
      const keys = await AsyncStorage.getAllKeys();
      const attendanceKeys = keys.filter((key) =>
        key.startsWith(`attendance_${classToEdit}_`)
      );

      for (const oldKey of attendanceKeys) {
        const data = await AsyncStorage.getItem(oldKey);
        const newKey = oldKey.replace(
          `attendance_${classToEdit}_`,
          `attendance_${newClassName}_`
        );
        await AsyncStorage.setItem(newKey, data);
        await AsyncStorage.removeItem(oldKey);
      }

      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating class name:', error);
      Alert.alert('Error', 'Failed to update class name.');
    }
  };

  const deleteClass = async (item) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete the class "${item}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove from classes array
              const updatedClasses = classes.filter((cls) => cls !== item);
              setClasses(updatedClasses);
              await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));

              // Remove associated students
              await AsyncStorage.removeItem(`students_${item}`);

              // Remove associated attendance records
              const keys = await AsyncStorage.getAllKeys();
              const attendanceKeys = keys.filter((key) =>
                key.startsWith(`attendance_${item}_`)
              );
              if (attendanceKeys.length > 0) {
                await AsyncStorage.multiRemove(attendanceKeys);
              }
            } catch (error) {
              console.error('Error deleting class:', error);
              Alert.alert('Error', 'Failed to delete class.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.rowFront}>
      <CustomButton
        title={item}
        onPress={() => navigation.navigate('Class', { className: item })}
        style={styles.classItem}
        textStyle={styles.classText}
        iconName="chevron-right"
        iconStyle={styles.chevronIcon}
      />
    </View>
  );

  const renderHiddenItem = ({ item }, rowMap) => (
    <View style={styles.rowBack}>
      <CustomButton
        onPress={() => editClass(item)}
        // title="Edit"
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        iconName="edit"
      />
      <CustomButton
        onPress={() => deleteClass(item)}
        // title="Delete"
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        iconName="delete"
      />
    </View>
  );

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classesData = await AsyncStorage.getItem('classes');
        if (classesData) setClasses(JSON.parse(classesData));
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load classes.');
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadClasses);
    return unsubscribe;
  }, [navigation]);

  return (
    <BaseScreen style={styles.apt}>
      <StatusBar backgroundColor={colors.primary} />
      <SwipeListView
        data={classes}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe={true}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />

      <CustomButton
        // title=""
        onPress={() => navigation.navigate('AddClass')}
        iconName="add"
        style={styles.addButton}
      />
      
    <TouchableOpacity
      style={styles.helpButton}
      onPress={() => navigation.navigate('ContactInfoScreen')}
    >
      <Icon name="help-outline" size={34} color={colors.white} />
    </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Class Name</Text>
            <CustomTextInput
              placeholder="Class Name"
              value={newClassName}
              onChangeText={setNewClassName}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
                style={styles.cancelButton}
              />
              <CustomButton
                title="Save"
                onPress={saveClassName}
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
  listContainer: {
    paddingBottom: sizes.base * 6, // Makes space for the add button
  },
  classItem: {
    backgroundColor: colors.white,
    padding: sizes.base,
    borderBottomWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  classText: {
    fontSize: sizes.base + 2,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  chevronIcon: {
    marginLeft: sizes.base,
  },
  addButton: {
    position: 'absolute',
    right: sizes.base * 1.5,
    bottom: sizes.base * 1.5,
    width: sizes.base * 4.1,
    height: sizes.base * 4.1,
    borderRadius: (sizes.base * 3.5) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.padding,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sizes.base * 1.5,
    marginBottom: sizes.margin,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  apt:{
    backgroundColor: "white"
  },
  modalInput: {
    width: '100%',
    marginBottom: sizes.margin,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.danger,
    marginRight: sizes.base / 2,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    marginLeft: sizes.base / 2,
  },
  rowFront: {
    backgroundColor: colors.white,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backRightBtn: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRightBtnLeft: {
    backgroundColor: colors.primary,
  },
  backRightBtnRight: {
    backgroundColor: colors.danger,
  },
  helpButton: {
    position: 'absolute',
    left: sizes.base * 1.5,
    bottom: sizes.base * 1.5,
    width: sizes.base * 3.5,
    height: sizes.base * 3.5,
    borderRadius: (sizes.base * 3.5) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    elevation: 5,
  },
});
