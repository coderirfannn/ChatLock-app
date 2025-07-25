const { width, height } = Dimensions.get('window');

module.exports={
     wrapper: {
    flex: 1,
    backgroundColor: '#EEF2FF', // soft bluish background
  },
  containerFull: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '10'
  },

  hr80: {
    width: '80%',
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 20
  },

  goback: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 20,
    alignItems: 'center'
  },

//   logo1: {
//     resizeMode: "contain",
//     marginBottom: 20
//   },







  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  logo1: {
    width: width * 0.4,
    height: width * 0.4,
    // marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 25,
    textAlign: 'center',
  },
  linkAction: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
}