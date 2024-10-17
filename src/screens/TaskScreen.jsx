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
          <View style={{flexDirection:'row',alignContent:'space-between',alignItems:"flex-end"}}>
          <Text style={{color: 'black'}}>Status:</Text>
          <View>
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
                    setEditingTaskId(item.id); 
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
              </Text> 
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
    backgroundColor: '#f0f4f7', 
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, 
    color: '#333', 
  },
  taskInputContainer: {
    marginBottom: 20, 
    padding: 10,
    backgroundColor: '#fff', 
    borderRadius: 8,
    elevation: 3, 
  },
  input: {
    borderColor: '#d1d5db', 
    borderWidth: 1,
    padding: 12, 
    marginBottom: 15,
    borderRadius: 8, 
    backgroundColor: '#fff',
    color: '#000', 
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    color: '#555', 
    marginRight: 10,
  },
  taskContainer: {
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingVertical: 16, 
    paddingHorizontal: 20,
    marginBottom: 15, 
    borderColor: '#e2e8f0', 
    borderWidth: 1,
    elevation: 2, 
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077cc',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color:'#28a745', 
    marginBottom: 8,
  },
  btncon: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: 10,
  },
  editText: {
    color: '#fff', 
    fontSize: 14,
    fontWeight: '500',
  },
  deleteText: {
    color: '#fff', 
    fontSize: 14,
    fontWeight: '500',
  },
  editbtn: {
    backgroundColor: '#007bff', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, 
    elevation: 2,
  },
  deletebtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  noPermissionText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
  },
  container: {
    marginBottom: 8, 
  },
});


export default TaskScreen;
