import { TextInput, View, Text } from "react-native";
import styles from "./styles";
import { GameSettings } from "../../types";

type Props = {
  name: keyof GameSettings;
  formDispatch: any;
  value: number;
}

export default function NumericInputWrapper({name, formDispatch, value}: Props) {
  return (
    <View style={styles.fieldContainer}>
      <Text>{name}</Text>
      <TextInput
        placeholder={value.toString()}
        keyboardType='numeric'
        onChangeText={(val) => {
          formDispatch({ name, value: parseInt(val) });
        }}
        style={styles.field}
      />
    </View>
  )
}