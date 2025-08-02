// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import BaseScreen from '../components/BaseScreen';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { getClasses, updateClassName, deleteClass as dbDeleteClass } from '../services/db';
import { colors, sizes, spacing } from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DashboardScreen({ navigation }) {
  const [classes, setClasses] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
    } catch (error) {
      Alert.alert('Error', 'Failed to load classes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadClasses);
    return unsubscribe;
  }, [navigation]);

  const editClass = (item) => {
    setClassToEdit(item);
    setNewClassName(item.name);
    setEditModalVisible(true);
  };

  const saveClassNameHandler = async () => {
    if (!classToEdit || newClassName.trim() === '') {
      Alert.alert('Error', 'Please enter a valid class name.');
      return;
    }
    if (classes.some(c => c.name === newClassName && c.id !== classToEdit.id)) {
      Alert.alert('Error', 'A class with this name already exists.');
      return;
    }
    try {
      await updateClassName(classToEdit.name, newClassName);
      setEditModalVisible(false);
      loadClasses(); // Refresh the list
    } catch (error) {
      console.error('Error updating class name:', error);
      Alert.alert('Error', 'Failed to update class name.');
    }
  };

  const deleteClassHandler = (item) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete the class "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dbDeleteClass(item.name);
              loadClasses(); // Refresh the list
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
        title={item.name}
        onPress={() => navigation.navigate('Class', { className: item.name })}
        style={styles.classItem}
        textStyle={styles.classText}
        iconName="chevron-right"
        iconStyle={styles.chevronIcon}
      />
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <CustomButton
        onPress={() => editClass(item)}
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        iconName="edit"
      />
      <CustomButton
        onPress={() => deleteClassHandler(item)}
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        iconName="delete"
      />
    </View>
  );

  return (
    <BaseScreen style={styles.apt}>
      <StatusBar backgroundColor={colors.primary} />
      <SwipeListView
        data={classes}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe={true}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={loadClasses}
      />

      <CustomButton
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
                onPress={saveClassNameHandler}
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
    paddingBottom: sizes.base * 6,
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
