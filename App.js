/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {NativeEventEmitter, NativeModules} from 'react-native';

import ScreenBrightness from 'react-native-screen-brightness';

import {
  HKQuantityTypeIdentifier,
} from '@kingstinct/react-native-healthkit';

import useHealthkitAuthorization from '@kingstinct/react-native-healthkit/src/hooks/useHealthkitAuthorization'

import {
  useMostRecentQuantitySample,
  useMostRecentCategorySample,
} from '@kingstinct/react-native-healthkit';

import HealthKit, {
  HKUnit,
  HKInsulinDeliveryReason,
  HKCategoryTypeIdentifier,
} from '@kingstinct/react-native-healthkit';

const brightnessEmitter = new NativeEventEmitter(ScreenBrightness);

const App = () => {
  const [authStatus, setAuthStatus] = useState({});
  const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    [HKQuantityTypeIdentifier.stepCount, HKQuantityTypeIdentifier.brightness],
  );

  const [canAccessProtectedData, setAccessProtectedData] = useState(false)


  const [brightnessLog, setBrightnessLog] = useState([]);

  console.log("authorizationStatus is", authorizationStatus);

  useEffect(() => {
    // const isAvailable = await HealthKit.isHealthDataAvailable();


    HealthKit.canAccessProtectedData()
      .then(setAccessProtectedData)
      .catch(() => setAccessProtectedData(false));
    brightnessEmitter.addListener('brightnessDidChange', trackBrightness);
  });

  function trackBrightness() {
    // ScreenBrightness.getBrightness().then(brightness => {
    //   console.log('track ** brightness', brightness);
    // });

    // getBrightness().then(brightness => {
    //   const brightnessHistory = loadBrightnessHistory();
    //   brightnessHistory.push(brightness);
    //   saveBrightnessHistory(brightnessHistory);
    //   const isAutoBrightness = brightness === 1;
    //   console.log(
    //     `Current brightness: ${brightness}, isAutoBrightness: ${isAutoBrightness}`,
    //   );
    // });

   
  }

  function loadBrightnessHistory() {
    return brightnessLog;
  }

  function saveBrightnessHistory(history) {
    setBrightnessLog(history);
  }

  const handlePressGetAuthStatus = () => {
    console.log('handle press');

    ScreenBrightness.setBrightness(1); // between 0 and 1

    let options = {
      startDate: new Date(2023, 3, 1).toISOString(),
      includeManuallyAdded: true,

      period: 1444,
    };
  };

  const handleBrightness = () => {
    HealthKit.isAuthorized(
      ['HKQuantityTypeIdentifierBrightness'],
      (err, res) => {
        if (err) {
          console.log('Error checking HealthKit authorization:', err);
        } else if (!res) {
          console.log('HealthKit not authorized');
        } else {
          ScreenBrightness.getBrightness(brightness => {
            const brightnessQuantity = {
              value: brightness,
              startDate: new Date(),
              endDate: new Date(),
              unit: 'lux',
            };
            HealthKit.saveData(
              HKQuantityTypeIdentifier.brightness,
              brightnessQuantity,
              (err, res) => {
                if (err) {
                  console.log('Error saving brightness data:', err);
                } else {
                  console.log('Brightness data saved to Health app:', res);
                }
              },
            );
          });
        }
      },
    );
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

      <TouchableOpacity
        style={{
          width: '80%',
          height: 55,
          backgroundColor: 'orange',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}
        onPress={handleBrightness}>
        <Text style={{color: 'white'}}> Brightness </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
