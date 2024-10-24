import {
  type Minion,
  type User,
  type Dungeon,
  type MinionSource,
  type Raid,
  type Trial,
  type Mount,
  type MountSource,
  type Orchestrion,
  type OrchestrionSource,
  type Spell,
  type SpellSource,
  type Card,
  type CardStats,
  type CardSource,
} from '@prisma/client';

export interface ExpandedMinion extends Minion {
  owners: User[];
  sources: MinionSource[];
}

export interface ExpandedMount extends Mount {
  owners: User[];
  sources: MountSource[];
}

export interface ExpandedOrchestrion extends Orchestrion {
  owners: User[];
  sources: OrchestrionSource[];
}
export interface ExpandedSpell extends Spell {
  owners: User[];
  sources: SpellSource[];
}
export interface ExpandedCard extends Card {
  owners: User[];
  stats?: CardStats;
  sources: CardSource[];
}
export interface ExpandedDungeon extends Dungeon {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
}

export interface ExpandedRaid extends Raid {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
}

export interface ExpandedTrial extends Trial {
  minions: ExpandedMinion[];
  mounts: ExpandedMount[];
  orchestrions: ExpandedOrchestrion[];
  spells: ExpandedSpell[];
  cards: ExpandedCard[];
}
