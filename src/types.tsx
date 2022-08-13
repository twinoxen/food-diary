export interface DESCRIPTOR {
  name: string;
  emoji: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  food: string | undefined;
  feeling: DESCRIPTOR | undefined;
  conditions: DESCRIPTOR[] | undefined;
}
