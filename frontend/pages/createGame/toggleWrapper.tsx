import { View, Text, Switch } from 'react-native';
import React from 'react';
import styles from './styles';
import { GameSettings } from '../../types';

type Props = {
  name: keyof GameSettings;
  value: boolean;
  formDispatch: any;
}

export default function ToggleWrapper({ name, value, formDispatch}: Props) {
  return (
    <View style={styles.fieldContainer}>
      <Text>{name}</Text>
      <Switch
        value={value}
        onValueChange={(val) => {
          formDispatch({ name, value: val });
        }}
      />
    </View>
  )
}