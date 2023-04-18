import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';

import { ListData } from '../../components/List/List.types';

export const listConverter: FirestoreDataConverter<ListData> = {
  toFirestore(list: ListData): DocumentData {
    const { id, ...listData } = list;
    return id ? { id, ...listData } : listData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ListData {
    const data = snapshot.data(options) as ListData;
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt as Timestamp,
    };
  },
};
