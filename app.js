import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('todo.db');

export default function App() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');

  // Create tables on initial load
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, groupId INTEGER, title TEXT, description TEXT, completed INTEGER);'
      );
      loadGroups();
    });
  }, []);

  // Load all groups
  const loadGroups = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM groups', [], (_, { rows }) => {
        setGroups(rows._array);
      });
    });
  };

  // Add a new group
  const addGroup = () => {
    if (!groupName) return;
    db.transaction(tx => {
      tx.executeSql('INSERT INTO groups (name) VALUES (?)', [groupName], () => {
        loadGroups();
        setGroupName('');
      });
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter group name"
        value={groupName}
        onChangeText={setGroupName}
        style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Add Group" onPress={addGroup} />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 10, fontSize: 18 }}>{item.name}</Text>
        )}
      />
    </View>
  );
}
