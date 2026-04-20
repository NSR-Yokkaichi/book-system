import { ulid } from "ulid";
import { dbClient } from "@/lib/db";

export class Campus {
  id: string;
  name: string;
  rentalDeadline: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    name: string;
    rentalDeadline: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.rentalDeadline = data.rentalDeadline;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * キャンパスを作成する
   * @param data キャンパスのデータ
   * @returns キャンパスのデータ
   */
  static async create(data: {
    name: string;
    rentalDeadline?: number;
  }): Promise<Campus> {
    const created = await dbClient.campus.create({
      data: {
        id: ulid(),
        name: data.name,
        rentalDeadline: data.rentalDeadline,
      },
    });
    return new Campus(created);
  }

  /**
   * キャンパスをIDで検索する
   * @param id キャンパスのID
   * @returns キャンパスのデータ
   */
  static async getById(id: string): Promise<Campus | null> {
    const campus = await dbClient.campus.findUnique({
      where: { id },
    });
    return campus ? new Campus(campus) : null;
  }

  /**
   * キャンパスを全て取得する
   * @returns キャンパスのデータの配列
   */
  static async getAll(): Promise<Campus[]> {
    const campuses = await dbClient.campus.findMany();
    return campuses.map((campus) => new Campus(campus));
  }

  /**
   * キャンパスを名前で検索する
   * @param name キャンパスの名前
   * @returns キャンパスのデータの配列
   */
  static async searchByName(name: string): Promise<Campus[]> {
    const campuses = await dbClient.campus.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    return campuses.map((campus) => new Campus(campus));
  }

  /**
   * キャンパスを更新する
   * @returns 更新されたキャンパスのデータ
   */
  async save(): Promise<Campus> {
    const updated = await dbClient.campus.update({
      where: { id: this.id },
      data: {
        name: this.name,
        rentalDeadline: this.rentalDeadline,
      },
    });
    return new Campus(updated);
  }
}
