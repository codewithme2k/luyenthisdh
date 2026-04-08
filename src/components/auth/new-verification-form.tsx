"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormSucess } from "../customs/form-sucess";
import { FormError } from "../customs/form-error";
import { newVerification } from "@/shared/actions/new-verification";
import { Card } from "../ui/card";
import { Header } from "@/components/header";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Missing token!");
        setLoading(false);
        return;
      }

      try {
        const data = await newVerification(token);
        setSuccess(data.success);
        setError(data.error);
      } catch {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div>
      <Header />
      <Card className="w-full max-w-sm p-6 mx-auto mt-10 space-y-4 bg-white shadow-md rounded-xl">
        <div className="flex items-center justify-center w-full">
          {loading && "Loading..."}
          {!loading && <FormSucess message={success} />}
          {!loading && !success && <FormError message={error} />}
        </div>
      </Card>
    </div>
  );
};

export default NewVerificationForm;
