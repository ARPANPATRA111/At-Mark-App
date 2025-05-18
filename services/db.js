// services/db.js
import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('attendance.db');
    
    // Initialize tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes (id),
        UNIQUE(class_id, roll_number)
      );
      
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        present INTEGER DEFAULT 0,
        FOREIGN KEY (class_id) REFERENCES classes (id),
        FOREIGN KEY (student_id) REFERENCES students (id),
        UNIQUE(class_id, student_id, date)
      );
    `);
    
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Class operations
export const addClass = async (className, students) => {
  return db.withTransactionAsync(async () => {
    try {
      // Insert class
      const classResult = await db.runAsync(
        'INSERT INTO classes (name) VALUES (?)',
        className
      );
      const classId = classResult.lastInsertRowId;

      // Insert students using prepared statement
      const statement = await db.prepareAsync(
        'INSERT INTO students (class_id, name, roll_number) VALUES (?, ?, ?)'
      );
      
      try {
        for (const student of students) {
          await statement.executeAsync([classId, student.name, student.rollNumber]);
        }
      } finally {
        await statement.finalizeAsync();
      }

      return classId;
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  });
};

export const getClasses = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM classes ORDER BY name');
    return result;
  } catch (error) {
    console.error('Error getting classes:', error);
    throw error;
  }
};

export const updateClassName = async (oldName, newName) => {
  try {
    const result = await db.runAsync(
      'UPDATE classes SET name = ? WHERE name = ?',
      [newName, oldName]
    );
    return result.changes;
  } catch (error) {
    console.error('Error updating class name:', error);
    throw error;
  }
};

export const deleteClass = async (className) => {
  return db.withTransactionAsync(async () => {
    try {
      // Get class ID
      const classResult = await db.getFirstAsync(
        'SELECT id FROM classes WHERE name = ?',
        className
      );
      
      if (!classResult) throw new Error('Class not found');

      const classId = classResult.id;

      // Delete related records
      await db.runAsync('DELETE FROM attendance WHERE class_id = ?', classId);
      await db.runAsync('DELETE FROM students WHERE class_id = ?', classId);
      
      // Delete class
      const result = await db.runAsync(
        'DELETE FROM classes WHERE id = ?',
        classId
      );
      
      return result.changes;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  });
};

// Student operations
export const addStudent = async (className, student) => {
  return db.withTransactionAsync(async () => {
    try {
      const classResult = await db.getFirstAsync(
        'SELECT id FROM classes WHERE name = ?',
        className
      );
      
      if (!classResult) throw new Error('Class not found');

      const result = await db.runAsync(
        'INSERT INTO students (class_id, name, roll_number) VALUES (?, ?, ?)',
        [classResult.id, student.name, student.rollNumber]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  });
};

export const getStudents = async (className) => {
  try {
    const classResult = await db.getFirstAsync(
      'SELECT id FROM classes WHERE name = ?',
      className
    );
    
    if (!classResult) return [];

    const result = await db.getAllAsync(
      'SELECT id, name, roll_number as rollNumber FROM students WHERE class_id = ? ORDER BY name',
      [classResult.id]
    );
    
    return result;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

// Attendance operations
export const saveAttendance = async (className, date, attendance) => {
  return db.withTransactionAsync(async () => {
    try {
      const classResult = await db.getFirstAsync(
        'SELECT id FROM classes WHERE name = ?',
        className
      );
      
      if (!classResult) throw new Error('Class not found');

      const dateString = date.toDateString();
      const statement = await db.prepareAsync(`
        INSERT INTO attendance (class_id, student_id, date, present)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(class_id, student_id, date) DO UPDATE SET present = excluded.present
      `);

      try {
        for (const [rollNumber, isPresent] of Object.entries(attendance)) {
          const studentResult = await db.getFirstAsync(
            'SELECT id FROM students WHERE class_id = ? AND roll_number = ?',
            [classResult.id, rollNumber]
          );
          
          if (studentResult) {
            await statement.executeAsync([
              classResult.id,
              studentResult.id,
              dateString,
              isPresent ? 1 : 0
            ]);
          }
        }
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw error;
    }
  });
};

export const getAttendanceForDate = async (className, date) => {
  try {
    const classResult = await db.getFirstAsync(
      'SELECT id FROM classes WHERE name = ?',
      className
    );
    
    if (!classResult) return {};

    const dateString = date.toDateString();
    const result = await db.getAllAsync(`
      SELECT s.roll_number as rollNumber, a.present 
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE a.class_id = ? AND a.date = ?
    `, [classResult.id, dateString]);

    return result.reduce((acc, row) => {
      acc[row.rollNumber] = row.present === 1;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error getting attendance:', error);
    throw error;
  }
};

// Add other necessary operations following similar patterns

export default db;