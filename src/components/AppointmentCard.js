import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { theme } from '../theme';

const AppointmentCard = ({ 
  doctorName, 
  appointmentType, 
  time, 
  duration, 
  imageUrl,
  onVideoCall,
  isOnline 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageUrl ? { uri: imageUrl } : require('../assets/default-avatar.png')} 
            style={styles.doctorImage} 
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentType}>{appointmentType}</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.time}>
            {time} <Text style={styles.duration}>({duration})</Text>
          </Text>
        </View>
      </View>
      {appointmentType === 'Video Consultation' && (
        <TouchableOpacity style={styles.videoButton} onPress={onVideoCall}>
          <Icon name="videocam" size={24} color={theme.colors.card} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  doctorName: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  time: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  duration: {
    color: theme.colors.grey[600],
  },
  videoButton: {
    backgroundColor: theme.colors.success,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentCard;
