import AsyncStorage from '@react-native-async-storage/async-storage';

export function getUsernameFromStorage(setUsername: React.Dispatch<React.SetStateAction<string|null>>) {
  AsyncStorage.getItem('username').then((username) => {
    if (username) {
      setUsername(username);
    }
  })
}

export function setUsernameInStorage(username: string) {
  AsyncStorage.setItem('username', username);
}