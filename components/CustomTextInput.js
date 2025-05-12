// components/CustomTextInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, sizes } from '../theme';

export default function CustomTextInput({ style, ...props }) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    padding: sizes.base,
    borderRadius: sizes.radius,
    backgroundColor: colors.white,
    fontSize: sizes.base,
    color: colors.textPrimary,
  },
});
