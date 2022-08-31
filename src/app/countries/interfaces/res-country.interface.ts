export interface Country {
  name: Name;
  ccn3: string;
}

export interface Name {
  common: string;
  official: string;
}

export interface NativeName {
  official: string;
  common: string;
}

export interface Borders {
  borders: string[];
}
