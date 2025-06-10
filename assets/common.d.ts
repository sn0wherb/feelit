declare type EmotionType = {
  id: number;
  name: string;
  parent: string | null;
  color: string;
  level: number;
  isCustom: number;
  hidden: boolean;
};

type InitialLogType = {
  id: number;
  emotion_name: string | null;
  emotion_id: number | null;
  root: string;
  need: string;
  extra: string;
  created_at: string;
  isEdited: number;
};

type CompleteLogType = {
  id: number;
  emotion: EmotionType;
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
