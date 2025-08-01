# At-mark

This project is an **Attendance Tracker** application built with React Native. It allows you to record and export attendance history grouped by dates. The exported attendance history is saved as a PDF file, displaying separate tables for each date with student details.

---

## Features

- Add attendance records for students with their names and roll numbers.
- Group attendance records by date.
- Export attendance history as a PDF file.
- Display attendance tables for each date in the PDF.
- Stylish and organized table layouts for readability.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v14 or higher)
- Expo CLI
- React Native development environment

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repository/attendance-tracker.git
   cd attendance-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   expo start
   ```

4. Use the Expo Go app or an emulator to preview the application.

---

## Usage

1. Add attendance data for students within the app.
2. Navigate to the "Export Attendance" section.
3. Tap the export button to generate a PDF file containing attendance history.
4. View the PDF, which groups student details by date with separate tables.

---

## Expected Data Format

Attendance data is stored in **AsyncStorage** in the following format:

```json
{
  "27th Feb": [
    { "name": "John Doe", "rollNumber": "101" },
    { "name": "Jane Doe", "rollNumber": "102" }
  ],
  "28th Feb": [
    { "name": "Alice Brown", "rollNumber": "103" },
    { "name": "Bob Smith", "rollNumber": "104" }
  ]
}
```

---

## Key Components

### Export Attendance Function

The core function to generate and export the PDF:

```javascript
const exportAttendanceHistory = async () => {
  try {
    const studentsData = await AsyncStorage.getItem(`students_${className}`);
    if (!studentsData) {
      Alert.alert('No Data', 'No attendance history to export.');
      return;
    }

    const attendanceData = JSON.parse(studentsData);
    const tableSections = Object.entries(attendanceData)
      .map(([date, students]) => {
        const studentRows = students
          .map((student, index) =>
            `<tr>
               <td>${index + 1}</td>
               <td>${student.name}</td>
               <td>${student.rollNumber}</td>
             </tr>`
          )
          .join('');

        return `
          <h2>${date}</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll Number</th>
              </tr>
            </thead>
            <tbody>
              ${studentRows}
            </tbody>
          </table>`;
      })
      .join('<br>');

    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Attendance History - ${className}</h1>
          ${tableSections}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Export Successful', `PDF saved at: ${uri}`);
    }
  } catch (error) {
    console.error('Error exporting attendance history:', error);
    Alert.alert('Error', 'Failed to export attendance history.');
  }
};
```

---

## Dependencies

- **expo-print**: For generating PDFs.
- **expo-sharing**: For sharing the generated PDF.
- **@react-native-async-storage/async-storage**: For storing and retrieving attendance data.

Install these dependencies with:

```bash
expo install expo-print expo-sharing
npm install @react-native-async-storage/async-storage
```

---

## Contributing

Feel free to fork the repository and submit a pull request with enhancements or bug fixes.

---

## License

This project is licensed under the MIT License.
