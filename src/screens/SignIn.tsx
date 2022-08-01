import React, { useState } from 'react';
import { Heading, Icon, useTheme, VStack} from 'native-base';
import Logo from '../assets/logo_primary.svg'
import { Input } from '../components/Input';
import { Envelope, Key } from 'phosphor-react-native';
import { Button } from '../components/Button';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const {colors} = useTheme()

  const handleSignIn = () => {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe E-mail e Senha!')
    }
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido!')
        }

        if (error.code === 'auth/user-not-found'){
          return Alert.alert('Entrar', 'Usuário não cadastrado!')
        }

        if (error.code === 'auth/wrong-password'){
          return Alert.alert('Entrar', 'E-mail ou Senha inválida!')
        }

        return Alert.alert('Entrar', 'Não foi possível acessar!')
      })
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo/>
      <Heading color='gray.100' fontSize='xl' mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input 
        placeholder="E-mail" 
        mb={4} 
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} /> } ml={4}/>}
        value={email}
        onChangeText={setEmail}
      />
      <Input 
        placeholder="Senha"
        mb={8} 
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} /> } ml={4}/>}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading}/>
    </VStack>
  )
}

export default SignIn;