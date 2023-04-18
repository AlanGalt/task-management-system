import { useCallback, useEffect, useRef, useState } from 'react';

import { db } from '../App';
import { UserData } from '../components/Projects/Project/Project.types';

interface UserSearchParameters {
  uid?: string;
  email?: string;
}

// TODO: bug: when the user doesn't exist the promise never resolves on subsequent requests, because email doesn't change
// potential fix: uid and email inside searchParamert object so that it updates on every call
const useUserIfExists = () => {
  const [user, setUser] = useState<UserData | undefined>({} as UserData);
  const [loading, setLoading] = useState(true);

  const [uid, setUid] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();

  const resolveRef = useRef<(user: UserData | undefined) => void>();

  const usersRef = db.collection('users');

  useEffect(() => {
    let unsubscribe: () => void;

    if (uid) {
      const userDoc = usersRef.doc(uid);
      unsubscribe = userDoc.onSnapshot((docSnapshot) => {
        setUser(docSnapshot.data() as UserData);
        setLoading(false);
      });
      return;
    }

    if (email) {
      const userQuery = usersRef.where('email', '==', email);
      unsubscribe = userQuery.onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          setUser(undefined);
          setLoading(false);
          return;
        }

        setUser(querySnapshot.docs[0].data() as UserData);
        setLoading(false);
      });
      return;
    }

    return () => {
      if (!unsubscribe) return;

      unsubscribe();
    };
  }, [uid, email]);

  useEffect(() => {
    if (loading || !resolveRef.current) return;

    resolveRef.current(user);
    resolveRef.current = undefined;
  }, [user, loading]);

  const getUser = useCallback(
    async ({ uid, email }: UserSearchParameters) => {
      setUid(uid);
      setEmail(email);
      setLoading(true);

      return new Promise<UserData | undefined>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [user, loading, uid, email]
  );

  return getUser;
};

export default useUserIfExists;
