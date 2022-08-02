import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderFirestoreDTO = {
  patrimony: string,
  status: 'open' | 'closed',
  description: string,
  created_at: FirebaseFirestoreTypes.Timestamp,
  closed_at?: FirebaseFirestoreTypes.Timestamp,
  solution?: string
}