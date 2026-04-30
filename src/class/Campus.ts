import { dbClient } from "@/lib/db";

// CampusConfigの型だけ定義（クラスではなくプレーンなオブジェクトの型として扱う）
export interface CampusConfigPlain {
  key: string;
  value: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class CampusConfig {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    key: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.key = data.key;
    this.value = data.value;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * データを作成する
   * @param data キャンパスのデータ
   * @returns キャンパスのデータ
   */
  static async create(data: {
    key: string;
    value: string;
  }): Promise<CampusConfig> {
    const created = await dbClient.campus_config.create({
      data: {
        key: data.key,
        value: data.value,
      },
    });
    return new CampusConfig(created);
  }

  /**
   * データをキーで取得
   * @param key 検索対象のデータのキー
   * @returns データ
   */
  static async getByKey(key: string): Promise<CampusConfig | null> {
    const campus = await dbClient.campus_config.findUnique({
      where: { key },
    });
    return campus ? new CampusConfig(campus) : null;
  }

  /**
   * 設定をすべて取得
   * @returns 設定データの配列
   */
  static async getAll(): Promise<CampusConfig[]> {
    const configs = await dbClient.campus_config.findMany();
    return configs.map((config) => new CampusConfig(config));
  }

  /**
   * キャンパスを更新する
   * @returns 更新されたキャンパスのデータ
   */
  async save(): Promise<CampusConfig> {
    const updated = await dbClient.campus_config.update({
      where: { key: this.key },
      data: {
        value: this.value,
      },
    });
    return new CampusConfig(updated);
  }

  async delete() {
    await dbClient.campus_config.delete({
      where: {
        key: this.key,
      },
    });
  }

  toPlain(): CampusConfigPlain {
    return {
      key: this.key,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
