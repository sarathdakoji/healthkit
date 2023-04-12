/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

import {NativeEventEmitter, NativeModules} from 'react-native';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
};

AppleHealthKit.initHealthKit(permissions, error => {
  if (error) {
    console.log('[ERROR] Cannot grant permissions!');
  }

  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
  };

  AppleHealthKit.getHeartRateSamples(options, (callBackError, results) => {
    console.log('results are', results);
  });
});

const App = () => {
  const [authStatus, setAuthStatus] = useState({});

  useEffect(() => {
    new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
      'healthKit:HeartRate:new',
      async () => {
        console.log('--> observer triggered');
      },
    );
  });

  const handlePressGetAuthStatus = () => {
    console.log("handle press");
    AppleHealthKit.getAuthStatus(permissions, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log("result is", result);
      setAuthStatus(result);
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          width: '80%',
          height: 55,
          backgroundColor: 'gray',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handlePressGetAuthStatus}>
        <Text style={{color: 'white'}}> Health </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
