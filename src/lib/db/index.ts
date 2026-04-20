/** biome-ignore-all lint/suspicious/noExplicitAny: このファイルにはユーザー側が定義するデータのスキームを含むため、anyは用いられていて良いものとする */
const BASE_URL = process.env.PHP_CRUD_API_URL
  ? `${process.env.PHP_CRUD_API_URL}/records`
  : "http://localhost/api.php/records";

// ==========================================
// ユーティリティ関数
// ==========================================
const formatDataForDb = (data: Record<string, any>) => {
  if (!data) return data;
  const formatted = { ...data };
  for (const [key, value] of Object.entries(formatted)) {
    if (value instanceof Date) {
      formatted[key] = value.toISOString().slice(0, 19).replace("T", " ");
    }
  }
  return formatted;
};

// ==========================================
// モデルデリゲート (型 T はデフォルトで any)
// ==========================================
class ModelDelegate<T = any> {
  constructor(
    private tableName: string,
    private fetchOptions?: RequestInit | null,
  ) {}

  private buildQuery(args?: {
    where?: Record<string, any>;
    include?: Record<string, boolean>;
  }) {
    const params = new URLSearchParams();

    if (args?.where) {
      // 値の形式をチェックして filter パラメータを追加するヘルパー関数
      const appendFilter = (key: string, value: any, filterKey = "filter") => {
        let operator = "eq";
        let val = value;

        // Prismaの { contains: "xxx" } のようなオブジェクト形式の場合
        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof Date)
        ) {
          if ("contains" in value) {
            operator = "cs"; // php-crud-api の contains 演算子
            val = value.contains;
            // mode: "insensitive" はMySQLの collation 側で吸収されるため無視でOK
          }
          // ※ 将来的に { gt: 10 } (より大きい) などに対応したい場合はここに条件を足せる
        }

        if (val instanceof Date) {
          val = val.toISOString().slice(0, 19).replace("T", " ");
        }

        if (val !== undefined && val !== null) {
          params.append(filterKey, `${key},${operator},${val}`);
        }
      };

      // where句の解析
      for (const [key, value] of Object.entries(args.where)) {
        if (key === "OR" && Array.isArray(value)) {
          // OR配列の処理
          // php-crud-api は "filter1" のように同じ数字のついたパラメータを OR で結合する
          value.forEach((condition) => {
            for (const [orKey, orValue] of Object.entries(condition)) {
              appendFilter(orKey, orValue, "filter1");
            }
          });
        } else {
          // 通常の処理 (AND結合される)
          appendFilter(key, value, "filter");
        }
      }
    }

    // JOIN (include) の処理
    if (args?.include) {
      for (const [key, value] of Object.entries(args.include)) {
        if (value) params.append("join", key);
      }
    }

    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  async findMany(args?: {
    where?: Record<string, any>;
    include?: Record<string, boolean>;
  }): Promise<T[]> {
    const res = await fetch(
      `${BASE_URL}/${this.tableName}${this.buildQuery(args)}`,
      { cache: "no-store", ...(this.fetchOptions || undefined) },
    );
    if (!res.ok) {
      throw new Error(`API Error: ${await res.text()}`);
    }
    const data = await res.json();
    return data.records || [];
  }

  async findFirst(args?: {
    where?: Record<string, any>;
    include?: Record<string, boolean>;
  }): Promise<T | null> {
    const records = await this.findMany(args);
    return records.length > 0 ? records[0] : null;
  }

  async findUnique(args: {
    where: Record<string, any>;
    include?: Record<string, boolean>;
  }): Promise<T | null> {
    if (args.where.id) {
      let url = `${BASE_URL}/${this.tableName}/${args.where.id}`;
      if (args.include) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(args.include)) {
          if (value) params.append("join", key);
        }
        url += `?${params.toString()}`;
      }
      const res = await fetch(url, {
        cache: "no-store",
        ...(this.fetchOptions || undefined),
      });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`API Error: ${await res.text()}`);
      }
      return await res.json();
    }
    return this.findFirst(args);
  }

  async create(args: { data: Record<string, any> }): Promise<T> {
    const formattedData = formatDataForDb(args.data);
    const res = await fetch(`${BASE_URL}/${this.tableName}`, {
      method: "POST",
      body: JSON.stringify(formattedData),
      cache: "no-store",
      ...(this.fetchOptions || undefined),
      headers: {
        "Content-Type": "application/json",
        ...this.fetchOptions?.headers,
      },
    });
    if (!res.ok)
      throw new Error(`Failed to create ${this.tableName}, ${res.status}`);
    const id = await res.json();
    return (await this.findUnique({ where: { id } })) as T;
  }

  async update(args: {
    where: Record<string, any>;
    data: Record<string, any>;
  }): Promise<T> {
    let id = args.where.id;
    if (!id) {
      const res = (await this.findFirst(args)) as any;
      if (!res) throw new Error(`[404] Record Not Found`);
      if (!res.id) throw new Error(`id not found`);
      id = res.id;
    }
    const formattedData = formatDataForDb(args.data);
    const res = await fetch(`${BASE_URL}/${this.tableName}/${id}`, {
      method: "PUT",
      body: JSON.stringify(formattedData),
      cache: "no-store",
      ...(this.fetchOptions || undefined),
      headers: {
        "Content-Type": "application/json",
        ...(this.fetchOptions?.headers || undefined),
      },
    });
    if (!res.ok) throw new Error(`Failed to update ${this.tableName}`);
    const resText = await res.text();
    if (Number.parseInt(resText, 10) === 0)
      throw new Error(`[404] Record Not Found`);
    return (await this.findUnique({ where: { id } })) as T;
  }

  async delete(args: { where: Record<string, any> }): Promise<void> {
    let id = args.where.id;
    if (!id) {
      const res = (await this.findFirst(args)) as any;
      if (!res) throw new Error(`[404] Record Not Found`);
      if (!res.id) throw new Error(`id not found`);
      id = res.id;
    }
    const res = await fetch(`${BASE_URL}/${this.tableName}/${id}`, {
      method: "DELETE",
      cache: "no-store",
      ...(this.fetchOptions || undefined),
    });
    if (!res.ok) throw new Error(`Failed to delete ${this.tableName}`);
  }

  async count(args?: { where?: Record<string, any> }): Promise<number> {
    const res = await this.findMany(args);
    return res.length;
  }

  async upsert(args: {
    where: Record<string, any>;
    update: Record<string, any>;
    create: Record<string, any>;
  }): Promise<T> {
    // argsの中に update や create も含まれているので、where だけを抽出して渡す
    const exist = await this.findUnique({ where: args.where });

    if (!exist) {
      // 存在しない場合は create
      return await this.create({ data: args.create });
    } else {
      let id = args.where.id;
      if (!id) {
        const res = (await this.findFirst(args)) as any;
        if (!res) throw new Error(`[404] Record Not Found`);
        if (!res.id) throw new Error(`id not found`);
        id = res.id;
      }
      // 存在する場合は update して結果を返す
      return await this.update({
        where: { id: id },
        data: args.update,
      });
    }
  }
}

// ==========================================
// クライアント本体
// ==========================================
class CrudClient {
  constructor(private fetchOptions?: RequestInit) {}
  user = new ModelDelegate("user", this.fetchOptions);
  session = new ModelDelegate("session", this.fetchOptions);
  account = new ModelDelegate("account", this.fetchOptions);
  verification = new ModelDelegate("verification", this.fetchOptions);
  book = new ModelDelegate("book", this.fetchOptions);
  rental = new ModelDelegate("rental", this.fetchOptions);
  campus = new ModelDelegate("campus", this.fetchOptions);
  passkey = new ModelDelegate("passkey", this.fetchOptions);
  pushSubscription = new ModelDelegate("push_subscription", this.fetchOptions);

  // スキーマにないテーブルにアクセスしたくなった時用
  model(tableName: string) {
    return new ModelDelegate(tableName, this.fetchOptions);
  }
  }
}

export const dbClient = new CrudClient({
  headers: process.env.PHP_CRUD_API_APIKEY
    ? {
        "X-API-KEY": process.env.PHP_CRUD_API_APIKEY,
      }
    : undefined,
});
