"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DishStatus, DishStatusValues } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { getVietnameseDishStatus, handleErrorApi } from "@/lib/utils";
import { useGetDish, useUpdateDishMutation } from "@/queries/useDish";
import { useUploadMediaMutation } from "@/queries/useMedia";
import {
  DishParamsType,
  UpdateDishBody,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditDish({
  id,
  setId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const updateDishMutation = useUpdateDishMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const { data } = useGetDish({ id: id as number, enabled: Boolean(id) });
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable,
    },
  });

  const image = form.watch("image");
  const name = form.watch("name");

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  const reset = () => {
    setId(undefined);
    setFile(null);
  };

  const onSubmit = async (values: UpdateDishBodyType) => {
    if (updateDishMutation.isPending) return;
    try {
      let body: UpdateDishBodyType & DishParamsType = {
        id: id as number,
        ...values,
      };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = uploadImageResult.payload.data;
        body = {
          ...body,
          image: imageUrl,
        };
      }
      const result = await updateDishMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  useEffect(() => {
    if (data) {
      const { name, image, price, description, status } = data.payload.data;
      form.reset({
        name,
        description,
        price,
        image: image ?? undefined,
        status,
      });
    }
  }, [data, form]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>
            Các trường sau đây là bắt buộc: Tên, ảnh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">
                          {name || "Ảnh món ăn"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên món ăn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Mô tả sản phẩm</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          id="description"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-dish-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}