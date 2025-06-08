declare type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
  hidden: boolean;
};

type LogType = {
  id: number;
  emotion: string;
  color: string;
  root: string;
  need: string;
  extra: string;
  created_at: string;
  isEdited: number;
};

type StrokeType = [string[], string, number];

type SvgDataType = {
  id: number;
  path: string;
  color: string;
  size: number;
};

type SelectionType = {
  id: number;
  name: string;
  color: string;
  selected: boolean;
};

type DiaryType = {
  root: string | undefined;
  need: string | undefined;
  extra: string | undefined;
};

type YearType = [Date[]];
