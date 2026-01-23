"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Vérifier si l'email vient d'être vérifié via le callback
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setIsVerified(true);
      localStorage.removeItem("pending_verification_email");
      toast.success("Email vérifié avec succès");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
      return;
    }

    // Récupérer l'email depuis les paramètres ou le localStorage
    const storedEmail =
      searchParams.get("email") ||
      localStorage.getItem("pending_verification_email");
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.setItem("pending_verification_email", storedEmail);
    }

    // Vérifier si l'email est vérifié via le token dans l'URL
    const token = searchParams.get("token");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // Vérifier l'email avec le token (si présent dans l'URL)
    if ((token || tokenHash) && type === "email") {
      supabase.auth
        .verifyOtp({
          token_hash: tokenHash || token || "",
          type: "email",
        })
        .then(({ data, error }) => {
          if (error) {
            toast.error("Erreur de vérification", {
              description: error.message,
            });
          } else if (data.user) {
            setIsVerified(true);
            localStorage.removeItem("pending_verification_email");
            toast.success("Email vérifié avec succès");
            // Rediriger vers le dashboard après 2 secondes
            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 2000);
          }
        });
    }
  }, [searchParams, router, supabase.auth]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email non trouvé");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      toast.success("Email de vérification renvoyé", {
        description: "Vérifiez votre boîte de réception",
      });
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi", {
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email vérifié !
            </CardTitle>
            <CardDescription>
              Votre compte a été vérifié avec succès. Redirection en cours...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Vérifiez votre email
          </CardTitle>
          <CardDescription>
            Un email de vérification a été envoyé à votre adresse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="text-sm font-medium">{email}</p>
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Étapes à suivre :</strong>
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Ouvrez votre boîte de réception</li>
              <li>Cliquez sur le lien de vérification dans&apos;email</li>
              <li>Revenez ici pour vous connecter</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || !email}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Renvoyer &apos;email de vérification
                </>
              )}
            </Button>

            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>

          <div className="pt-4 text-center text-xs text-muted-foreground">
            <p>
              Vous n&apos;avez pas reçu l&apos;email ? Vérifiez votre dossier
              spam ou{" "}
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-primary hover:underline"
              >
                renvoyez-le
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
