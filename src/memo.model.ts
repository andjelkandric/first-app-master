export interface Memo {
  id?: string; //? znaci da je optional
  idMemo?: string;
  userId: string;
  title: string;
  content: string;
  createdAt: any;
}
