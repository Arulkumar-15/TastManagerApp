import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {auth, db} from '../firebase/firebaseDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

const TaskScreen = () => {
  const [email, setEmail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'in progress',
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const getEmailFromStorage = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail');
      setEmail(userEmail || 'Unknown User');
    };
    getEmailFromStorage();

    const taskCollection = collection(db, 'tasks');
    const unsubscribe = onSnapshot(taskCollection, snapshot => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      const taskWithUserEmail = {...newTask, email};
      await addDoc(collection(db, 'tasks'), taskWithUserEmail);
      setNewTask({title: '', description: '', status: 'in progress'});
      Alert.alert('Task added successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const editTask = async () => {
    if (!newTask.title || !newTask.description) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const taskRef = doc(db, 'tasks', editingTaskId);
    try {
      const taskToUpdate = tasks.find(task => task.id === editingTaskId);
      if (taskToUpdate.email !== email) {
        Alert.alert('Error', 'You do not have permission to edit this task.');
        return;
      }

      await updateDoc(taskRef, newTask);
      setNewTask({title: '', description: '', status: 'in progress'});
      setEditingTaskId(null);
      Alert.alert('Task updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteTask = async id => {
    const taskRef = doc(db, 'tasks', id);

    try {
      const taskToDelete = tasks.find(task => task.id === id);
      if (taskToDelete.email !== email) {
        Alert.alert('Error', 'You do not have permission to delete this task.');
        return;
      }

      await deleteDoc(taskRef);
      Alert.alert('Task deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.emailText}>User Email: {email}</Text>

      <View style={styles.taskInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask.title}
          onChangeText={text => setNewTask({...newTask, title: text})}
          placeholderTextColor={'black'}
        />
        <TextInput
          style={styles.input}
          placeholder="Task Description"
          value={newTask.description}
          onChangeText={text => setNewTask({...newTask, description: text})}
          placeholderTextColor={'black'}
        />
        <View style={styles.statusContainer}>
          <Text style={{color: 'black'}}>Status:</Text>
          <View style={{marginLeft:230}}>
          <Button 
            title={
              newTask.status === 'in progress' ? 'In Progress' : 'Completed'
            }
            onPress={() =>
              setNewTask({
                ...newTask,
                status:
                newTask.status === 'in progress'
                ? 'completed'
                : 'in progress',
              })
            }
            />
            </View>
        </View>
        {editingTaskId ? (
          <Button title="Update Task" onPress={editTask} />
        ) : (
          <Button title="Add Task" onPress={addTask} />
        )}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.taskContainer}>
            <View style={styles.container} >
            <Text style={styles.taskTitle}>Task by {item.email}</Text>
            <Text style={styles.taskTitle}>Title : {item.title}</Text>
            <Text style={{color:'black'}}>Description : {item.description}</Text>
            <Text style={styles.statusText}>Status: {item.status}</Text>
            </View>
            {item.email === email ? (
              <>
              <View style={styles.btncon}>
                <TouchableOpacity style={styles.editbtn}
                  onPress={() => {
                    setNewTask(item);
                    setEditingTaskId(item.id); // Set the editing task ID
                  }}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deletebtn}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
                    </View>
              </>
            ) : (
              <Text style={styles.noPermissionText}>
                No permission to edit/delete
              </Text> // This is also wrapped
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', 
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#343a40', 
  },
  taskInputContainer: {
    marginBottom: 24,
  },
  input: {
    borderColor: '#6c757d',
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 4, 
    backgroundColor: '#ffffff',
    color: 'black',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskContainer: {
    borderBottomWidth: 1,
    borderColor: '#ced4da', 
    paddingVertical: 12,
    backgroundColor: '#ffffff', 
    borderRadius: 4, 
    marginBottom: 8,
    borderRadius:10

  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff', 
  },
  statusText: {
    color: '#28a745',
  },
  editText: {
    color: 'white', 
    marginTop: 4,
  },
  deleteText: {
    color: 'white', 
    marginTop: 4,
    
  },
  noPermissionText: {
    color: '#6c757d', 
    marginTop: 4,
  },
  deletebtn:{
    backgroundColor:'#dc3545',
    width:70,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
    marginLeft:"80%"
  },
  container:{
    marginLeft:10
  },
  editbtn:{
    backgroundColor:'blue',
    width:70,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
    marginLeft:"80%",
    marginBottom:10
  },
  
});

export default TaskScreen;
