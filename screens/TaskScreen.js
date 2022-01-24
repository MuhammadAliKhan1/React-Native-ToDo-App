import * as React from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, Colors } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

function TaskScreen({ route, navigation }) {
    const { title, desc, isComplete } = route.params;
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<View style={styles.appbarButtonView}><IconButton
                icon="check-circle"
                color={Colors.green500}
                size={27}
                onPress={() => {
                    toggleIsComplete();
                    navigation.goBack();
                }}
            /></View>),
        });
    });

    const toggleIsComplete = async () => {
        const data = { 'desc': `${desc}`, 'isComplete': `${!isComplete}` }
        try {
            const jsonData = JSON.stringify(data)
            await AsyncStorage.setItem(title, jsonData)
        } catch (e) {
            // saving error
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemDesc}>{desc}</Text>
        </View>
    );
}

export default TaskScreen;

const styles = StyleSheet.create({
    appbarStyle: {
        backgroundColor: '#E8EAED'
    },
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
        padding: 20,
    },
    itemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-medium',
    },
    itemDesc: {
        fontSize: 17,
        fontWeight: '600',
        fontFamily: 'sans-serif-light',
        marginTop: 10,
        marginLeft: 10
    }
});