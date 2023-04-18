import { useCallback } from 'react';

import { db } from '../App';
import { UserData } from '../components/Projects/Project/Project.types';

// TODO: change single reads to snapshots after adding functionality to change user's info
const useUsers = () => {
  const usersRef = db.collection('users');

  const createUser = useCallback(
    async ({ uid, email, photoURL, name }: UserData) => {
      const userDoc = usersRef.doc(uid);
      const userSnapshot = await userDoc.get();

      if (userSnapshot.exists) return;

      await userDoc
        .set({
          uid,
          email,
          photoURL,
          name,
        })
        .catch(console.error);
    },
    [usersRef]
  );

  return { createUser };
};

export default useUsers;
