// components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, sizes } from '../theme';

export default function CustomButton({
  title,
  onPress,
  iconName,
  style,
  textStyle,
  iconStyle,
  iconPosition = 'left',
}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {iconName && iconPosition === 'left' && (
        <Icon
          name={iconName}
          size={24}
          color={colors.white}
          style={[styles.icon, iconStyle]}
        />
      )}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {iconName && iconPosition === 'right' && (
        <Icon
          name={iconName}
          size={24}
          color={colors.white}
          style={[styles.icon, iconStyle]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: sizes.base/1.2,
    borderRadius: sizes.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: sizes.base / 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: sizes.base,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: sizes.base / 2,
  },
});
