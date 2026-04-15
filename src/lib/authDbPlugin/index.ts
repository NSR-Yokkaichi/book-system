/** biome-ignore-all lint/suspicious/noExplicitAny: このPHP CRUD APIは任意のテーブルのレコードを編集するため、型定義ができない */
import {
  createAdapterFactory,
  type DBAdapterDebugLogOption,
  type Where,
} from "better-auth/adapters";

export interface CustomAdapterConfig {
  baseURL: string;
  fetchOptions?: RequestInit;
  debugLogs?: DBAdapterDebugLogOption;
  usePlural?: boolean;
}

type DBRecord = Record<string, any>;

// DateオブジェクトをMySQLの "YYYY-MM-DD HH:MM:SS" 形式に変換する関数
const formatDatesForMySQL = (data: Record<string, any>) => {
  const formatted = { ...data };
  for (const [key, value] of Object.entries(formatted)) {
    if (value instanceof Date) {
      formatted[key] = value.toISOString().slice(0, 19).replace("T", " ");
    }
  }
  return formatted;
};

export const phpCrudApiAdapter = (config: CustomAdapterConfig) =>
  createAdapterFactory({
    config: {
      adapterId: "php-crud-api",
      adapterName: "PHP CRUD API",
      usePlural: config.usePlural ?? false,
      debugLogs: config.debugLogs ?? false,
      supportsJSON: false,
      supportsDates: true,
      supportsBooleans: true,
      supportsNumericIds: true,
    },
    adapter: (_adapterOptions) => {
      const baseURL = `${config.baseURL}/records`;
      const getTableName = (model: string) => {
        return config.usePlural ? `${model}s` : model;
      };

      const buildQuery = (where?: Where[]) => {
        if (!where || where.length === 0) return "";
        const params = new URLSearchParams();
        where.forEach((w) => {
          const operator = w.operator || "eq";
          let val = w.value;

          // where句にDateオブジェクトが含まれていた場合の変換
          if (val instanceof Date) {
            val = val.toISOString().slice(0, 19).replace("T", " ");
          }

          params.append("filter", `${w.field},${operator},${String(val)}`);
        });
        return `?${params.toString()}`;
      };

      return {
        id: "php-crud-api",

        async create({ model, data }) {
          const table = getTableName(model);
          const formattedData = formatDatesForMySQL(
            data as Record<string, any>,
          );

          const response = await fetch(`${baseURL}/${table}`, {
            method: "POST",
            body: JSON.stringify(formattedData),
            ...config.fetchOptions,
            headers: {
              "Content-Type": "application/json",
              ...config.fetchOptions?.headers,
            },
          });

          if (!response.ok) {
            switch (response.status) {
              case 404:
                throw new Error(`Table ${table} not found`);
              case 409:
                throw new Error(`Record already exist`);
              default: {
                if (config.debugLogs) {
                  const resText = await response.text();
                  console.error(
                    `Failed to create record in ${table}: ${resText}`,
                  );
                }
                throw new Error(
                  `Failed to create record in ${table}: ${response.status}`,
                );  
              }
            }
          }

          const id = await response.json();
          const recordRes = await fetch(`${baseURL}/${table}/${id}`, {
            ...config.fetchOptions,
          });
          return recordRes.json();
        },

        async findOne({ model, where }) {
          const table = getTableName(model);
          const url = `${baseURL}/${table}${buildQuery(where)}`;

          const response = await fetch(url, { ...config.fetchOptions });
          if (!response.ok) return null;

          const data = await response.json();
          return data.records && data.records.length > 0
            ? data.records[0]
            : null;
        },

        async findMany({ model, where }) {
          const table = getTableName(model);
          const url = `${baseURL}/${table}${buildQuery(where)}`;

          const response = await fetch(url, { ...config.fetchOptions });
          if (!response.ok) return [];

          const data = await response.json();
          return data.records || [];
        },

        async update({ model, where, update }) {
          const existing = (await this.findOne({
            model,
            where,
          })) as DBRecord | null;
          if (!existing) return null;

          const table = getTableName(model);
          // 送信前にMySQL用のフォーマットに変換
          const formattedUpdate = formatDatesForMySQL(
            update as Record<string, any>,
          );

          const response = await fetch(`${baseURL}/${table}/${existing.id}`, {
            method: "PUT",
            body: JSON.stringify(formattedUpdate),
            ...config.fetchOptions,
            headers: {
              "Content-Type": "application/json",
              ...config.fetchOptions?.headers,
            },
          });

          if (!response.ok)
            throw new Error(`Failed to update record in ${table}`);

          const recordRes = await fetch(`${baseURL}/${table}/${existing.id}`, {
            ...config.fetchOptions,
          });
          return recordRes.json();
        },

        async updateMany({ model, where, update }) {
          const records = (await this.findMany({
            model,
            where,
            limit: 999999,
          })) as DBRecord[];
          const table = getTableName(model);
          // 送信前にMySQL用のフォーマットに変換
          const formattedUpdate = formatDatesForMySQL(update);
          let updatedCount = 0;

          for (const record of records) {
            const res = await fetch(`${baseURL}/${table}/${record.id}`, {
              method: "PUT",
              body: JSON.stringify(formattedUpdate),
              ...config.fetchOptions,
              headers: {
                "Content-Type": "application/json",
                ...config.fetchOptions?.headers,
              },
            });
            if (res.ok) updatedCount++;
          }
          return updatedCount;
        },

        async delete({ model, where }) {
          const existing = (await this.findOne({
            model,
            where,
          })) as DBRecord | null;
          if (!existing) return;

          const table = getTableName(model);
          await fetch(`${baseURL}/${table}/${existing.id}`, {
            method: "DELETE",
            ...config.fetchOptions,
          });
        },

        async deleteMany({ model, where }) {
          const records = (await this.findMany({
            model,
            where,
            limit: 999999,
          })) as DBRecord[];
          const table = getTableName(model);
          let deletedCount = 0;

          for (const record of records) {
            const res = await fetch(`${baseURL}/${table}/${record.id}`, {
              method: "DELETE",
              ...config.fetchOptions,
            });
            if (res.ok) deletedCount++;
          }

          return deletedCount;
        },

        async count({ model, where }) {
          const records = await this.findMany({ model, where, limit: 999999 });
          return records.length;
        },
      };
    },
  });
