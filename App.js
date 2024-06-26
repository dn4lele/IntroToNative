import * as React from "react";
import { useState } from "react";
import {
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { faker } from "@faker-js/faker";
import TextAvatar from "react-native-text-avatar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser, useSetUser, UserProvider } from "./contexts/UserContext";

function colorHash(inputString) {
  var sum = 0;

  for (var i in inputString) {
    sum += inputString.charCodeAt(i);
  }

  r = ~~(
    ("0." +
      Math.sin(sum + 1)
        .toString()
        .substr(6)) *
    256
  );
  g = ~~(
    ("0." +
      Math.sin(sum + 2)
        .toString()
        .substr(6)) *
    256
  );
  b = ~~(
    ("0." +
      Math.sin(sum + 3)
        .toString()
        .substr(6)) *
    256
  );

  var rgb = "rgb(" + r + ", " + g + ", " + b + ")";

  var hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(18)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(20)).substr(-2, 2).toUpperCase();

  return {
    r: r,
    g: g,
    b: b,
    rgb: rgb,
    hex: hex,
  };
}

function Create_User() {
  const users = useUser();
  const setUsers = useSetUser();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  function give_faker_data() {
    setName(faker.person.firstName());
    setLastName(faker.person.lastName());
    setAge("" + Math.floor(Math.random() * 100));
    setGender(faker.person.sexType());
    setEmail(faker.internet.email());
  }

  function submit_user() {
    const newuser = {
      FirstName: name,
      LastName: lastName,
      Age: age,
      Gender: gender,
      Email: email,
    };
    setUsers([...users, newuser]);

    setName("");
    setLastName("");
    setAge("");
    setGender("");
    setEmail("");

    alert("User was created");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Create User</Text>

      <TextAvatar
        style={styles.TextAvatar}
        backgroundColor={colorHash(name).hex}
        textColor={colorHash(lastName).hex}
        size={60}
        type={"circle"}
      >
        {name + " " + lastName}
      </TextAvatar>

      <TextInput
        style={styles.input}
        placeholder="FirstName"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="LastName"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.button}>
        <Button title="Submit User" onPress={() => submit_user()} />
        <Button title="Give faker data" onPress={() => give_faker_data()} />
      </View>
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { user } = route.params;
  return (
    <View style={styles.detailContainer}>
      <TextAvatar
        style={styles.TextAvatar}
        backgroundColor={colorHash(user.FirstName).hex}
        textColor={colorHash(user.LastName).hex}
        size={60}
        type={"circle"}
      >
        {user.FirstName + " " + user.LastName}
      </TextAvatar>
      <Text style={styles.Name}>Name: {user.FirstName}</Text>
      <Text style={styles.Name}>Last Name: {user.LastName}</Text>
      <Text style={styles.Name}>Age: {user.Age}</Text>
      <Text style={styles.Name}>Gender: {user.Gender}</Text>
      <Text style={styles.Name}>Email: {user.Email}</Text>

      <Button title="Back to List" onPress={() => navigation.goBack()} />
    </View>
  );
}

function Users_List({ navigation }) {
  const users = useUser();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Users List!</Text>
      <FlatList
        style={{ width: "100%" }}
        data={users}
        renderItem={({ item }) => (
          <View style={styles.Item}>
            <TextAvatar
              style={styles.TextAvatar}
              backgroundColor={colorHash(item.FirstName).hex}
              textColor={colorHash(item.LastName).hex}
              size={60}
              type={"circle"}
            >
              {item.FirstName + " " + item.LastName}
            </TextAvatar>

            <Text style={styles.Name}>{item.FirstName}</Text>
            <Text style={styles.Email}>{item.Email}</Text>
            <Button
              title="Show all info"
              onPress={() => navigation.navigate("Details", { user: item })}
            />
          </View>
        )}
        keyExtractor={(item) => item.Email}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Users"
        component={Users_List}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Create_User" component={Create_User} />
          <Tab.Screen name="Users_List" component={UserStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  TextAvatar: {
    margin: 25,
  },
  Name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  Email: {
    fontSize: 15,
  },
  Item: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    padding: 10,
    margin: 10,
    flexDirection: "column",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
});
