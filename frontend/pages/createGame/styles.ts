import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  fieldContainer: {
    paddingVertical: 5,
    width: '100%',
    flexDirection: 'row',
  }, 
  field: {
    borderColor: '#000',
    marginLeft: 10,
    borderBottomWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  gamemodeContainer: {
    borderColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 10,
  },
  gamemodeContainerTitle: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  mainCreateGameText: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
});