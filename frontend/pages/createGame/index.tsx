import { Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { allSettings } from './gameModes';
import { createGameProps } from '../../types/';
import { GameModeSettings } from '../../types';
import styles from './styles';

export default function CreateGame({ route, navigation }: createGameProps) {

  return (
    <ScrollView>
      <Text style={styles.title}>Choose Gamemode</Text>
      {Object.keys(allSettings).map((key) => {
        const value: GameModeSettings = allSettings[key];
        return (
          <TouchableOpacity key={value.name} style={styles.gamemodeContainer} onPress={() => {
            navigation.navigate('CreateGameSettings', {
              gameModeSettings: value,
            },
            );
          }}>
            <TextInput value={value.name} style={styles.gamemodeContainerTitle} editable={false} />
            <Text>{value.description}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
} 