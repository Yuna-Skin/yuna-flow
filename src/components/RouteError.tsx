import { useRouter } from "@tanstack/react-router";

type Props = {
  error: Error;
  reset: () => void;
};

export function RouteError({ error, reset }: Props) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h2 className="font-display text-2xl text-foreground">Algo deu errado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Não conseguimos carregar este conteúdo agora.
        </p>
        {import.meta.env.DEV && error?.message && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-muted p-3 text-left font-mono text-xs text-destructive">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
