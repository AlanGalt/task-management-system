import { createContext } from 'react';

import { LabelData } from '../components/Task/Task.types';

const LabelsContext = createContext<LabelData[] | null>(null);

export default LabelsContext;
