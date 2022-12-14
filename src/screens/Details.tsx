import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string,
  solution: string,
  closed: string
}

export default function Details() {
  const route = useRoute()
  const { colors } = useTheme()
  const { orderId } = route.params as RouteParams
  const navigation = useNavigation()
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleCloseOrder = () => {
    if (!solution) {
      return Alert.alert('Encerrar', 'Informe a solução para encerrar a solicitação!')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Sucesso', 'Solicitação encerrada com sucesso!')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        Alert.alert('Erro', 'A solicitação não pôde ser encerrada!')
      })

  }

  useEffect(() => {
    setIsLoading(true)

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const {patrimony, description, status, created_at, closed_at, solution} = doc.data()
        const closed = closed_at ? dateFormat(closed_at) : null
        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        })
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação"/>
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed' ?
          <CircleWavyCheck size={22} color={colors.green[300]}/> : 
          <Hourglass size={22} color={colors.secondary[700]}/>
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails 
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        
        <CardDetails 
          title="solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' &&
        <Button
          title="Encerrar solicitação"
          onPress={handleCloseOrder}
          m={5}
        >

        </Button>
      }
    </VStack>
  );
}