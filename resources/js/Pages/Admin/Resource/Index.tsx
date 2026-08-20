import { Link, router } from "@inertiajs/react";
import { Check, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/Components/admin/ui";
import ResourceTable, { type Column } from "@/Components/admin/ResourceTable";
import AdminLayout from "@/Layouts/AdminLayout";
import type { Paginated, ResourceSchema } from "@/lib/types";

type Row = { id: number } & Record<string, unknown>;

/**
 * شاشة قائمة عامة لأي ريسورس — بتتبني من schema الكنترولر،
 * فمفيش صفحة مخصوصة لكل موديول.
 */
export default function ResourceIndex({
    resource,
    rows,
}: {
    resource: ResourceSchema;
    rows: Paginated<Row>;
}) {
    const columns: Column<Row>[] = Object.entries(resource.columns).map(([key, label], i) => ({
        key,
        label,
        render: (row) => {
            const v = row[key];

            // _self بيتبعت من الكنترولر عشان الصف بتاع حسابك يبان
            if (i === 0 && row._self) {
                return (
                    <span className="flex items-center gap-2">
                        <span className="line-clamp-1">{String(v ?? "—")}</span>
                        <span className="shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-extrabold text-secondary">
                            أنت
                        </span>
                    </span>
                );
            }

            if (typeof v === "boolean") {
                return v ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-extrabold text-success">
                        <Check size={12} /> نعم
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-extrabold text-gray-500">
                        <X size={12} /> لا
                    </span>
                );
            }

            if (key === "purpose") return v === "rent" ? "إيجار" : "بيع";

            const text = v === null || v === undefined || v === "" ? "—" : String(v);
            return <span className="line-clamp-1">{text}</span>;
        },
    }));

    const remove = (row: Row) => {
        if (!confirm(`متأكد من حذف "${row.name ?? row.title ?? row.id}"؟`)) return;
        router.delete(`/admin/${resource.key}/${row.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={resource.labels.plural}>
            <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    إجمالي <span className="font-extrabold text-gray-800">{rows.total}</span> {resource.labels.singular}
                </p>
                <Link href={`/admin/${resource.key}/create`}>
                    <Button>
                        <span className="flex items-center gap-2">
                            <Plus size={16} />
                            إضافة {resource.labels.singular}
                        </span>
                    </Button>
                </Link>
            </div>

            <ResourceTable
                columns={columns}
                paginator={rows}
                searchPlaceholder={`ابحث في ${resource.labels.plural}…`}
                empty={`مفيش ${resource.labels.plural} لسه — ابدأ بإضافة ${resource.labels.singular}.`}
                actions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                        <Link
                            href={`/admin/${resource.key}/${row.id}/edit`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-secondary"
                            aria-label="تعديل"
                        >
                            <Pencil size={15} />
                        </Link>
                        {row._locked ? (
                            <span
                                className="cursor-not-allowed rounded-lg p-2 text-gray-300"
                                title="محمي من الحذف"
                                aria-label="محمي من الحذف"
                            >
                                <Lock size={15} />
                            </span>
                        ) : (
                            <button
                                onClick={() => remove(row)}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-danger/10 hover:text-danger"
                                aria-label="حذف"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                    </div>
                )}
            />
        </AdminLayout>
    );
}
