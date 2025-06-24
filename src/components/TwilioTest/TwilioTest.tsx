import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTwilio } from '../../utils';

export const TwilioTest: React.FC = () => {
  const twilio = useTwilio();

  const testTwilioConnection = async () => {
    try {
      if (twilio.getConnectionState) {
        const connectionState = await twilio.getConnectionState();
        console.log('Twilio connection state:', connectionState);
      } else {
        console.log('Twilio context is not available or getConnectionState method is missing');
      }
    } catch (error) {
      console.error('Error testing Twilio connection:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Twilio Integration Test</Text>
      <TouchableOpacity 
        onPress={testTwilioConnection}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 10, 
          borderRadius: 5, 
          marginTop: 10 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Test Twilio Connection
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TwilioTest;