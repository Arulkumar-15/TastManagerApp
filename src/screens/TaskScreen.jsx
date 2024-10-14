import React, { useEffect, useState } from 'react';
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
import { auth, db } from '../firebase/firebaseDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'; // Import Firestore methods

const TaskScreen = () => {
  const [email, setEmail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'in progress' });

  // Retrieve the stored email on mount
  useEffect(() => {
    const getEmailFromStorage = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail');
      setEmail(userEmail || 'Unknown User');
    };
    getEmailFromStorage();

    // Set up real-time listener for tasks
    const taskCollection = collection(db, 'tasks');
    const unsubscribe = onSnapshot(taskCollection, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle adding a new task
  const addTask = async () => {
    if (!newTask.title || !newTask.description) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), newTask);
      setNewTask({ title: '', description: '', status: 'in progress' });
      Alert.alert('Task added successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to handle editing a task
  const editTask = async (id) => {
    const updatedTask = { ...newTask }; // Modify the task data
    const taskRef = doc(db, 'tasks', id);

    try {
      await updateDoc(taskRef, updatedTask);
      Alert.alert('Task updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to handle deleting a task
  const deleteTask = async (id) => {
    const taskRef = doc(db, 'tasks', id);

    try {
      await deleteDoc(taskRef);
      Alert.alert('Task deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.emailText}>Logged in as: {email}</Text>

      <View style={styles.taskInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Task Description"
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
        />
        <View style={styles.statusContainer}>
          <Text>Status:</Text>
          <Button
            title={newTask.status === 'in progress' ? 'In Progress' : 'Completed'}
            onPress={() =>
              setNewTask({ ...newTask, status: newTask.status === 'in progress' ? 'completed' : 'in progress' })
            }
          />
        </View>
        <Button title="Add Task" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
            <TouchableOpacity onPress={() => setNewTask(item)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
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
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskInputContainer: {
    marginBottom: 24,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskContainer: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editText: {
    color: 'blue',
    marginTop: 4,
  },
  deleteText: {
    color: 'red',
    marginTop: 4,
  },
});

export default TaskScreen;
