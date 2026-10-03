"use client";

import { useActionState, useState, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createProduct,
  updateProduct,
  type ActionState,
} from "@/app/admin/products/actions";
import type { Product, ProductColor } from "@/types/product";
import { compressImage } from "@/lib/utils/image";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

interface ImageItem {
  id: string;
  url?: string;
  file?: File;
  previewUrl: string;
  isExisting: boolean;
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const actionFunction =
    isEditing && product ? updateProduct.bind(null, product.id) : createProduct;

  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(actionFunction, null);

  // Initial images from product
  const initialImages: ImageItem[] = (() => {
    if (product?.gallery_images && product.gallery_images.length > 0) {
      return product.gallery_images.map((url, idx) => ({
        id: `existing-${idx}`,
        url,
        previewUrl: url,
        isExisting: true,
      }));
    }
    if (product?.image_url) {
      return [
        {
          id: "existing-0",
          url: product.image_url,
          previewUrl: product.image_url,
          isExisting: true,
        },
      ];
    }
    return [];
  })();

  const [imageList, setImageList] = useState<ImageItem[]>(initialImages);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // State for Colors
  const [colors, setColors] = useState<ProductColor[]>(product?.colors || []);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#2C2A28");

  // State for Specs (Key-Value)
  const initialSpecs = product?.specs
    ? Object.entries(product.specs).map(([label, value]) => ({
        label,
        value: String(value),
      }))
    : [];
  const [specsList, setSpecsList] =
    useState<{ label: string; value: string }[]>(initialSpecs);
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // State for Highlights
  const [highlights, setHighlights] = useState<string[]>(
    product?.highlights || [],
  );
  const [newHighlight, setNewHighlight] = useState("");

  // Handle Multi-file selection
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = Array.from(files).map((file, idx) => ({
      id: `new-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImageList((prev) => [...prev, ...newItems]);
    // Reset file input value so user can pick again if needed
    e.target.value = "";
  };

  const addImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      alert("يرجى إدخال رابط يبدأ بـ http:// أو https://");
      return;
    }
    const newItem: ImageItem = {
      id: `url-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: trimmed,
      previewUrl: trimmed,
      isExisting: true,
    };
    setImageList((prev) => [...prev, newItem]);
    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const makePrimaryImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setSpecsList([
      ...specsList,
      { label: newSpecLabel.trim(), value: newSpecValue.trim() },
    ]);
    setNewSpecLabel("");
    setNewSpecValue("");
  };

  const removeSpec = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight("");
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const specsObject = specsList.reduce(
    (acc, curr) => {
      acc[curr.label] = curr.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const [isUploading, setIsUploading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setClientError(null);
    setIsUploading(true);

    try {
      formData.delete("gallery_files");
      formData.delete("retained_gallery_images");
      formData.delete("gallery_order");

      let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
      try {
        supabaseClient = createBrowserClient();
      } catch (e) {
        console.warn("Supabase browser client init warning:", e);
      }

      const resolvedGalleryOrder: Array<{
        type: "existing" | "new";
        url?: string;
        index?: number;
      }> = [];

      let serverFileCounter = 0;

      for (const item of imageList) {
        if (item.url && !item.file) {
          resolvedGalleryOrder.push({ type: "existing", url: item.url });
        } else if (item.file) {
          let fileToSend = item.file;
          // 1. Compress image in browser to keep it lightweight (< 300KB)
          try {
            fileToSend = await compressImage(item.file);
          } catch (compErr) {
            console.warn("Compression fallback:", compErr);
          }

          let directUploadedUrl: string | null = null;

          // 2. Direct upload to Supabase storage from browser (bypassing Vercel completely)
          if (supabaseClient) {
            try {
              const fileExt =
                fileToSend.name.split(".").pop()?.toLowerCase() || "webp";
              const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

              const { data: uploadData, error: uploadErr } =
                await supabaseClient.storage
                  .from("products")
                  .upload(cleanFileName, fileToSend, {
                    contentType: fileToSend.type || "image/webp",
                    upsert: true,
                  });

              if (!uploadErr && uploadData) {
                const { data: publicUrlData } = supabaseClient.storage
                  .from("products")
                  .getPublicUrl(cleanFileName);
                directUploadedUrl = publicUrlData.publicUrl;
              }
            } catch (storageErr) {
              console.warn("Client direct upload failed, fallback to server action:", storageErr);
            }
          }

          if (directUploadedUrl) {
            // Successfully uploaded directly! No binary sent to Vercel
            resolvedGalleryOrder.push({
              type: "existing",
              url: directUploadedUrl,
            });
          } else {
            // Fallback: send lightweight compressed file to server action
            formData.append("gallery_files", fileToSend);
            resolvedGalleryOrder.push({
              type: "new",
              index: serverFileCounter,
            });
            serverFileCounter++;
          }
        }
      }

      formData.append("gallery_order", JSON.stringify(resolvedGalleryOrder));

      const retainedExistingUrls = resolvedGalleryOrder
        .filter((item) => item.type === "existing" && item.url)
        .map((item) => item.url as string);
      formData.append(
        "retained_gallery_images",
        JSON.stringify(retainedExistingUrls),
      );

      startTransition(() => {
        formAction(formData);
      });
    } catch (err: unknown) {
      setClientError((err as Error).message || "حدث خطأ أثناء معالجة الصور.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      action={handleFormSubmit}
      className="space-y-6 max-w-4xl text-start"
      dir="rtl"
    >
      {/* Hidden inputs to pass data */}
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />
      <input type="hidden" name="specs" value={JSON.stringify(specsObject)} />
      <input
        type="hidden"
        name="highlights"
        value={JSON.stringify(highlights)}
      />

      {/* Error Alert */}
      {(state?.error || clientError) && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-alexandria text-red-700"
        >
          <p className="font-bold">{clientError || state?.error}</p>
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          1. المعلومات الأساسية
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="name"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              اسم المنتج *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={product?.name || ""}
              placeholder="مثال: iPhone 16 Pro"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="slug"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              الرابط الدائم (Slug)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={product?.slug || ""}
              placeholder="يُنشأ تلقائيًا من الاسم إذا تُرك فارغًا"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors font-mono text-xs"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="brand"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              العلامة التجارية (Brand)
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              defaultValue={product?.brand || ""}
              placeholder="مثال: Apple, Samsung, Anker"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              القسم (Category)
            </label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category || "smartphones"}
              className="w-full h-11 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors cursor-pointer"
            >
              <option value="smartphones">الهواتف الذكية (smartphones)</option>
              <option value="laptops">اللابتوبات (laptops)</option>
              <option value="tablets">التابلت (tablets)</option>
              <option value="wearables">الساعات الذكية (wearables)</option>
              <option value="audio">السماعات (audio)</option>
              <option value="accessories">
                إكسسوارات الهواتف (accessories)
              </option>
              <option value="chargers">الشواحن (chargers)</option>
              <option value="cables">الكابلات (cables)</option>
              <option value="powerbanks">الباور بانك (powerbanks)</option>
              <option value="cases">حافظات الهواتف (cases)</option>
              <option value="screen-protectors">
                واقيات الشاشة (screen-protectors)
              </option>
              <option value="laptop-accessories">
                إكسسوارات اللابتوب (laptop-accessories)
              </option>
              <option value="social-media-creator">
                أدوات صناعة المحتوى (social-media-creator)
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="available_branches"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              توفر المنتج في الفروع
            </label>
            <select
              id="available_branches"
              name="available_branches"
              defaultValue={product?.available_branches || "all"}
              className="w-full h-11 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors cursor-pointer"
            >
              <option value="all">كافة الفروع (المحلة وسمنود)</option>
              <option value="mahalla">فرع المحلة الكبرى فقط</option>
              <option value="samanoud">فرع سمنود فقط</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="description"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              وصف المنتج
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description || ""}
              placeholder="نبذة مختصرة ومواصفات تسويقية للمنتج..."
              className="w-full p-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Pricing & Stock */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          2. السعر والمخزون
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="price"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              سعر البيع (ج.م) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product?.price || ""}
              placeholder="69900"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="compare_at_price"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              السعر قبل الخصم (ج.م)
            </label>
            <input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              step="0.01"
              defaultValue={product?.compare_at_price || ""}
              placeholder="74000"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="stock"
              className="block font-alexandria font-semibold text-xs text-[#1F1F1F]"
            >
              المخزون المتوفر (قطع) *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              required
              defaultValue={product?.stock ?? 10}
              placeholder="10"
              className="w-full h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-sm text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Product Photos (Premium UI/UX Gallery Manager) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-6">
        <div className="border-b border-[#F2EEE8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-marhey font-bold text-lg text-[#1F1F1F]">
              3. صور المنتج ومعرض الصور
            </h2>
            <p className="font-alexandria text-xs text-muted-text mt-0.5">
              الصورة الأولى تمثل الغلاف الرئيسي في المتجر. يمكنك السحب أو الضغط
              لإضافة عدة زوايا للمنتج.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-alexandria font-bold text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-dark border border-gold/20">
              {imageList.length}{" "}
              {imageList.length === 1 ? "صورة مختارة" : "صور مختارة"}
            </span>
          </div>
        </div>

        {/* Gallery Visual Workspace */}
        {imageList.length > 0 ? (
          <div className="space-y-4">
            {/* Primary Cover Highlight Card */}
            <div className="bg-[#FCFBF8] border-2 border-gold/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white border border-border-light overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                <Image
                  src={imageList[0].previewUrl}
                  alt="الصورة الرئيسية"
                  fill
                  sizes="176px"
                  className="object-contain p-3"
                  priority
                />
                <span className="absolute top-2 right-2 bg-gold text-white font-alexandria font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                  الغلاف الرئيسي ★
                </span>
              </div>

              <div className="flex-1 w-full space-y-2 text-start">
                <div className="space-y-1">
                  <span className="font-alexandria font-bold text-xs text-gold-dark block">
                    الصورة المعروضة في بطاقة المنتج وقوائم البحث
                  </span>
                  <p className="font-alexandria text-xs text-[#1F1F1F] leading-relaxed">
                    هذه هي الصورة التي يراها العميل كواجهة أساسية. يمكنك النقر
                    على زر &quot;تعيين كرئيسية&quot; في أي من الصور بالأسفل
                    لتغيير صورة الغلاف.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F2EEE8] font-alexandria text-[11px] text-muted-text">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {imageList[0].isExisting
                      ? "صورة مخزنة بالسيرفر"
                      : "جاهزة للرفع"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="font-alexandria text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    حذف الغلاف
                  </button>
                </div>
              </div>
            </div>

            {/* Sub Gallery Thumbnails Strip */}
            {imageList.length > 1 && (
              <div className="space-y-2 pt-2">
                <span className="font-alexandria font-bold text-xs text-[#1F1F1F] block">
                  باقي صور المعرض ({imageList.length - 1}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {imageList.slice(1).map((item, idx) => {
                    const actualIndex = idx + 1;
                    return (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-2xl bg-[#FCFBF8] border border-[#DCD4CA] hover:border-gold overflow-hidden group transition-all shadow-2xs"
                      >
                        <Image
                          src={item.previewUrl}
                          alt={`معرض ${actualIndex}`}
                          fill
                          sizes="160px"
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Index Badge */}
                        <span className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          #{actualIndex + 1}
                        </span>

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-[1px]">
                          <button
                            type="button"
                            onClick={() => makePrimaryImage(actualIndex)}
                            className="w-full py-1 px-2 bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[10px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                          >
                            تعيين كرئيسية ★
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(actualIndex)}
                            className="py-1 px-3 bg-red-600/90 hover:bg-red-600 text-white font-alexandria font-medium text-[10px] rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Dropzone Upload Button */}
        <label className="border-2 border-dashed border-[#DCD4CA] hover:border-gold rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3.5 cursor-pointer bg-[#FCFBF8] hover:bg-[#F9F6F0] transition-all text-center group">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-white transition-all flex items-center justify-center shadow-xs">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-alexandria font-bold text-sm text-[#1F1F1F] group-hover:text-gold-dark transition-colors">
              + إضافة صور للمنتج من جهازك
            </p>
            <p className="font-alexandria text-xs text-muted-text">
              يمكنك تحديد صورة أو عدة صور معًا (PNG, JPG, WEBP)
            </p>
          </div>
          <input
            type="file"
            name="gallery_files"
            multiple
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFilesSelected}
            className="hidden"
          />
        </label>

        {/* Or Direct Image URL Input */}
        <div className="pt-2 border-t border-[#F2EEE8]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="أو أدخل رابط صورة مباشر (مثال: https://...)"
              className="flex-1 h-11 px-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors"
              dir="ltr"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="h-11 px-5 bg-[#F2EEE8] hover:bg-gold hover:text-white text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              + إضافة رابط الصورة
            </button>
          </div>
        </div>
      </div>

      {/* 4. Colors Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          4. الألوان المتاحة
        </h2>

        {/* Existing Colors List */}
        <div className="flex flex-wrap gap-2">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2EEE8] border border-[#DCD4CA] font-alexandria text-xs"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-semibold">{c.name}</span>
              <button
                type="button"
                onClick={() => removeColor(idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Color Form */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="اسم اللون (مثال: تيتانيوم أسود)"
            className="flex-1 min-w-45 h-10 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold"
          />
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="w-12 h-10 p-1 bg-white border border-[#DCD4CA] rounded-xl cursor-pointer"
            title="اختر رمز اللون"
          />
          <button
            type="button"
            onClick={addColor}
            className="h-10 px-4 bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            + إضافة لون
          </button>
        </div>
      </div>

      {/* 5. Specifications Table Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          5. المواصفات الفنية
        </h2>

        {/* Existing Specs */}
        <div className="divide-y divide-[#F2EEE8]">
          {specsList.map((s, idx) => (
            <div
              key={idx}
              className="py-2.5 flex items-center justify-between gap-4 font-alexandria text-xs"
            >
              <span className="font-bold text-[#1F1F1F]">{s.label}</span>
              <span className="text-muted-text">{s.value}</span>
              <button
                type="button"
                onClick={() => removeSpec(idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Spec Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <input
            type="text"
            value={newSpecLabel}
            onChange={(e) => setNewSpecLabel(e.target.value)}
            placeholder="البند (مثال: الشاشة)"
            className="w-full sm:w-1/3 h-10 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold"
          />
          <input
            type="text"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder="القيمة (مثال: 6.3 بوصة Super Retina XDR)"
            className="w-full sm:flex-1 h-10 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={addSpec}
            className="w-full sm:w-auto h-10 px-4 bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
          >
            + إضافة مواصفة
          </button>
        </div>
      </div>

      {/* 6. Highlights List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          6. أبرز المميزات
        </h2>

        {/* Existing Highlights */}
        <ul className="space-y-2">
          {highlights.map((h, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FCFBF8] border border-border-light font-alexandria text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold">◆</span>
                <span className="text-[#1F1F1F]">{h}</span>
              </div>
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-red-500 hover:text-red-700 cursor-pointer font-bold px-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Add Highlight */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="ميزة جديدة (مثال: تصوير سينمائي 4K)"
            className="flex-1 h-10 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={addHighlight}
            className="h-10 px-4 bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
          >
            + إضافة ميزة
          </button>
        </div>
      </div>

      {/* 7. Status & Toggles */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border-light shadow-xs space-y-4">
        <h2 className="font-marhey font-bold text-lg text-[#1F1F1F] border-b border-[#F2EEE8] pb-3">
          7. حالة المنتج بالمتجر
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#FCFBF8] border border-border-light cursor-pointer hover:border-gold transition-colors">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? product.is_active : true}
              className="w-5 h-5 rounded-md accent-gold cursor-pointer"
            />
            <div>
              <span className="font-alexandria font-bold text-xs text-[#1F1F1F] block">
                تفعيل المنتج بالمتجر (نشط)
              </span>
              <span className="font-alexandria text-[11px] text-muted-text">
                يظهر المنتج للعملاء في قوائم البحث والأقسام
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#FCFBF8] border border-border-light cursor-pointer hover:border-gold transition-colors">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product ? product.is_featured : false}
              className="w-5 h-5 rounded-md accent-gold cursor-pointer"
            />
            <div>
              <span className="font-alexandria font-bold text-xs text-[#1F1F1F] block">
                منتج مميز (الصفحة الرئيسية)
              </span>
              <span className="font-alexandria text-[11px] text-muted-text">
                يظهر في سلايدر المنتجات المميزة بالرئيسية
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="h-12 px-6 rounded-2xl bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs flex items-center justify-center transition-colors"
        >
          إلغاء
        </Link>

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="h-12 px-8 rounded-2xl bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-xs shadow-md shadow-gold/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isUploading
            ? "جاري رفع ومعالجة الصور..."
            : isPending
              ? "جاري الحفظ..."
              : isEditing
                ? "تحديث المنتج"
                : "حفظ ونشر المنتج"}
        </button>
      </div>
    </form>
  );
}
