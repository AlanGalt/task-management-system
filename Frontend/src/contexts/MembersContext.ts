import { createContext } from 'react';

import { Member } from '../components/Projects/Project/Project.types';

const MembersContext = createContext<Member[] | null>(null);

export default MembersContext;
