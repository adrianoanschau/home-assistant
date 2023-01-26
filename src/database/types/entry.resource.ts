type EntryValue = {
  entryId?: string;
  estimated?: number;
  realized: boolean;
  value: number;
};

export type EntryResource = {
  id: string;
  description?: string;
  year: number;
  jan?: EntryValue;
  fev?: EntryValue;
  mar?: EntryValue;
  abr?: EntryValue;
  mai?: EntryValue;
  jun?: EntryValue;
  jul?: EntryValue;
  ago?: EntryValue;
  set?: EntryValue;
  out?: EntryValue;
  nov?: EntryValue;
  dez?: EntryValue;
};
