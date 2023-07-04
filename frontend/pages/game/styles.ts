import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 20,
  },
  fadeIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }, 
  fadeInText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  playerListContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  }, 
  playerListContainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  playerListContainerItem: {
    fontSize: 12,
    textAlign: 'center',
  }
});