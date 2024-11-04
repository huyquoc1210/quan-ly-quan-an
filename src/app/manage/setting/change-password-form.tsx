"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useChangePasswordMutation } from "@/queries/useAccount";
import { toast } from "@/hooks/use-toast";
import {
  handleErrorApi,
  setAccessTokenFromLocalStorage,
  setRefreshTokenFromLocalStorage,
} from "@/lib/utils";

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation();
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return;
    try {
      const result = changePasswordMutation.mutateAsync(values);
      setAccessTokenFromLocalStorage((await result).payload.data.accessToken);
      setRefreshTokenFromLocalStorage((await result).payload.data.refreshToken);
      toast({
        description: (await result).payload.message,
      });
      form.reset();
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.statusCode === 422 && Array.isArray(errorData.errors)) {
        // Xử lý các lỗi validation
        errorData.errors.forEach((err: { field: string; message: string }) => {
          form.setError(err.field as keyof ChangePasswordBodyType, {
            type: "manual",
            message: err.message,
          });
        });

        // Hiển thị toast thông báo lỗi
        toast({
          variant: "destructive",
          description: errorData.message,
        });
      } else {
        // Xử lý các lỗi khác
        toast({
          variant: "destructive",
          description:
            error?.response?.data?.message ||
            "Mật khẩu cũ không khớp đổi mật khẩu",
        });
      }
    }
  };

  const reset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        autoComplete="old-password"
                        id="oldPassword"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        autoComplete="new-password"
                        id="password"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        autoComplete="new-password"
                        id="confirmPassword"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
