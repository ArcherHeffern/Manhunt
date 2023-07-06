import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
      textAlign: 'center',
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
  body: {
    flex: 1,
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
  }, 
  modalContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '50%',
    borderColor: '#000',
    borderWidth: 5
  }, 
  compassContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  compass: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
});