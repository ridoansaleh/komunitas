import { StyleSheet } from 'react-native';

const ErrorStyles = StyleSheet.create({
    errorBox: {
        borderBottomWidth : 0
    },
    errorMessage: {
        fontSize: 12,
        color: '#FF5733'
    },
    errorBorder: {
        borderBottomColor: '#FF5733',
        borderBottomWidth: 2
    }
});

export { ErrorStyles };