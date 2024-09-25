// TodoList.js
import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('todo.db');

const TodoList = ({ groupId }) => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Load tasks for the selected group
  useEffect(() => {
    loadTasks();
  }, [groupId]);

  const loadTasks = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE groupId = ?',
        [groupId],
        (_, { rows }) => {
          setTasks(rows._array);
        }
      );
    });
  };

  // Add a new task
  const addTask = () => {
    if (!taskTitle || !taskDescription) return;
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (groupId, title, description, completed) VALUES (?, ?, ?, 0)',
        [groupId, taskTitle, taskDescription],
        () => {
          loadTasks();
          setTaskTitle('');
          setTaskDescription('');
        }
      );
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter task title"
        value={taskTitle}
        onChangeText={setTaskTitle}
        style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter task description"
        value={taskDescription}
        onChangeText={setTaskDescription}
        style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 10, fontSize: 18 }}>
            {item.title}: {item.description}
          </Text>
        )}
      />
    </View>
  );
};

export default TodoList;
