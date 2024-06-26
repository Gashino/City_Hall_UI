import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useAuth } from "../../../context/auth";
import { Icon, Image, Text } from "@rneui/base";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../../../services/userService";
import { usePushNotifications } from "../../../context/usePushNotifications";
import { getNotifications } from "../../../services/dataService";
import { router } from "expo-router";

const urlPhoto = require("../../../assets/images/profileAvatar.png");

const PerfilPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { user } = useAuth();
  const { expoPushToken } = usePushNotifications();
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (expoPushToken === undefined || expoPushToken === null) return;
    const setearNotificaciones = async () => {
      const token = expoPushToken.data.toString();
      const data = await getNotifications(token);
      setNotifications(data);
    };

    setearNotificaciones();
  }, [expoPushToken]);

  const handleNewPassword = async () => {
    if (newPassword === repeatPassword && newPassword !== "") {
      const response = await changePassword(user.email, newPassword);
      if (response === 200) {
        Alert.alert("Éxito", "Clave actualizada correctamente");
        setNewPassword("");
        setRepeatPassword("");
      } else {
        Alert.alert("Error", "No se pudo actualizar la clave");
      }
    } else {
      Alert.alert("Error", "Las claves no coinciden o están vacías");
    }
  };

  const handleNotificaciones = () => {
    router.navigate({
      pathname: "perfil/modalNotificaciones",
      params: { notificaciones: JSON.stringify(notifications) },
    });
  };

  const crearBotonServiciosOption = () =>
    Alert.alert("Crear Servicio", "¿Qué tipo de servicio desea crear?", [
      {
        text: "Normal",
        onPress: () =>
          router.navigate({
            pathname: "servicioCreation",
            params: { tipo: "normal" },
          }),
        style: "default",
      },
      {
        text: "Profesional",
        onPress: () =>
          router.navigate({
            pathname: "servicioCreation",
            params: { tipo: "profesional" },
          }),
        style: "destructive",
      },
    ]);

  return (
    <View style={styles.container}>
      <View style={[{ height: 300 }, styles.card]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image source={urlPhoto} style={styles.image}></Image>
          <View style={styles.viewSaludo}>
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 20 }}>
              Hola, {user.name} !
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "column",
            padding: 10,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Text style={styles.datosHeader}>Documento: {user.document}</Text>
          {!user.isAdmin ? (
            <>
              <Text style={styles.datosHeader}>
                Direccion: {user.direction}
              </Text>
              <Text style={styles.datosHeader}>Barrio: {user.district}</Text>
            </>
          ) : (
            <>
              <Text style={styles.datosHeader}>Sector: {user.department}</Text>
              <Text style={styles.datosHeader}>
                Fecha Ingreso: {user.startDate.substring(0, 10)}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.headerPassword}>
        <Text style={styles.textPassword}>Cambio de clave</Text>
      </View>
      <View style={[{ height: 180 }, styles.card]}>
        <View style={styles.containerInput}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Nueva clave</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextInput
              value={newPassword}
              style={styles.input}
              placeholder="Escribir..."
              placeholderTextColor={"white"}
              secureTextEntry={true}
              onChangeText={(text) => {
                setNewPassword(text);
              }}
            ></TextInput>
          </View>
        </View>
        <View style={styles.containerInput}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingTop: 10,
              paddingLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Repetir clave</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextInput
              value={repeatPassword}
              style={styles.input}
              placeholder="Escribir nuevamente..."
              placeholderTextColor={"white"}
              secureTextEntry={true}
              onChangeText={(text) => {
                setRepeatPassword(text);
              }}
            ></TextInput>
          </View>
        </View>
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Button
            radius={"md"}
            color={"black"}
            title={"Aceptar"}
            size="sm"
            style={{
              width: 110,
              marginTop: 13,
            }}
            onPress={handleNewPassword}
          ></Button>
        </View>
      </View>
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          disabled={user.isAdmin}
          color={"#4624b5"}
          size="lg"
          title={"Crear Servicio"}
          style={{
            width: 180,
          }}
          radius={"md"}
          icon={
            <Icon
              name="add-circle-outline"
              size={24}
              color="white"
              iconStyle={{ marginLeft: 10 }}
            />
          }
          iconRight
          onPress={crearBotonServiciosOption}
        />
        <Pressable
          style={{ flexDirection: "row", justifyContent: "center" }}
          onPress={handleNotificaciones}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            Notificaciones
          </Text>
          <Ionicons name="notifications-outline" size={25} color="black" />
        </Pressable>
      </View>
      <View style={{ marginTop: 10, padding: 20, marginBottom: 5 }}></View>
    </View>
  );
};

export default PerfilPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    padding: 8,
    justifyContent: "space-between",
    backgroundColor: "#b6c2d1",
  },
  card: {
    marginTop: 5,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 15,
    elevation: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textPassword: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  headerPassword: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 10,
    fontFamily: "Rubik_500Medium",
  },
  input: {
    height: 40,
    width: "95%",
    color: "white",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#dedfe0",
    opacity: 1,
    marginTop: 2,
  },
  viewSaludo: {
    backgroundColor: "#4624b5",
    padding: 4,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 2,
  },
  image: {
    height: 110,
    width: 110,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100,
  },
  datosHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
