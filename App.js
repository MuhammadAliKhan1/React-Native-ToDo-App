import * as React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, Colors, TextInput } from 'react-native-paper';
import AddTaskScreen from './screens/AddTask';
import TaskScreen from './screens/TaskScreen';




function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [taskItems, setTasks] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (isFocused)
      updateTasks();
  }, [isFocused]);

  const updateTasks = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiGet(keys).then((data) => {
      setTasks(data);

    }).catch((error) => {
      console.log(error);
    });
  }



  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.appbarButtonView}>

          <IconButton
            icon="plus"
            color={Colors.black}
            size={27}
            onPress={() => navigation.navigate('AddTask')} />
        </View>
      ),

    });
  });

  const Task = (props) => {
    const deleteTask = async (title) => {
      try {
        await AsyncStorage.removeItem(title);
        updateTasks();
      }
      catch (exception) {
        console.error(exception)
      }
    }

    return (
      <View style={props.isComplete ? styles.completeitem : styles.item}>

        <View style={styles.itemLeft}>
          <View >
            <Text style={props.isComplete ? styles.completeitemTitle : styles.itemTitle}>{props.title}</Text>
            <View><Text style={props.isComplete ? styles.completeitemDesc : styles.itemDesc}>{props.desc}</Text></View>
          </View>
        </View>

        <IconButton
          icon="delete-forever"
          size={20}
          color='red'
          onPress={() => { deleteTask(props.title) }}
        />

      </View>
    );
  }

  const searchResults = (searchQuery) => {
    let searchedList = []
    taskItems.map((item, index) => {
      if (item[0].includes(searchQuery)) {
        searchedList.push(<TouchableOpacity key={index} onPress={() => JSON.parse(item[1])['isComplete'] ? null : navigation.navigate('CompleteTask', { title: item[0], desc: JSON.parse(item[1])['desc'], isComplete: JSON.parse(item[1])['isComplete'] })}>
          <Task title={item[0]} desc={JSON.parse(item[1])['desc']} isComplete={JSON.parse(item[1])['isComplete']} />
        </TouchableOpacity>)
      }
    })

    return searchedList;
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 10, paddingLeft: 20, paddingRight: 20, }}>
        <TextInput
          mode='outlined'
          label="Search Task"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <ScrollView style={styles.task} contentContainerStyle={{ padding: 20 }}>
        {
          searchQuery.length < 1 ?
            taskItems.map((item, index) => {
              return <TouchableOpacity key={index} onPress={() => JSON.parse(item[1])['isComplete'] ? null : navigation.navigate('CompleteTask', { title: item[0], desc: JSON.parse(item[1])['desc'], isComplete: JSON.parse(item[1])['isComplete'] })}>
                <Task title={item[0]} desc={JSON.parse(item[1])['desc']} isComplete={JSON.parse(item[1])['isComplete']} />
              </TouchableOpacity>
            })
            : searchResults(searchQuery)
        }
      </ScrollView>

    </View>
  );
}


const Stack = createNativeStackNavigator();

function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{ headerStyle: styles.appbarStyle }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'To-Do  ✅',
          }}
        />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="CompleteTask" component={TaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({


  appbarStyle: {
    backgroundColor: '#E8EAED'
  },
  appbarButtonView: {
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },

  input: {
    height: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  //Task UI Style Start
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  completeitem: {
    backgroundColor: '#E8EAED',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },

  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDesc: {
    fontSize: 12,
  },
  completeitemDesc: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 17,

  },
  completeitemTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'

  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  //Task UI Style End

});