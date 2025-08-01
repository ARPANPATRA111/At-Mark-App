// theme.js
export const colors = {
  // Primary colors
  primary: '#3498db',        // Blue
  primaryDark: '#2980b9',    // Darker blue
  primaryLight: '#4eaaf3',   // Lighter blue
  
  // Secondary colors
  secondary: '#2ecc71',      // Green
  secondaryDark: '#27ae60',  // Darker green
  secondaryLight: '#42d28c', // Lighter green
  
  // Danger colors
  danger: '#e74c3c',        // Red
  dangerDark: '#c0392b',     // Darker red
  dangerLight: '#f19483',    // Lighter red
  
  // Background colors
  background: '#ecf0f1',     // Light gray
  backgroundAlt: '#bdc3c7',  // Medium gray
  backgroundDark: '#95a5a6', // Dark gray
  
  // Text colors
  textPrimary: '#2c3e50',    // Dark blue-gray
  textSecondary: '#7f8c8d',  // Medium gray
  textMuted: '#bdc3c7',      // Light gray
  textError: '#e74c3c',      // Error red
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Accent colors
  accentPurple: '#9b59b6',   // Purple
  accentYellow: '#f1c40f',   // Yellow
  accentOrange: '#e67e22',   // Orange
  
  // Border colors
  borderPrimary: '#bdc3c7',
  borderSecondary: '#95a5a6',
  
  // Success colors
  success: '#27ae60',        // Green
  successDark: '#219a52',    // Darker green
  successLight: '#42d28c',   // Lighter green
  
  // Warning colors
  warning: '#f39c12',       // Orange
  warningDark: '#d35400',   // Darker orange
  warningLight: '#f4bc44',  // Lighter orange
};

export const fonts = {
  regular: 'System',
  bold: 'System',
};

export const sizes = {
  base: 14,  // Reduced from 16
  small: 12,
  large: 16,
  xlarge: 18,
  padding: 12,  // Reduced from 20
  margin: 12,   // Reduced from 20
  radius: 6,    // Reduced from 8
  icon: 24,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};




/*


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.padding,
  },
  scrollContainer: {
    paddingBottom: 80, // Space for the create button
  },
  input: {
    marginBottom: sizes.margin,
  },
  sectionTitle: {
    fontSize: sizes.base,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: sizes.base,
  },
  batchesContainer: {
    marginBottom: sizes.margin,
  },
  batchButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginBottom: sizes.base / 2,
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
    padding: sizes.base,
    marginBottom: sizes.margin,
  },
  previewTitle: {
    fontSize: sizes.base,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: sizes.base,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.base / 2,
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
    bottom: sizes.padding,
    left: sizes.padding,
    right: sizes.padding,
  },
});




 */