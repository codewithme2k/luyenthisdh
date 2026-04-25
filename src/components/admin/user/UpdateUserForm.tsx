"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditUserSchema } from "@/shared/schemas";
import Image from "next/image";
import { actionClassName } from "@/shared/constants";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { User } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormError } from "@/components/customs/form-error";
import { FormSucess } from "@/components/customs/form-sucess";
import { UpdateUserForm } from "@/shared/actions/setting.action";

const EditUserForm = ({ user, id }: { user: User; id: string }) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      image: user?.image || undefined,
      role: user.role,
    },
  });
  const image = useWatch({
    control: form.control,
    name: "image",
  });
  const onSubmit = (values: z.infer<typeof EditUserSchema>) => {
    startTransition(() => {
      UpdateUserForm(values, id)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="">
      <Form {...form}>
        <form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-3 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Ảnh đại diện</FormLabel>
                    <FormControl>
                      <>
                        {image ? (
                          <div className="relative group">
                            <Image
                              src={image}
                              alt="Blog Image"
                              width={800}
                              height={400}
                              className="w-full h-[250px] rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              className={cn(
                                actionClassName,
                                "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:bg-red-500 hover:!text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                              )}
                              onClick={() => form.setValue("image", "")}
                            >
                              <CircleX />
                            </button>
                          </div>
                        ) : (
                          <UploadDropzone
                            className="justify-center items-center bg-white dark:bg-grayDarker rounded-lg h-[250px]"
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) =>
                              form.setValue("image", res[0].ufsUrl)
                            }
                            onUploadError={(error: Error) =>
                              alert(`ERROR! ${error.message}`)
                            }
                            config={{ mode: "auto" }}
                          />
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormError message={error} />
          <FormSucess message={success} />
          <Button type="submit" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUserForm;
