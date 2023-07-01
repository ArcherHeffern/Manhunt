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
  mainCreateGameText: {
    flexGrow: 1,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%'
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
  }
});