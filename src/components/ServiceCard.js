import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { theme } from '../theme';

const ServiceCard = ({ icon, title, subtitle, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}80` }]}>
        <Icon name={icon} size={24} color={theme.colors.text} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xs,
    minHeight: 140,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.grey[600],
  },
});

export default ServiceCard;
