import { Link } from "@tanstack/react-router";

export function RouteNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h2 className="font-display text-2xl text-foreground">Conteúdo não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O que você procura pode ter sido removido ou nunca existiu.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}
