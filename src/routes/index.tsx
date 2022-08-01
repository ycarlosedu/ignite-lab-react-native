import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import SignIn from "../screens/SignIn";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Loading } from "../components/Loading";

export default function Routes(){
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

  useEffect(() => {
    const subscriber = auth()
    .onAuthStateChanged(response => {
      setUser(response)
      setIsLoading(false)
    })
    return subscriber
  }, [])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes/> : <SignIn/>}
    </NavigationContainer>
  )
}