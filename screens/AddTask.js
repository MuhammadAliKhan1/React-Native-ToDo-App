import * as React from 'react';
import { View, Text, StyleSheet, Keyboard, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


function AddTaskScreen() {
    const [task, setTask] = React.useState();
    const [desc, setDesc] = React.useState();

    const addingTaskHandller = async () => {
        const data = { 'desc': `${desc}`, 'isComplete': false }
        Keyboard.dismiss();
        try {
            await AsyncStorage.setItem(task.toString(), JSON.stringify(data))
        } catch (e) {
            console.error(e);
        }

        setTask(null);
        setDesc(null);
    }

    return (
        <View style={styles.container}>
            <TextInput
                mode='outlined'
                label="Title"
                value={task}
                onChangeText={text => setTask(text)}
            />
            <TextInput
                mode='outlined'
                multiline={true}
                numberOfLines={5}
                label="Description"
                value={desc}
                onChangeText={text => setDesc(text)}
            />
            <Button
                mode='contained'
                color='#55BCF6'
                marginTop={30}
                labelStyle={{ color: 'white' }}
                onPress={addingTaskHandller} >
                Add new task
            </Button>

        </View>
    );
}
export default AddTaskScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
        padding: 30
    },
});