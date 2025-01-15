import React from 'react';
import { Platform, Text } from 'react-native';

const Icon = ({ name, size = 24, color, style }) => {
  if (Platform.OS === 'web') {
    return (
      <span 
        className="material-icons"
        style={{
          fontSize: size,
          color: color,
          ...style,
        }}
      >
        {name}
      </span>
    );
  } else {
    // For native platforms, you'll need to install and link react-native-vector-icons
    return <Text>Icon not supported</Text>;
  }
};

export default Icon;
