export class Category {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly parent_id: number | null
  ) {}
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}