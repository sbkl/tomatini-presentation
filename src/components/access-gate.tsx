"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const ACCESS_STORAGE_KEY = "sbkl-access";
const ACCESS_CODE_INPUT_ID = "access-code-input";
const DISCLAIMER_CHECKBOX_ID = "confidentiality-agreement";

type AccessGateProps = {
  children: ReactNode;
};

type AccessValidationResult = {
  authorized: boolean;
  message?: string;
};

type AccessStep = "code" | "disclaimer";

export function AccessGate({ children }: AccessGateProps) {
  const isMobile = useIsMobile();
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">("checking");
  const [step, setStep] = useState<AccessStep>("code");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCode = useCallback(async (nextCode: string): Promise<AccessValidationResult> => {
    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ code: nextCode }),
      });

      const body = (await response.json()) as AccessValidationResult;
      if (response.ok && body.authorized) {
        return { authorized: true };
      }

      return {
        authorized: false,
        message: body.message ?? "Invalid code",
      };
    } catch {
      return {
        authorized: false,
        message: "Unable to verify code. Please try again.",
      };
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verifyStoredCode = async () => {
      const storedCode = window.localStorage.getItem(ACCESS_STORAGE_KEY);
      if (!storedCode) {
        if (!cancelled) {
          setStep("code");
          setStatus("locked");
        }
        return;
      }

      const result = await validateCode(storedCode);
      if (cancelled) {
        return;
      }

      if (result.authorized) {
        setStatus("unlocked");
        return;
      }

      window.localStorage.removeItem(ACCESS_STORAGE_KEY);
      setCodeError("Saved access code is no longer valid. Enter the current code.");
      setStep("code");
      setStatus("locked");
    };

    verifyStoredCode();

    return () => {
      cancelled = true;
    };
  }, [validateCode]);

  useEffect(() => {
    if (status === "locked" && step === "code") {
      document.getElementById(ACCESS_CODE_INPUT_ID)?.focus();
    }
    if (status === "locked" && step === "disclaimer") {
      document.getElementById(DISCLAIMER_CHECKBOX_ID)?.focus();
    }
  }, [isMobile, status, step]);

  const handleLockedOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      return;
    }
  }, []);

  const handleCodeSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting || !code) {
        return;
      }

      setIsSubmitting(true);
      setCodeError(null);
      setAgreementError(null);

      const result = await validateCode(code);
      if (result.authorized) {
        setStep("disclaimer");
        setHasAcceptedDisclaimer(false);
        setIsSubmitting(false);
        return;
      }

      setCodeError(result.message ?? "Invalid code");
      setIsSubmitting(false);
    },
    [code, isSubmitting, validateCode],
  );

  const handleDisclaimerSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!hasAcceptedDisclaimer) {
        setAgreementError("You must confirm that you have read and agree to continue.");
        return;
      }

      setIsSubmitting(true);
      setAgreementError(null);

      const result = await validateCode(code);
      if (!result.authorized) {
        setStep("code");
        setHasAcceptedDisclaimer(false);
        setCodeError(
          "The access code could not be re-verified. Enter the current code and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      window.localStorage.setItem(ACCESS_STORAGE_KEY, code);
      setStatus("unlocked");
      setIsSubmitting(false);
    },
    [code, hasAcceptedDisclaimer, isSubmitting, validateCode],
  );

  if (status === "unlocked") {
    return <>{children}</>;
  }

  if (status === "checking") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <p className="text-center text-xs text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  const title = step === "code" ? "Access required" : "Confidentiality notice";
  const description =
    step === "code"
      ? "Enter the access code to continue."
      : "Review and acknowledge the confidentiality terms before continuing.";

  const form =
    step === "code" ? (
      <form className="mt-2 grid gap-3" onSubmit={handleCodeSubmit}>
        <Input
          id={ACCESS_CODE_INPUT_ID}
          type="password"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            if (codeError) {
              setCodeError(null);
            }
          }}
          placeholder="Enter access code"
          autoComplete="off"
        />
        {codeError ? (
          <p className="text-destructive text-xs" role="alert">
            {codeError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting || code.length === 0}>
          {isSubmitting ? "Verifying..." : "Verify code"}
        </Button>
      </form>
    ) : (
      <form className="mt-2 grid gap-3" onSubmit={handleDisclaimerSubmit}>
        <div className="grid gap-2 text-xs text-muted-foreground">
          <p>
            The concept and presentation content are owned by SBKL Limited, except for
            client-owned assets included in this presentation.
          </p>
          <p>
            This material is confidential. It may be used internally only for presentation and
            review.
          </p>
          <p>
            It must not be shared outside your organization, and it must not be used as a basis
            for development, including any design, UI, or UX implementation, without prior written
            approval from SBKL Limited.
          </p>
        </div>
        <label className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
          <Checkbox
            id={DISCLAIMER_CHECKBOX_ID}
            checked={hasAcceptedDisclaimer}
            onCheckedChange={(checked) => {
              setHasAcceptedDisclaimer(checked === true);
              if (agreementError) {
                setAgreementError(null);
              }
            }}
            aria-label="I have read and agree to these confidentiality terms"
            className="mt-0.5"
          />
          <span>I have read and agree to these confidentiality terms.</span>
        </label>
        {agreementError ? (
          <p className="text-destructive text-xs" role="alert">
            {agreementError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !hasAcceptedDisclaimer}>
          {isSubmitting ? "Finalizing..." : "Agree and continue"}
        </Button>
      </form>
    );

  return (
    <>
      <div aria-hidden className="min-h-svh bg-background" />

      {isMobile ? (
        <Sheet open onOpenChange={handleLockedOpenChange}>
          <SheetContent side="bottom" showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">{form}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <AlertDialog open onOpenChange={handleLockedOpenChange}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            {form}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
