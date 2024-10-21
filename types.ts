import { type Source, type Minion, type User } from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources: Source[];
}
